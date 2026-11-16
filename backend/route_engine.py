"""Safety-aware routing on the real OpenStreetMap road graph.

For every request the engine computes two routes on the same graph:
  * fastest: minimum estimated free-flow drive time;
  * safest:  minimum drive time x (1 + safety_weight x risk), where risk is the model's
             0-1 score for the road segment's nearest area at that time of day.
Both are measured with the same metrics, so the comparison the UI shows is never invented.

Performance and correctness notes:
  * Each road segment's nearest area and the per-area, per-time-bucket risk are computed
    once when the graph loads (the old engine redid this for every edge on every request,
    ~8 s per route, and mutated the shared graph, which raced between concurrent requests).
  * Requests never modify the graph; weights are computed by pure functions.
"""

from __future__ import annotations

import math
import os
import pickle
import threading
from dataclasses import dataclass
from pathlib import Path

import networkx as nx
import numpy as np

from backend.areas import AREA_COORDS

GRAPHML = Path("data/raw/bangalore_graph.graphml")
CACHE_DIR = Path("data/cache")
TIME_BUCKETS = ("Night", "Morning", "Afternoon", "Evening")
MAX_SNAP_METERS = 1500  # farther than this from any road in the graph = outside coverage
DEFAULT_SAFETY_WEIGHT = 3.0
MAX_SAFETY_WEIGHT = 10.0
HOTSPOT_RADIUS_M = 500


class OutsideCoverage(ValueError):
    """A point is too far from the road network the engine covers."""


def time_bucket(hour: int) -> str:
    if not 0 <= hour <= 23:
        raise ValueError("hour must be between 0 and 23")
    if hour < 6:
        return "Night"
    if hour < 12:
        return "Morning"
    if hour < 18:
        return "Afternoon"
    return "Evening"


