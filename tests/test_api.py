"""API and routing tests. Run from the repository root: pytest -q tests

Routing is tested on a small synthetic road grid with a known high-risk centre, so results can be
checked exactly and the tests run without the 150 MB Bengaluru graph.
"""

import os
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor

import networkx as nx
import pytest

os.environ["SAFEROUTE_DB"] = os.path.join(tempfile.mkdtemp(prefix="saferoute-test-"), "test.db")
os.environ["SAFEROUTE_ROUTE_LIMIT"] = "1000"
os.environ["SAFEROUTE_WARMUP"] = "0"

from backend import api as api_module  # noqa: E402
from backend import route_engine  # noqa: E402
from backend.route_engine import SafeRouter, haversine_m  # noqa: E402

BASE_LAT, BASE_LON, STEP = 12.95, 77.60, 0.004  # ~440 m grid spacing
AREAS = {"Centre": (BASE_LAT + 2 * STEP, BASE_LON + 2 * STEP), "Edge": (BASE_LAT - 0.05, BASE_LON - 0.05)}
RISK = {"Centre": {"Night": 0.95, "Morning": 0.6, "Afternoon": 0.6, "Evening": 0.9}, "Edge": dict.fromkeys(["Night", "Morning", "Afternoon", "Evening"], 0.05)}


def grid_graph(n=5):
    G = nx.MultiDiGraph()
    node = lambda i, j: i * n + j  # noqa: E731
    for i in range(n):
        for j in range(n):
            G.add_node(node(i, j), y=BASE_LAT + i * STEP, x=BASE_LON + j * STEP)
    for i in range(n):
        for j in range(n):
            for di, dj in ((0, 1), (1, 0)):
                a, b = (i, j), (i + di, j + dj)
                if b[0] >= n or b[1] >= n:
                    continue
                u, v = node(*a), node(*b)
                length = float(haversine_m(G.nodes[u]["y"], G.nodes[u]["x"], G.nodes[v]["y"], G.nodes[v]["x"]))
                for s, t in ((u, v), (v, u)):
                    G.add_edge(s, t, length=length, travel_time=length / (40 / 3.6), name=f"Road {min(s, t)}-{max(s, t)}")
    return G


def risk_fn(area, bucket):
    # The centre node's own area is "Centre"; nodes within ~700 m of it count as Centre too.
    return RISK[area][bucket]


class GridRouter(SafeRouter):
    """Grid router whose centre 3x3 block is the risky area."""

    def __init__(self):
        super().__init__(grid_graph(), AREAS, risk_fn)
        for n in self.G.nodes:
            i, j = divmod(n, 5)
            self.node_area[n] = "Centre" if 1 <= i <= 3 and 1 <= j <= 3 else "Edge"


@pytest.fixture(autouse=True)
def router(monkeypatch):
    r = GridRouter()
    monkeypatch.setattr(route_engine, "_router", r)
    api_module._hits.clear()
    return r


@pytest.fixture
def client():
    api_module.app.config["TESTING"] = True
    return api_module.app.test_client()


def corner(i, j):
    return {"lat": BASE_LAT + i * STEP, "lon": BASE_LON + j * STEP}


def post_route(client, **over):
    body = {"source": corner(2, 0), "destination": corner(2, 4), "hour": 22, "safety_weight": 5}
    body.update(over)
    return client.post("/api/v1/route", json=body)


# ---------------- routing behaviour ----------------
def test_fastest_goes_straight_through_and_safest_avoids_the_risky_centre(client):
    r = post_route(client)
    assert r.status_code == 200, r.get_json()
    d = r.get_json()
    fast, safe, cmp = d["fastest_route"], d, d["comparison"]
    # Fastest is the straight 4-segment line through the centre row.
    assert fast["route_points"] == 5
    # Safest is longer but has strictly lower exposure, and the comparison matches the two routes.
    assert safe["distance_km"] > fast["distance_km"]
    assert safe["average_risk"] < fast["average_risk"]
    assert cmp["same_route"] is False
    assert cmp["extra_distance_km"] == pytest.approx(safe["distance_km"] - fast["distance_km"], abs=0.011)
    assert cmp["exposure_reduction_pct"] == pytest.approx((fast["average_risk"] - safe["average_risk"]) / fast["average_risk"] * 100, abs=0.2)
    assert d["alternative_route"]["id"] == "route_fastest"


