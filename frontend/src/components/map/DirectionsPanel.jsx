import {
  ArrowUp, ArrowUpRight, ArrowUpLeft,
  CornerUpRight, CornerUpLeft, Navigation, MapPin,
  Clock, ShieldCheck,
} from "lucide-react";
import { useRoute } from "../../context/RouteContext";
import GlassCard from "../common/GlassCard";

function stepIcon(instruction) {
  if (instruction.includes("right")) {
    return instruction.includes("Slight") ? <ArrowUpRight size={18} /> : <CornerUpRight size={18} />;
  }
  if (instruction.includes("left")) {
    return instruction.includes("Slight") ? <ArrowUpLeft size={18} /> : <CornerUpLeft size={18} />;
  }
  if (instruction.includes("roundabout")) {
    return <ArrowUpRight size={18} />;
  }
  return <ArrowUp size={18} />;
}

function formatDistance(meters) {
  if (!meters) return "100 m";
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

function DirectionsPanel() {
  const { routeData, loading, sourceName, destName } = useRoute();

  if (loading) {
    return (
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-300">Engineering safe road corridor with OSRM...</p>
        </div>
      </GlassCard>
    );
  }

  if (!routeData || !routeData.steps || routeData.steps.length === 0) {
    return (
      <GlassCard className="p-6 text-center border border-white/10 shadow-xl rounded-2xl">
        <Navigation className="mx-auto mb-2.5 text-cyan-400" size={26} />
        <h4 className="text-base font-bold text-white mb-1">Live Turn-by-Turn Telemetry</h4>
        <p className="text-xs text-slate-400">
          Choose an origin and destination in the search panel to generate real street navigation.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">{routeData.name || "Active Route"}</h3>
          </div>
          {(sourceName || destName) && (
            <p className="text-xs text-slate-400 mt-0.5">
              {sourceName || "Origin"} → {destName || "Destination"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
            📏 {routeData.distance_km} km
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-semibold">
            ⏱️ {routeData.duration || "15 mins"}
          </span>
        </div>
      </div>

      <ol className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
        {routeData.steps.map((step, index) => (
          <li
            key={index}
            className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-b-0"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-400/25 text-cyan-300 shadow-sm">
              {stepIcon(step.instruction)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">
                {step.instruction}{" "}
                {step.street && step.street !== "unnamed road" && (
                  <span className="text-cyan-300 font-medium">onto {step.street}</span>
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formatDistance(step.distance_m)}
              </p>
            </div>
          </li>
        ))}

        <li className="flex items-start gap-3 pt-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 shadow-sm">
            <MapPin size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-emerald-400">Arrive at Destination</p>
            <p className="text-[11px] text-slate-400">Safe arrival at {destName || "target sector"}</p>
          </div>
        </li>
      </ol>
    </GlassCard>
  );
}

export default DirectionsPanel;
