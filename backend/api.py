"""SafeRoute AI HTTP API (v1).

Run: flask --app backend.api run --port 5000   (from the repository root)

Design rules:
  * Every number the UI shows comes from here, computed on the real road graph and the dataset.
  * The bundled incident dataset is SYNTHETIC (generated with Faker). Every response that carries
    incident-derived numbers says so (`dataset` block / X-Data-Provenance header).
  * Victim attributes (age, gender) are never served.
  * No accounts: the app needs none to plan a route, and location history is sensitive.
    (The previous /auth/signup and /auth/login endpoints had no client and were removed.)
"""

from __future__ import annotations

import os
import sqlite3
import threading
import time
from collections import defaultdict, deque
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

load_dotenv()

from utils.logger import logger  # noqa: E402

DB_PATH = Path(os.getenv("SAFEROUTE_DB", "data/saferoute.db"))
CSV_PATH = Path("data/raw/crime_data.csv")
HOTSPOTS_PATH = Path("data/raw/hotspots.csv")
PUBLIC_FIELDS = ["FIR_ID", "Crime_Type", "Area", "Latitude", "Longitude", "Date", "Time", "Severity", "Status"]
SEVERITIES = {"High", "Medium", "Low"}
ROUTE_LIMIT_PER_MIN = int(os.getenv("SAFEROUTE_ROUTE_LIMIT", "30"))
CACHEABLE = ("/api/v1/stats/", "/api/v1/incidents", "/api/v1/hotspots", "/api/v1/meta")

DATASET = {
    "kind": "synthetic",
    "description": "Synthetic incidents generated with Faker for demonstration (backend/generate_synthetic_data.py). "
    "They are not police records and say nothing about real safety in any neighbourhood.",
    "generator": "backend/generate_synthetic_data.py",
    "real_data_note": "Bengaluru City Police publish only aggregate counts (data.opencity.in); no public geocoded FIR dataset was found.",
}

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
app.json.sort_keys = False
CORS(
    app,
    origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if o.strip()],
    methods=["GET", "POST"],
    allow_headers=["Content-Type"],
    max_age=600,
)


# ---------------- database ----------------
_db_lock = threading.Lock()


def ensure_database():
    """Create the incident table from the CSV when the database is missing or empty."""
    with _db_lock:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        try:
            has = conn.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='crime_data'").fetchone()[0]
            if has and conn.execute("SELECT count(*) FROM crime_data").fetchone()[0] > 0:
                return
            import pandas as pd

            pd.read_csv(CSV_PATH).to_sql("crime_data", conn, if_exists="replace", index=False)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_crime_area ON crime_data(Area)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_crime_severity ON crime_data(Severity)")
            conn.commit()
            logger.info("Loaded %s into %s", CSV_PATH, DB_PATH)
        finally:
            conn.close()


def db():
    if "db" not in g:
        ensure_database()
        g.db = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)  # the API only ever reads
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def _close_db(_exc):
    conn = g.pop("db", None)
    if conn is not None:
        conn.close()


# ---------------- errors, headers, rate limiting ----------------
class ApiError(Exception):
    def __init__(self, status, message, field=None):
        super().__init__(message)
        self.status, self.message, self.field = status, message, field


@app.errorhandler(ApiError)
def _api_error(e):
    body = {"error": e.message}
    if e.field:
        body["field"] = e.field
    return jsonify(body), e.status


@app.errorhandler(HTTPException)
def _http_error(e):
    return jsonify({"error": e.description if e.code != 404 else "Not found"}), e.code


@app.errorhandler(Exception)
def _unexpected(e):
    logger.exception("Unhandled error")
    return jsonify({"error": "Internal server error"}), 500


@app.after_request
def _headers(resp):
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["Referrer-Policy"] = "no-referrer"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    # Only the dataset endpoints are cacheable; health and area coverage change while the graph loads.
    cacheable = request.method == "GET" and resp.status_code == 200 and request.path.startswith(CACHEABLE)
    resp.headers["Cache-Control"] = "public, max-age=300" if cacheable else "no-store"
    if request.path.startswith("/api/v1/") and request.path not in ("/api/v1/health",):
        resp.headers["X-Data-Provenance"] = "synthetic"
    return resp


_hits: dict[str, deque] = defaultdict(deque)
_hits_lock = threading.Lock()


