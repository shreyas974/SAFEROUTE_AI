import { Polyline, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import { useRoute } from "../../context/RouteContext";

const startIcon = L.divIcon({
  className: "custom-start-marker",
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #10b981;
    color: #ffffff;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.7);
    font-size: 13px;
    font-weight: bold;
  ">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: "custom-end-marker",
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #ef4444;
    color: #ffffff;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.7);
    font-size: 13px;
    font-weight: bold;
  ">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function RoutePolyline() {
  const { routeData, rawRouteData, activeRouteType, sourceName, destName } = useRoute();

  if (!routeData || !routeData.route || routeData.route.length === 0) {
    return null;
  }

  const positions = routeData.route.map((point) => {
    if (Array.isArray(point)) return point;
    return [point.lat ?? point.latitude, point.lon ?? point.longitude];
  });

  const startCoord = positions[0];
  const endCoord = positions[positions.length - 1];

  // Secondary alternative route positions if available
  const altRoute = rawRouteData?.alternative_route;
  const altPositions = altRoute?.route
    ? altRoute.route.map((p) => [p.lat ?? p[0], p.lon ?? p[1]])
    : null;

  const isSafest = activeRouteType === "safest";
  const mainColor = isSafest ? "#10b981" : "#f59e0b";

  return (
    <>
      {/* Background alternative route (subtle comparison path) */}
      {altPositions && (
        <Polyline
          positions={altPositions}
          pathOptions={{
            color: isSafest ? "#f59e0b" : "#10b981",
            weight: 4,
            opacity: 0.5,
            dashArray: "7, 10",
          }}
        >
          <Popup>
            <div style={{ padding: "4px" }}>
              <strong style={{ fontSize: "12px", color: "#0f172a" }}>
                {isSafest ? "Alternative Fast Route" : "Recommended Safe Route"}
              </strong>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>
                Click to switch route option in panel
              </p>
            </div>
          </Popup>
        </Polyline>
      )}

      {/* Active Selected Route */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: mainColor,
          weight: 6,
          opacity: 0.92,
        }}
      >
        <Popup>
          <div style={{ minWidth: "160px", padding: "4px" }}>
            <h4 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "bold", color: "#0f172a" }}>
              {routeData.name || "Active AI Route"}
            </h4>
            <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
              <div>📏 Distance: <strong>{routeData.distance_km} km</strong></div>
              <div>⏱️ Duration: <strong>{routeData.duration || "15 mins"}</strong></div>
              <div>🛡️ Safety: <strong style={{ color: isSafest ? "#10b981" : "#f59e0b" }}>{routeData.safety_score || 90}%</strong></div>
            </div>
          </div>
        </Popup>
      </Polyline>

      {/* Start Waypoint Marker */}
      {startCoord && (
        <Marker position={startCoord} icon={startIcon}>
          <Popup>
            <div style={{ padding: "4px" }}>
              <strong style={{ color: "#10b981", fontSize: "12px" }}>Origin (A)</strong>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#475569" }}>
                {sourceName || "Journey Start"}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* End Waypoint Marker */}
      {endCoord && (
        <Marker position={endCoord} icon={endIcon}>
          <Popup>
            <div style={{ padding: "4px" }}>
              <strong style={{ color: "#ef4444", fontSize: "12px" }}>Destination (B)</strong>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#475569" }}>
                {destName || "Journey End"}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

export default RoutePolyline;
