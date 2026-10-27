import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { Shield, Sparkles } from "lucide-react";

function RiskMeter() {
  const { routeData } = useRoute();

  if (!routeData || routeData.error) {
    return (
      <GlassCard className="p-5 border border-white/10 shadow-lg rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-blue-400" />
          <h2 className="text-base font-bold text-white">Safety Index</h2>
        </div>
        <p className="text-xs text-slate-400">Select source and destination to view live safety index.</p>
      </GlassCard>
    );
  }

  const safetyScore = routeData.safety_score || Math.max(0, Math.round((1 - routeData.average_risk) * 100));
  const barGradient =
    safetyScore >= 70
      ? "from-emerald-500 to-cyan-400 shadow-emerald-500/30"
      : safetyScore >= 45
      ? "from-amber-500 to-yellow-400 shadow-amber-500/30"
      : "from-rose-600 to-red-400 shadow-rose-500/30";

  return (
    <GlassCard className="p-5 border border-white/10 shadow-lg rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-cyan-400" />
          <h2 className="text-base font-bold text-white">AI Safety Index</h2>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400">{safetyScore} / 100</span>
      </div>

      <div className="w-full bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden border border-white/10">
        <div
          className={`bg-gradient-to-r ${barGradient} h-full rounded-full transition-all duration-700 shadow-md`}
          style={{ width: `${Math.max(5, safetyScore)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Risk: <strong className="text-slate-200">{routeData.average_risk}</strong></span>
        <span className="text-emerald-400 font-semibold">{safetyScore >= 70 ? "Optimal Route" : "Caution Advised"}</span>
      </div>
    </GlassCard>
  );
}

export default RiskMeter;
