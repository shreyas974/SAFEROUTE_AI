# Security and privacy

## Data handled

| Data | Where | Notes |
|---|---|---|
| Trip requests (two points, hour, preference) | API, in memory | Not stored or logged beyond an aggregate line (time bucket, preference, duration) |
| Browser location | Browser only | Drawn on the map; never sent to the server |
| Saved routes | Browser `localStorage` (no account) or the deployment's Firebase project (account) | |
| Account profile (name, email, optional emergency contact) | The deployment's Firebase project | Only when `VITE_FIREBASE_*` is configured |
| Incident dataset | `data/` | Synthetic; victim age and gender are never served by the API |

## Controls

- **No fake authentication.** Earlier builds accepted any password ("local" login) and shipped placeholder
  Firebase keys for a project the authors don't control. Accounts now exist only with a configured
  Firebase project; otherwise there is no sign-in at all.
- **Removed unused password endpoints.** The Flask `/auth/signup` and `/auth/login` endpoints had no client.
  They stored passwords, behind a hard-coded fallback JWT secret, so they were removed.
- **Debugger off.** `app.run(debug=True)` exposed the Werkzeug debugger, which allows remote code execution
  if it is reachable. The API never enables it, and binds to 127.0.0.1 by default.
- **Input validation.** Every field is type- and range-checked (400 with the field name). Bodies are limited
  to 16 KB. Points outside coverage return 422 instead of being snapped up to kilometres away.
- **Abuse:** route searches (CPU-heavy) are rate-limited per IP.
- **CORS** is restricted to configured origins (it used to allow any origin).
- **Headers:** `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, a restrictive API CSP,
  and `Cache-Control: no-store` on everything except dataset reads.
- **SQL:** parameterised queries only; the API opens the database read-only.
- **Errors:** unexpected exceptions return `Internal server error`; details go to the server log.
- **Dependencies:** `npm audit` reports 0 vulnerabilities (`@grpc/grpc-js` is pinned to a patched version
  through `overrides`). Unused packages (axios, framer-motion, Streamlit and its plotting stack, PyJWT,
  openpyxl) were removed. CI fails on high-severity advisories.

## Known limitations

- The rate limiter is per process and in memory. Behind several workers or a proxy, use the proxy's limiter and
  make sure `request.remote_addr` is the client (configure `ProxyFix`).
- No TLS termination: run behind an HTTPS reverse proxy in production.
- User-submitted incident reports (`submitIncidentReport`, Firebase mode) are stored as `Unverified` and are
  not shown anywhere yet. Moderation is required before they could be.

Report vulnerabilities through a private GitHub security advisory.
