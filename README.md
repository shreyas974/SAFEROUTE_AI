# SafeRoute AI

Compare the **fastest** route with a **lower-risk** route across Bengaluru, and see exactly what the difference costs.

For each trip, the server searches the real OpenStreetMap road network twice:
- **fastest:** minimum free-flow drive time;
- **lower risk:** minimum drive time × (1 + *preference* × risk), where risk is a per-area, per-time-of-day model score.

Both routes are measured the same way, and the app tells you the trade-off in plain words. For example: "the lower-risk route is 3 min longer (+1.1 km) and cuts exposure to higher-risk areas by 18%". When no detour is worth it, the app says that too.

> **Demo data.** The incident records in `data/raw/crime_data.csv` are synthetic (generated with Faker by
> `backend/generate_synthetic_data.py`). They are not police records, and the risk scores derived from them say
> nothing about real safety in any neighbourhood. The UI says so on every page that shows them. Bengaluru City
> Police publish only aggregate counts (OpenCity data portal); no public street-level dataset was found.

## Quick start

Requirements: Python 3.10+ and Node.js 20+.

```bash
pip install -r requirements.txt
python backend/generate_graph.py        # once: downloads the Bengaluru road graph from OpenStreetMap (~150 MB)
python models/train_risk_model.py       # once: trains the area/time risk model
flask --app backend.api run --port 5000 # API on http://127.0.0.1:5000
```

In a second terminal:

```bash
cd frontend
npm ci
npm run dev                             # UI on http://localhost:5173 (proxies /api to :5000)
```

The first API start converts the graph and caches it in `data/cache/`, which takes about 30 s. Later starts load it in a few seconds, and it loads in the background, so the UI is usable at once.

## How it works

| Part | What it does |
|---|---|
| `backend/route_engine.py` | Loads the OSM graph once, adds speed-based travel times, assigns every node its nearest named area, and precomputes risk for 4 time periods. Each request runs two bidirectional Dijkstra searches with pure weight functions; the graph is never modified, so concurrent requests are safe. Points more than 1.5 km from the network are refused instead of silently snapped. |
| `backend/api.py` | Flask API `/api/v1`, with validation, rate limiting, restricted CORS, security headers and JSON errors. Victim attributes are never served. |
| `models/` | The risk model (scikit-learn) and DBSCAN hotspot clustering. |
| `frontend/` | React 19 + Vite + Tailwind + Leaflet. Every number on screen comes from the API; nothing falls back to bundled or invented data. |

**Relative safety (0–100)** compares a route's exposure with the city's areas at that time of day. 100 means lower risk than every area. "Lower / Moderate / Higher risk" are city tertiles.

### API

| Method and path | Purpose |
|---|---|
| `GET /api/v1/health` | Status and road-graph state (`missing` / `available` / `loaded`) |
| `GET /api/v1/meta` | Dataset provenance (`kind: synthetic`), record count, date range |
| `GET /api/v1/areas` | Named areas, and whether the road graph covers each one |
| `POST /api/v1/route` | `{source:{lat,lon}, destination:{lat,lon}, hour 0–23, safety_weight 0–10}` returns both routes plus the comparison |
| `GET /api/v1/incidents` | Paginated (`limit` ≤ 10000, `offset`), filters `area`, `severity`, `type`, `bbox`. No victim fields. |
| `GET /api/v1/stats/{area,type,severity}` | Aggregates |
| `GET /api/v1/hotspots` | DBSCAN clusters |

Errors look like `{"error": "...", "field": "hour"}`. Statuses: 400 invalid input, 415 non-JSON, 413 too large, 422 outside coverage or no path, 429 rate limited, 503 graph missing.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Origins allowed to call the API from a browser |
| `SAFEROUTE_ROUTE_LIMIT` | `30` | Route requests per minute per IP |
| `SAFEROUTE_DB` | `data/saferoute.db` | SQLite file, built from the CSV on first use |
| `HOST`, `PORT` | `127.0.0.1`, `5000` | Listen address for `python backend/api.py` |
| `VITE_API_URL` | (same origin) | API origin if the UI is hosted elsewhere |
| `VITE_TILE_URL`, `VITE_TILE_ATTRIBUTION` | OpenStreetMap | Map tiles. OSM's tile servers are for light use only, so set a commercial provider for production. |
| `VITE_FIREBASE_*` | unset | Optional accounts (saved routes across devices). Unset means no accounts: routes are saved in the browser. |

## Deploying

The Vercel configuration (`vercel.json`) builds and hosts the frontend only. Run the API on a server that
keeps the road graph in memory (it needs about 1 GB RAM), for example `gunicorn -w 1 -b 0.0.0.0:5000 backend.api:app`
behind HTTPS. Then build the UI with `VITE_API_URL=https://your-api.example` and set
`CORS_ORIGINS=https://your-ui.example` on the API. Without a reachable API the UI shows an error. It never
invents data.

## Testing

```bash
pip install -r requirements-dev.txt
pytest -q tests                         # 30 tests: routing, validation, data, hardening
cd frontend && npm run lint && npm run build
```

The routing tests use a synthetic 5×5 road grid with a known high-risk centre. They check exactly that:
- the fastest route goes through the centre and the lower-risk one avoids it;
- reported distances match the coordinates;
- the time of day changes the risk;
- concurrent requests for different hours don't interfere;
- the graph is never modified.

## Limitations

- Synthetic incident data (see above). Replace `data/raw/crime_data.csv` with real data (same columns) and retrain to use real figures.
- Risk is per named area (nearest of about 20), not per street, so it changes in steps. With the demo data, areas differ little, so detours are often small.
- Drive times are free-flow estimates; traffic isn't modelled.
- Recorded crime reflects reporting, not only occurrence. Routing around whole areas can stigmatise neighbourhoods, so treat this as a decision aid.
- Coverage is the city boundary used by `generate_graph.py`; Electronic City, for example, is outside it.

See [SECURITY.md](SECURITY.md) for the security and privacy model.
