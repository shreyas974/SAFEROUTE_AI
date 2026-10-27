import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import CrimeMarkers from "./CrimeMarkers";
import RoutePolyline from "./RoutePolyline";
import UserLocationMarker from "./UserLocationMarker";
import MapAutoCenter from "./MapAutoCenter";
import { Layers, Sun, Moon } from "lucide-react";

function MapView() {
  const [mapTheme, setMapTheme] = useState("dark"); // Default to sleek dark matter

  const tileUrl =
    mapTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="glass rounded-2xl overflow-hidden h-[620px] lg:h-[720px] shadow-2xl border border-white/10 relative">
      {/* Floating Map Telemetry & Theme Switcher */}
      <div className="absolute top-4 right-4 z-[1000] rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/15 p-3 text-[11px] text-white shadow-2xl space-y-2 select-none pointer-events-auto min-w-[170px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <span className="font-bold text-xs text-cyan-300 flex items-center gap-1">
            <Layers size={13} />
            Map Telemetry
          </span>
          <button
            onClick={() => setMapTheme((prev) => (prev === "dark" ? "voyager" : "dark"))}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-slate-200 border border-white/15 transition active:scale-95"
            title="Toggle Map Style"
          >
            {mapTheme === "dark" ? (
              <>
                <Sun size={11} className="text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={11} className="text-cyan-400" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="text-emerald-300 font-semibold">Safest AI Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-amber-300">Fastest Direct Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
            <span className="text-rose-300">High Risk Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <span className="text-blue-300">Moderate / Low Incident</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          key={mapTheme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
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