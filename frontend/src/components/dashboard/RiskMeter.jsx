import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { Shield } from "lucide-react";
import { LEVEL_STYLE } from "./riskLevels";

function RiskMeter() {
  const { routeData } = useRoute();

  if (!routeData) {
    return (
      <GlassCard className="p-5 border border-white/10 shadow-lg rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-cyan-300" aria-hidden="true" />
          <h2 className="text-base font-bold text-white">Relative safety</h2>
        </div>
        <p className="text-sm text-slate-300">Find a route to see how its risk compares with the rest of the city at that time.</p>
      </GlassCard>
    );
  }

  const score = routeData.safety_score;
  const bar = score >= 67 ? "bg-emerald-400" : score >= 34 ? "bg-amber-400" : "bg-rose-400";

  return (
    <GlassCard className="p-5 border border-white/10 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-cyan-300" aria-hidden="true" />
          <h2 className="text-base font-bold text-white">Relative safety</h2>
        </div>
        <span className="text-sm font-bold text-white">{score} / 100</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-white/10" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label="Relative safety score">
        <div className={`${bar} h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none`} style={{ width: `${Math.max(4, score)}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className={`px-2 py-0.5 rounded-full border font-semibold ${LEVEL_STYLE[routeData.risk_level] ?? ""}`}>{routeData.risk_level}</span>
        <span className="text-slate-300 text-right">{routeData.safety_basis}</span>
      </div>
    </GlassCard>
  );
}

export default RiskMeter;
