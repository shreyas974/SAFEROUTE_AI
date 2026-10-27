import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useRoute } from "../../context/RouteContext";

const userGpsIcon = L.divIcon({
  className: "custom-user-gps-marker",
  html: `<div style="position: relative; width: 24px; height: 24px;">
    <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(56, 189, 248, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 0 10px #38bdf8;"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function UserLocationMarker() {
  const { currentLocation } = useRoute();

  if (!currentLocation) return null;

  return (
    <Marker
      position={[currentLocation.latitude, currentLocation.longitude]}
      icon={userGpsIcon}
    >
      <Popup>
        <div style={{ textAlign: "center", padding: "4px" }}>
          <strong style={{ color: "#0284c7", fontSize: "13px" }}>Your Live Location</strong>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#64748b" }}>
            GPS Coordinates Active
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

export default UserLocationMarker;