import { Polyline, Popup } from "react-leaflet";
import { getSafestRoute } from "../../services/routeService";

function RoutePolyline() {
  const route = getSafestRoute();

  return (
    <Polyline
      positions={route.coordinates}
      pathOptions={{
        color: "#22c55e",
        weight: 6,
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{route.name}</h3>
          <p>Distance: {route.distance}</p>
          <p>Duration: {route.duration}</p>
          <p>Risk Score: {route.risk}</p>
        </div>
      </Popup>
    </Polyline>
  );
}

export default RoutePolyline;
