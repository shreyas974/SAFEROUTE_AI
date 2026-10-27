import { useState } from "react";
import { MapPin, Navigation, ShieldCheck, Zap, Clock, Bookmark } from "lucide-react";
import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";
import { useRoute } from "../../context/RouteContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { getCurrentLocation } from "../../services/locationService";
import areaCoords from "../../data/areaCoords";

const areaNames = Object.keys(areaCoords).sort();

const PRESET_ROUTES = [
  { label: "Koramangala ➔ Indiranagar", src: "Koramangala", dst: "Indiranagar" },
  { label: "Electronic City ➔ Bellandur", src: "Electronic City", dst: "Bellandur" },
  { label: "Hebbal ➔ MG Road", src: "Hebbal", dst: "MG Road" },
  { label: "HSR Layout ➔ Whitefield", src: "HSR Layout", dst: "Whitefield" },
];

function SearchPanel() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelHour, setTravelHour] = useState("21");
  const { user, saveRoute } = useAuth();
  const {
    fetchRoute,
    clearRoute,
    routeData,
    rawRouteData,
    activeRouteType,
    setActiveRouteType,
    loading,
    error,
    setCurrentLocation,
  } = useRoute();

  const handlePresetClick = (preset) => {
    setSource(preset.src);
    setDestination(preset.dst);
    fetchRoute(
      areaCoords[preset.src],
      areaCoords[preset.dst],
      parseInt(travelHour, 10),
      preset.src,
      preset.dst
    );
  };

  const handleSearch = () => {
    if (!source || !destination) {
      toast.error("Please select both source and destination areas.");
      return;
    }
    if (source === destination) {
      toast.error("Source and destination cannot be the same area.");
      return;
    }
    fetchRoute(
      areaCoords[source],
      areaCoords[destination],
      parseInt(travelHour, 10),
      source,
      destination
    );
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      toast.success("GPS Location pinned on map!");
    } catch (err) {
      toast.error("Unable to access GPS location in browser.");
    }
  };

  const hasAlt = Boolean(rawRouteData?.alternative_route);

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Find Safe Route</h2>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          OSRM + AI
        </span>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Origin Area
          </label>
          <select
            className="w-full rounded-xl border border-white/15 bg-slate-900/90 text-white text-xs p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">Choose origin (e.g. Koramangala)</option>
            {areaNames.map((name) => (
              <option key={name} value={name} className="bg-slate-900 text-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Destination Area
          </label>
          <select
            className="w-full rounded-xl border border-white/15 bg-slate-900/90 text-white text-xs p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Choose destination (e.g. Indiranagar)</option>
            {areaNames.map((name) => (
              <option key={name} value={name} className="bg-slate-900 text-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Travel Time
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {travelHour}:00 hrs ({parseInt(travelHour, 10) >= 20 || parseInt(travelHour, 10) < 5 ? "Night Risk Mode" : "Day Mode"})
            </span>
          </div>
          <select
            className="w-full rounded-xl border border-white/15 bg-slate-900/90 text-white text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={travelHour}
            onChange={(e) => setTravelHour(e.target.value)}
          >
            <option value="10">10:00 AM (Daytime Peak)</option>
            <option value="15">03:00 PM (Afternoon Transit)</option>
            <option value="19">07:00 PM (Evening Commute)</option>
            <option value="21">09:00 PM (Late Night Commute)</option>
            <option value="23">11:00 PM (High Night Vigilance)</option>
            <option value="2">02:00 AM (Critical Late Night)</option>
          </select>
        </div>

        {/* 1-Click Commute Corridor Presets */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Popular Commute Corridors</span>
            <span className="text-[10px] text-cyan-400 font-mono">1-Click Test</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESET_ROUTES.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePresetClick(p)}
                className="text-left text-[11px] p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition truncate shadow-sm active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <Navigation size={15} />
          <span>{loading ? "Calculating road network..." : "Calculate Safest Route"}</span>
        </button>

        <button
          onClick={handleCurrentLocation}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold py-2.5 transition active:scale-98"
        >
          <MapPin size={14} className="text-cyan-400" />
          <span>Use My GPS Location</span>
        </button>

        {error && <p className="text-xs text-rose-400 p-2 bg-rose-500/10 rounded-lg">Error: {error}</p>}

        {/* Route Engineering Multi-Path Switcher */}
        {rawRouteData && (
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Route Options Available
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveRouteType("safest")}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                  activeRouteType === "safest"
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-md shadow-emerald-500/20"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Safest AI</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {rawRouteData.distance_km} km • {rawRouteData.duration}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {rawRouteData.safety_score}% Safe
                </span>
              </button>

              {hasAlt && (
                <button
                  onClick={() => setActiveRouteType("fastest")}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    activeRouteType === "fastest"
                      ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Zap size={14} className="text-amber-400" />
                    <span>Fastest Path</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {rawRouteData.alternative_route.distance_km} km • {rawRouteData.alternative_route.duration}
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">
                    {rawRouteData.alternative_route.safety_score}% Safe
                  </span>
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              {user && (
                <button
                  onClick={async () => {
                    try {
                      await saveRoute({
                        source: source || "Selected Origin",
                        destination: destination || "Selected Destination",
                        distance_km: routeData.distance_km,
                        average_risk: routeData.average_risk,
                        duration: routeData.duration || "15 mins",
                      });
                      toast.success("Route saved to Firebase Profile!");
                    } catch (e) {
                      toast.error("Failed to save route");
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-400/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Bookmark size={13} />
                  <span>Save Route</span>
                </button>
              )}

              <button
                onClick={clearRoute}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default SearchPanel;
