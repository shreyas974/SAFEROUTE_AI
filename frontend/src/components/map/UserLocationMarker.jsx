import { Marker, Popup } from "react-leaflet";
import { useRoute } from "../../context/RouteContext";

function UserLocationMarker() {
  const { currentLocation } = useRoute();

  if (!currentLocation) return null;

  return (
    <Marker
      position={[
        currentLocation.latitude,
        currentLocation.longitude,
      ]}
    >
      <Popup>
        You are here 📍
      </Popup>
    </Marker>
  );
}

export default UserLocationMarker;