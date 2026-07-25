import { Polyline, Popup } from "react-leaflet";
import { useRoute } from "../../context/RouteContext";

function riskColor(risk) {
  if (risk >= 0.6) return "#dc2626";
  if (risk >= 0.3) return "#f97316";
  return "#22c55e";
}

function RoutePolyline() {
  const { routeData } = useRoute();

  if (!routeData || !routeData.route || routeData.route.length === 0) {
    return null;
  }

  const positions = routeData.route.map((point) => [point.lat, point.lon]);

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: riskColor(routeData.average_risk),
        weight: 6,
        opacity: 0.85,
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">Safe Route</h3>
          <p>Distance: {routeData.distance_km} km</p>
          <p>Average Risk: {routeData.average_risk}</p>
          <p>Route Points: {routeData.route_points}</p>
        </div>
      </Popup>
    </Polyline>
  );
}

export default RoutePolyline;
