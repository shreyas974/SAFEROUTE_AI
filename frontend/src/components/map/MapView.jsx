import { MapContainer, TileLayer } from "react-leaflet";
import CrimeMarkers from "./CrimeMarkers";
import RoutePolyline from "./RoutePolyline";
import UserLocationMarker from "./UserLocationMarker";
import MapAutoCenter from "./MapAutoCenter";

function MapView() {
  return (
    <div className="glass rounded-2xl overflow-hidden h-[620px] lg:h-[700px] shadow-2xl border border-white/10 relative">
      {/* Floating Map Legend */}
      <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 px-3 py-2 text-[11px] text-white shadow-lg space-y-1 select-none pointer-events-auto">
        <div className="font-bold text-xs text-cyan-300 pb-1 border-b border-white/10">Map Telemetry</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span>Recommended Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#ef4444]" />
          <span>High Risk Incident</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          <span>Moderate Incident</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
          <span>Low Severity</span>
        </div>
      </div>

      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* CartoDB Voyager Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Auto-center map to searched route or user location */}
        <MapAutoCenter />

        {/* AI Suggested Route Polyline */}
        <RoutePolyline />

        {/* Clustered Crime Markers */}
        <CrimeMarkers />

        {/* User GPS Location */}
        <UserLocationMarker />
      </MapContainer>
    </div>
  );
}

export default MapView;