def test_safety_weight_zero_returns_the_fastest_route_and_says_so(client):
    d = post_route(client, safety_weight=0).get_json()
    assert d["comparison"]["same_route"] is True
    assert d["alternative_route"] is None
    assert d["comparison"]["exposure_reduction_pct"] == 0


def test_metrics_are_computed_not_invented(client, router):
    d = post_route(client).get_json()
    coords = d["coordinates"]
    length = sum(float(haversine_m(a[0], a[1], b[0], b[1])) for a, b in zip(coords, coords[1:]))
    assert d["distance_km"] == pytest.approx(length / 1000, abs=0.01)
    assert d["safety_score"] == router.relative(d["average_risk"], d["time_bucket"])[0]
    assert d["steps"][-1]["instruction"] == "Arrive at destination"
    assert sum(s["distance_m"] for s in d["steps"]) == pytest.approx(length, abs=len(d["steps"]))


def test_time_of_day_changes_the_risk_used(client):
    night = post_route(client, hour=2, safety_weight=0).get_json()
    morning = post_route(client, hour=9, safety_weight=0).get_json()
    assert night["time_bucket"] == "Night" and morning["time_bucket"] == "Morning"
    assert night["average_risk"] > morning["average_risk"]


def test_concurrent_requests_for_different_hours_do_not_interfere(client):
    expected = {h: post_route(client, hour=h).get_json()["average_risk"] for h in (2, 9)}
    app = api_module.app

    def call(h):
        with app.test_client() as c:
            return h, post_route(c, hour=h).get_json()["average_risk"]

    with ThreadPoolExecutor(8) as pool:
        results = list(pool.map(call, [2, 9] * 20))
    assert all(v == expected[h] for h, v in results)


def test_routing_does_not_modify_the_graph(client, router):
    before = {(u, v, k): dict(d) for u, v, k, d in router.G.edges(keys=True, data=True)}
    post_route(client)
    post_route(client, hour=3)
    assert before == {(u, v, k): dict(d) for u, v, k, d in router.G.edges(keys=True, data=True)}


# ---------------- validation ----------------
@pytest.mark.parametrize(
    "body, field",
    [
        ({}, "source"),
        ({"source": corner(0, 0)}, "destination"),
        ({"source": {"lat": "12.9", "lon": 77.6}, "destination": corner(1, 1)}, "lat"),
        ({"source": {"lat": 120, "lon": 77.6}, "destination": corner(1, 1)}, "lat"),
        ({"source": corner(0, 0), "destination": corner(1, 1), "hour": 99}, "hour"),
        ({"source": corner(0, 0), "destination": corner(1, 1), "hour": True}, "hour"),
        ({"source": corner(0, 0), "destination": corner(1, 1), "hour": 21.5}, "hour"),
        ({"source": corner(0, 0), "destination": corner(1, 1), "safety_weight": 11}, "safety_weight"),
    ],
)
def test_invalid_input_is_a_400_naming_the_field(client, body, field):
    r = client.post("/api/v1/route", json=body)
    assert r.status_code == 400
    assert r.get_json()["field"] == field


def test_non_json_is_415_and_huge_body_is_413(client):
    assert client.post("/api/v1/route", data="x", content_type="text/plain").status_code == 415
    assert client.post("/api/v1/route", data="{" + " " * 20000 + "}", content_type="application/json").status_code == 413


def test_points_outside_coverage_are_refused_not_snapped(client):
    r = post_route(client, source={"lat": 28.61, "lon": 77.21})  # New Delhi
    assert r.status_code == 422
    assert "Outside the area" in r.get_json()["error"]


def test_same_place_is_refused(client):
    assert post_route(client, destination=corner(2, 0)).status_code == 422


def test_route_requests_are_rate_limited(client, monkeypatch):
    monkeypatch.setattr(api_module, "ROUTE_LIMIT_PER_MIN", 3)
    codes = [post_route(client).status_code for _ in range(4)]
    assert codes == [200, 200, 200, 429]