def rate_limit(limit_per_min):
    ip = request.remote_addr or "?"
    now = time.monotonic()
    with _hits_lock:
        q = _hits[ip]
        while q and now - q[0] > 60:
            q.popleft()
        if len(q) >= limit_per_min:
            raise ApiError(429, f"Too many route requests: the limit is {limit_per_min} per minute. Try again shortly.")
        q.append(now)


# ---------------- validation helpers ----------------
def number(body, name, lo, hi, default=None):
    v = body.get(name, default)
    if v is None:
        raise ApiError(400, f"{name} is required", name)
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        raise ApiError(400, f"{name} must be a number", name)
    if not lo <= v <= hi:
        raise ApiError(400, f"{name} must be between {lo} and {hi}", name)
    return float(v)


def point(body, name):
    p = body.get(name)
    if not isinstance(p, dict):
        raise ApiError(400, f"{name} must be an object with lat and lon", name)
    return number(p, "lat", -90, 90), number(p, "lon", -180, 180)


def int_arg(name, default, lo, hi):
    raw = request.args.get(name)
    if raw is None:
        return default
    try:
        v = int(raw)
    except ValueError:
        raise ApiError(400, f"{name} must be an integer", name) from None
    if not lo <= v <= hi:
        raise ApiError(400, f"{name} must be between {lo} and {hi}", name)
    return v


# ---------------- routes: meta ----------------
@app.get("/api/v1/health")
def health():
    from backend.route_engine import GRAPHML, router_ready

    return jsonify({"status": "ok", "road_graph": "loaded" if router_ready() else ("available" if GRAPHML.exists() else "missing")})


@app.get("/api/v1/meta")
def meta():
    conn = db()
    row = conn.execute("SELECT count(*) AS n, min(Date) AS first, max(Date) AS last, count(DISTINCT Area) AS areas FROM crime_data").fetchone()
    return jsonify({"dataset": {**DATASET, "records": row["n"], "date_range": [row["first"], row["last"]], "areas": row["areas"]}})


@app.get("/api/v1/areas")
def areas():
    """Named areas for the search form, with whether the road graph reaches them."""
    from backend.areas import AREA_COORDS
    from backend.route_engine import OutsideCoverage, get_router, router_ready

    out = []
    router = get_router() if router_ready() else None
    for name, (lat, lon) in sorted(AREA_COORDS.items()):
        covered = None
        if router is not None:
            try:
                router.nearest_node(lat, lon)
                covered = True
            except OutsideCoverage:
                covered = False
        out.append({"name": name, "lat": lat, "lon": lon, "covered": covered})
    return jsonify({"road_graph": "loaded" if router else "loading", "areas": out})


def _warm_up():
    """Load the road graph in the background so the first route request does not wait ~30 s."""
    from backend.route_engine import get_router

    try:
        get_router()
        logger.info("Road graph ready")
    except Exception as e:  # graph missing: /route answers 503 with instructions
        logger.warning("Road graph not loaded: %s", e)


if os.getenv("SAFEROUTE_WARMUP", "1") == "1" and not os.getenv("PYTEST_CURRENT_TEST"):
    threading.Thread(target=_warm_up, daemon=True).start()


# ---------------- routes: incidents and statistics ----------------
@app.get("/api/v1/incidents")
def incidents():
    """Paginated incidents without victim attributes. Filters: area, severity, type, bbox=minLat,minLon,maxLat,maxLon."""
    limit = int_arg("limit", 500, 1, 10000)
    offset = int_arg("offset", 0, 0, 10_000_000)
    where, params = [], []
    if area := request.args.get("area"):
        where.append("Area = ?")
        params.append(area)
    if sev := request.args.get("severity"):
        if sev not in SEVERITIES:
            raise ApiError(400, "severity must be High, Medium or Low", "severity")
        where.append("Severity = ?")
        params.append(sev)
    if typ := request.args.get("type"):
        where.append("Crime_Type = ?")
        params.append(typ)
    if bbox := request.args.get("bbox"):
        try:
            a, b, c, d = (float(x) for x in bbox.split(","))
        except ValueError:
            raise ApiError(400, "bbox must be minLat,minLon,maxLat,maxLon", "bbox") from None
        where.append("Latitude BETWEEN ? AND ? AND Longitude BETWEEN ? AND ?")
        params += [a, c, b, d]
    clause = f"WHERE {' AND '.join(where)}" if where else ""
    conn = db()
    total = conn.execute(f"SELECT count(*) FROM crime_data {clause}", params).fetchone()[0]
    rows = conn.execute(f"SELECT {', '.join(PUBLIC_FIELDS)} FROM crime_data {clause} ORDER BY FIR_ID LIMIT ? OFFSET ?", [*params, limit, offset]).fetchall()
    return jsonify({"total": total, "limit": limit, "offset": offset, "items": [dict(r) for r in rows], "dataset": DATASET["kind"]})


