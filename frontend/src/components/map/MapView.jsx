import { MapContainer, TileLayer } from "react-leaflet";

import CrimeMarkers from "./CrimeMarkers";
import RoutePolyline from "./RoutePolyline";
import UserLocationMarker from "./UserLocationMarker";
import MapAutoCenter from "./MapAutoCenter";

function MapView() {
  return (
    <div className="glass rounded-2xl overflow-hidden h-[700px] shadow-lg">
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-center map */}
        <MapAutoCenter />

        {/* AI Suggested Route */}
        <RoutePolyline />

        {/* Crime Markers */}
        <CrimeMarkers />

        {/* User Location */}
        <UserLocationMarker />
      </MapContainer>
    </div>
  );
}

export default MapView;