# ---------------- data endpoints ----------------
def test_incidents_never_include_victim_attributes(client):
    d = client.get("/api/v1/incidents?limit=50").get_json()
    assert d["total"] > 1000 and len(d["items"]) == 50
    for item in d["items"]:
        assert "Victim_Age" not in item and "Victim_Gender" not in item
    assert d["dataset"] == "synthetic"


def test_incident_filters_and_pagination(client):
    high = client.get("/api/v1/incidents?severity=High&limit=10").get_json()
    assert all(i["Severity"] == "High" for i in high["items"])
    page2 = client.get("/api/v1/incidents?limit=10&offset=10").get_json()["items"]
    page1 = client.get("/api/v1/incidents?limit=10").get_json()["items"]
    assert {i["FIR_ID"] for i in page1}.isdisjoint({i["FIR_ID"] for i in page2})
    assert client.get("/api/v1/incidents?limit=0").status_code == 400
    assert client.get("/api/v1/incidents?severity=Extreme").status_code == 400
    assert client.get("/api/v1/incidents?bbox=1,2,3").status_code == 400


def test_stats_match_incident_totals(client):
    total = client.get("/api/v1/incidents?limit=1").get_json()["total"]
    for path, key in (("/api/v1/stats/area", "total_crimes"), ("/api/v1/stats/type", "total"), ("/api/v1/stats/severity", "total")):
        assert sum(r[key] for r in client.get(path).get_json()) == total


def test_sql_injection_in_filters_is_inert(client):
    r = client.get("/api/v1/incidents?area=x' OR '1'='1")
    assert r.status_code == 200 and r.get_json()["total"] == 0


def test_meta_states_the_data_is_synthetic(client):
    d = client.get("/api/v1/meta").get_json()["dataset"]
    assert d["kind"] == "synthetic" and "not police records" in d["description"]


# ---------------- hardening ----------------
def test_cors_only_for_configured_origins(client):
    evil = client.get("/api/v1/stats/area", headers={"Origin": "https://evil.example"})
    assert "Access-Control-Allow-Origin" not in evil.headers
    ok = client.get("/api/v1/stats/area", headers={"Origin": "http://localhost:5173"})
    assert ok.headers["Access-Control-Allow-Origin"] == "http://localhost:5173"


def test_security_headers_and_provenance_header(client):
    r = client.get("/api/v1/stats/type")
    assert r.headers["X-Content-Type-Options"] == "nosniff"
    assert r.headers["X-Frame-Options"] == "DENY"
    assert r.headers["X-Data-Provenance"] == "synthetic"


def test_errors_are_json_and_do_not_leak(client):
    r = client.get("/nope")
    assert r.status_code == 404 and r.get_json() == {"error": "Not found"}


def test_removed_unused_auth_endpoints_and_debugger_off(client):
    assert client.post("/auth/signup", json={"name": "a", "email": "b", "password": "c"}).status_code == 404
    assert api_module.app.debug is False


def test_areas_report_coverage(client, router):
    d = client.get("/api/v1/areas").get_json()
    assert d["road_graph"] == "loaded"
    names = {a["name"]: a for a in d["areas"]}
    assert "Koramangala" in names
    # The test grid sits around 12.95, 77.60: real Bengaluru areas far from it are reported as not covered.
    assert names["Yelahanka"]["covered"] is False


def test_relative_safety_is_against_the_city_at_that_hour(router):
    # Two areas: an exposure equal to the riskier one is "Higher risk"; below both is 100.
    assert router.relative(0.95, "Night") == (25, "Higher risk")
    assert router.relative(0.01, "Night") == (100, "Lower risk")


def test_only_dataset_endpoints_are_cacheable(client):
    assert client.get("/api/v1/stats/area").headers["Cache-Control"].startswith("public")
    for path in ("/api/v1/health", "/api/v1/areas"):
        assert client.get(path).headers["Cache-Control"] == "no-store"
    assert post_route(client).headers["Cache-Control"] == "no-store"
    assert client.get("/api/v1/incidents?limit=0").headers["Cache-Control"] == "no-store"  # errors never cached