def _group(column, alias):
    rows = db().execute(f"SELECT {column}, count(*) AS {alias} FROM crime_data GROUP BY {column} ORDER BY {alias} DESC").fetchall()
    return [dict(r) for r in rows]


@app.get("/api/v1/stats/area")
def stats_area():
    return jsonify(_group("Area", "total_crimes"))


@app.get("/api/v1/stats/type")
def stats_type():
    return jsonify(_group("Crime_Type", "total"))


@app.get("/api/v1/stats/severity")
def stats_severity():
    return jsonify(_group("Severity", "total"))


@app.get("/api/v1/hotspots")
def hotspots():
    import pandas as pd

    if not HOTSPOTS_PATH.exists():
        return jsonify([])
    return jsonify(pd.read_csv(HOTSPOTS_PATH).to_dict(orient="records"))


# ---------------- routes: safety-aware routing ----------------
def _route_view(router, m, name, rid, bucket):
    mins = max(1, round(m.duration_s / 60))
    relative_safety, level = router.relative(m.exposure, bucket)
    coords = router.coords(m.nodes)
    return {
        "id": rid,
        "name": name,
        "distance_km": round(m.distance_m / 1000, 2),
        "duration_mins": mins,
        "duration": f"{mins} min",
        "average_risk": round(m.exposure, 3),
        "safety_score": relative_safety,
        "safety_basis": "Relative to the city's areas at this time of day (100 = lower risk than all of them)",
        "risk_level": level,
        "hotspot_count": m.hotspots_near,
        "route_points": len(coords),
        "coordinates": coords,
        "route": [{"lat": a, "lon": b} for a, b in coords],
        "steps": router.steps(m.nodes),
    }


@app.post("/api/v1/route")
def route():
    from backend.route_engine import OutsideCoverage, get_router

    if not request.is_json:
        raise ApiError(415, "Send JSON (Content-Type: application/json)")
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        raise ApiError(400, "Request body must be a JSON object")
    source, destination = point(body, "source"), point(body, "destination")
    hour = number(body, "hour", 0, 23, default=21)
    if not hour.is_integer():
        raise ApiError(400, "hour must be a whole number from 0 to 23", "hour")
    hour = int(hour)
    weight = number(body, "safety_weight", 0, 10, default=3)
    rate_limit(ROUTE_LIMIT_PER_MIN)
    try:
        router = get_router()
    except FileNotFoundError as e:
        raise ApiError(503, str(e)) from None
    started = time.perf_counter()
    try:
        fast, safe, bucket = router.route(source, destination, hour, weight)
    except OutsideCoverage as e:
        raise ApiError(422, f"Outside the area this service covers (Bengaluru): {e}") from None
    except ValueError as e:
        raise ApiError(422, str(e)) from None
    same = fast.nodes == safe.nodes
    safest = _route_view(router, safe, "Lower-risk route" if not same else "Recommended route", "route_safest", bucket)
    fastest = _route_view(router, fast, "Fastest route", "route_fastest", bucket)
    reduction = 0.0 if fast.exposure == 0 else (fast.exposure - safe.exposure) / fast.exposure * 100
    logger.info("route bucket=%s weight=%s same=%s in %.0f ms", bucket, weight, same, (time.perf_counter() - started) * 1000)
    return jsonify({
        **safest,
        "alternative_route": None if same else fastest,
        "fastest_route": fastest,
        "comparison": {
            "same_route": same,
            "extra_distance_km": round((safe.distance_m - fast.distance_m) / 1000, 2),
            "extra_minutes": round((safe.duration_s - fast.duration_s) / 60, 1),
            "exposure_reduction_pct": round(reduction, 1),
        },
        "source_coords": list(source),
        "dest_coords": list(destination),
        "time_bucket": bucket,
        "hour": hour,
        "safety_weight": weight,
        "engine": "OpenStreetMap road graph (OSMnx) + area risk model",
        "duration_basis": "Estimated free-flow driving time from OSM speed limits; real traffic is slower.",
        "dataset": DATASET,
    })


if __name__ == "__main__":
    # Never enable the Werkzeug debugger here: it allows arbitrary code execution if reachable.
    app.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", "5000")), debug=False)