def haversine_m(lat1, lon1, lat2, lon2):
    r = 6_371_000.0
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dp, dl = p2 - p1, np.radians(lon2) - np.radians(lon1)
    a = np.sin(dp / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(dl / 2) ** 2
    return 2 * r * np.arcsin(np.sqrt(a))


def bearing(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    d_lon = lon2 - lon1
    x = math.sin(d_lon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(d_lon)
    return (math.degrees(math.atan2(x, y)) + 360) % 360


def turn_direction(before, after):
    diff = (after - before + 360) % 360
    if diff > 180:
        diff -= 360
    if diff > 30:
        return "Turn right"
    if diff < -30:
        return "Turn left"
    if diff > 10:
        return "Slight right"
    if diff < -10:
        return "Slight left"
    return "Continue straight"


@dataclass(frozen=True)
class RouteMetrics:
    nodes: list
    distance_m: float
    duration_s: float
    exposure: float  # length-weighted mean risk along the route, 0-1
    hotspots_near: int


class SafeRouter:
    """Routing over a road graph whose edges have 'length' (m) and 'travel_time' (s)."""

    def __init__(self, graph, area_coords: dict, risk_fn, hotspots=()):
        self.G = graph
        self.areas = list(area_coords)
        self.risk = {(a, b): float(risk_fn(a, b)) for a in self.areas for b in TIME_BUCKETS}
        self.hotspots = [(float(h[0]), float(h[1])) for h in hotspots]
        nodes = list(graph.nodes)
        self._node_ids = np.array(nodes, dtype=object)
        self._node_lat = np.array([graph.nodes[n]["y"] for n in nodes], dtype=float)
        self._node_lon = np.array([graph.nodes[n]["x"] for n in nodes], dtype=float)
        # Nearest area for every node (each edge takes its start node's area).
        alat = np.array([area_coords[a][0] for a in self.areas])
        alon = np.array([area_coords[a][1] for a in self.areas])
        idx = np.empty(len(nodes), dtype=np.int32)
        for start in range(0, len(nodes), 50_000):
            sl = slice(start, start + 50_000)
            d = haversine_m(self._node_lat[sl, None], self._node_lon[sl, None], alat[None, :], alon[None, :])
            idx[sl] = d.argmin(axis=1)
        self.node_area = {n: self.areas[i] for n, i in zip(nodes, idx)}

    # ---------- weights (pure functions; the graph is never modified) ----------
    def _edge_risk(self, u, bucket):
        return self.risk[(self.node_area[u], bucket)]

    def _weight(self, bucket, safety_weight):
        def w(u, v, data):
            # MultiDiGraph: data maps key -> attributes of each parallel edge; use the best one.
            best = math.inf
            r = 1 + safety_weight * self._edge_risk(u, bucket)
            for attrs in data.values() if self.G.is_multigraph() else (data,):
                best = min(best, attrs.get("travel_time", attrs.get("length", 1.0)) * r)
            return best
        return w

    def _best_edge(self, u, v):
        data = self.G.get_edge_data(u, v)
        if self.G.is_multigraph():
            return min(data.values(), key=lambda a: a.get("travel_time", a.get("length", 1.0)))
        return data

    # ---------- snapping ----------
    def nearest_node(self, lat, lon):
        d = haversine_m(lat, lon, self._node_lat, self._node_lon)
        i = int(d.argmin())
        if d[i] > MAX_SNAP_METERS:
            raise OutsideCoverage(f"({lat:.4f}, {lon:.4f}) is {d[i] / 1000:.1f} km from the nearest road this service covers")
        return self._node_ids[i]

    # ---------- metrics ----------
    def measure(self, nodes, bucket) -> RouteMetrics:
        dist = dur = weighted = 0.0
        for u, v in zip(nodes[:-1], nodes[1:]):
            e = self._best_edge(u, v)
            length = float(e.get("length", 0.0))
            dist += length
            dur += float(e.get("travel_time", length / (30 / 3.6)))
            weighted += length * self._edge_risk(u, bucket)
        exposure = weighted / dist if dist else self._edge_risk(nodes[0], bucket)
        return RouteMetrics(list(nodes), dist, dur, exposure, self._hotspots_near(nodes))

    def _hotspots_near(self, nodes):
        if not self.hotspots or not nodes:
            return 0
        lat = np.array([self.G.nodes[n]["y"] for n in nodes])
        lon = np.array([self.G.nodes[n]["x"] for n in nodes])
        return sum(1 for hlat, hlon in self.hotspots if haversine_m(hlat, hlon, lat, lon).min() <= HOTSPOT_RADIUS_M)

    def steps(self, nodes):
        names, bearings, lengths = [], [], []
        for u, v in zip(nodes[:-1], nodes[1:]):
            e = self._best_edge(u, v)
            name = e.get("name") or "Unnamed road"
            if isinstance(name, list):
                name = name[0]
            names.append(name)
            bearings.append(bearing(self.G.nodes[u]["y"], self.G.nodes[u]["x"], self.G.nodes[v]["y"], self.G.nodes[v]["x"]))
            lengths.append(float(e.get("length", 0.0)))
        if not names:
            return []
        out, name, length, direction = [], names[0], lengths[0], "Start"
        for i in range(1, len(names)):
            if names[i] == name:
                length += lengths[i]
                continue
            out.append({"instruction": direction, "street": name, "distance_m": round(length)})
            direction, name, length = turn_direction(bearings[i - 1], bearings[i]), names[i], lengths[i]
        out.append({"instruction": direction, "street": name, "distance_m": round(length)})
        out.append({"instruction": "Arrive at destination", "street": name, "distance_m": 0})
        return out

    # ---------- public ----------
    def route(self, source, destination, hour=21, safety_weight=DEFAULT_SAFETY_WEIGHT):
        bucket = time_bucket(int(hour))
        if not 0 <= safety_weight <= MAX_SAFETY_WEIGHT:
            raise ValueError(f"safety_weight must be between 0 and {MAX_SAFETY_WEIGHT:g}")
        s = self.nearest_node(*source)
        t = self.nearest_node(*destination)
        if s == t:
            raise ValueError("Source and destination are the same place")
        try:
            _, fast_nodes = nx.bidirectional_dijkstra(self.G, s, t, weight=self._weight(bucket, 0.0))
            _, safe_nodes = nx.bidirectional_dijkstra(self.G, s, t, weight=self._weight(bucket, safety_weight))
        except nx.NetworkXNoPath:
            raise ValueError("No drivable route connects these points") from None
        return self.measure(fast_nodes, bucket), self.measure(safe_nodes, bucket), bucket

    def relative(self, exposure, bucket):
        """Where a route's exposure sits among the city's areas at this time of day.

        Returns (relative_safety 0-100, level): 100 = lower risk than every area at that hour.
        Levels are city tertiles, so "Higher risk" means "among the riskier third of the city now".
        """
        vals = sorted(self.risk[(a, bucket)] for a in self.areas)
        eps = 1e-6  # exposure is a length-weighted mean: treat float noise around an area's value as a tie
        below = sum(v < exposure - eps for v in vals) + 0.5 * sum(abs(v - exposure) <= eps for v in vals)
        frac = below / len(vals)
        level = "Lower risk" if frac < 1 / 3 else "Higher risk" if frac >= 2 / 3 else "Moderate risk"
        return round(100 * (1 - frac)), level

    def coords(self, nodes):
        return [[self.G.nodes[n]["y"], self.G.nodes[n]["x"]] for n in nodes]


# ---------- the real Bengaluru graph, loaded once ----------
_router = None
_lock = threading.Lock()


def _load_graph():
    import osmnx as ox

    if not GRAPHML.exists():
        raise FileNotFoundError(f"{GRAPHML} is missing. Build it once with: python backend/generate_graph.py")
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache = CACHE_DIR / f"graph-{int(GRAPHML.stat().st_mtime)}.pkl"
    if cache.exists():
        with cache.open("rb") as f:  # our own file, generated below from the graphml
            return pickle.load(f)
    G = ox.load_graphml(GRAPHML)
    G = ox.add_edge_speeds(G)  # fills missing maxspeed with per-road-type means
    G = ox.add_edge_travel_times(G)
    for old in CACHE_DIR.glob("graph-*.pkl"):
        old.unlink()
    with cache.open("wb") as f:
        pickle.dump(G, f, protocol=pickle.HIGHEST_PROTOCOL)
    return G


def _hotspots():
    import pandas as pd

    path = Path("data/raw/hotspots.csv")
    if not path.exists():
        return []
    df = pd.read_csv(path)
    return list(zip(df["Latitude"], df["Longitude"]))


def get_router() -> SafeRouter:
    global _router
    if _router is None:
        with _lock:
            if _router is None:
                from models.predict import predict_risk

                hour_for = {"Night": 2, "Morning": 9, "Afternoon": 15, "Evening": 21}
                _router = SafeRouter(_load_graph(), AREA_COORDS, lambda area, bucket: predict_risk(area, hour_for[bucket]), _hotspots())
    return _router


def router_ready() -> bool:
    return _router is not None


if __name__ == "__main__" and os.environ.get("SAFEROUTE_DEMO"):
    fast, safe, _ = get_router().route((12.9352, 77.6245), (12.9756, 77.6050), 21)
    print(f"fastest {fast.distance_m / 1000:.2f} km, exposure {fast.exposure:.3f}")
    print(f"safest  {safe.distance_m / 1000:.2f} km, exposure {safe.exposure:.3f}")
