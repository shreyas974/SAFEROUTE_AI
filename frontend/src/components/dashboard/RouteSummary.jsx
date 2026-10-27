import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { Navigation, Clock, ShieldCheck, MapPin } from "lucide-react";

function riskBadge(risk) {
  if (risk >= 0.4) return { text: "High Risk", color: "text-rose-400 bg-rose-500/15 border-rose-500/25" };
  if (risk >= 0.25) return { text: "Moderate Risk", color: "text-amber-400 bg-amber-500/15 border-amber-500/25" };
  return { text: "Safe Corridor", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25" };
}

function RouteSummary() {
  const { routeData } = useRoute();

  if (!routeData || routeData.error) {
    return (
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Recommended Route</h2>
        <p className="text-sm text-slate-400">
          Select source and destination areas above to generate route analytics.
        </p>
      </GlassCard>
    );
  }

  const risk = riskBadge(routeData.average_risk);

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Recommended Route</h2>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${risk.color}`}>
          {risk.text}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center text-cyan-400 mb-1">
            <Navigation size={18} />
          </div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Distance</p>
          <h3 className="text-lg font-extrabold text-white mt-0.5">
            {routeData.distance_km} <span className="text-xs font-normal text-slate-400">km</span>
          </h3>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center text-blue-400 mb-1">
            <Clock size={18} />
          </div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Duration</p>
          <h3 className="text-lg font-extrabold text-white mt-0.5">
            {routeData.duration || "16 mins"}
          </h3>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Safety Score</p>
          <h3 className="text-lg font-extrabold text-emerald-400 mt-0.5">
            {routeData.safety_score || Math.max(0, Math.round((1 - routeData.average_risk) * 100))}%
          </h3>
        </div>
      </div>
    </GlassCard>
  );
}

export default RouteSummary;
