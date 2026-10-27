import { ShieldCheck, TriangleAlert, Ruler, Sparkles } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";

function riskLabel(risk) {
  if (risk >= 0.4) return { text: "High Risk", color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/25" };
  if (risk >= 0.25) return { text: "Moderate Risk", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/25" };
  return { text: "Safe Corridor", color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25" };
}

function AIRecommendation() {
  const { routeData } = useRoute();

  if (!routeData || routeData.error) {
    return (
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <div className="flex items-center gap-2.5 mb-3">
          <ShieldCheck className="text-emerald-400" size={22} />
          <h2 className="text-xl font-bold text-white">AI Recommendation</h2>
        </div>
        <p className="text-sm text-slate-400">
          Select source and destination areas to view AI safety insights and risk avoidance analysis.
        </p>
      </GlassCard>
    );
  }

  const safetyScore = routeData.safety_score || Math.max(0, Math.round((1 - routeData.average_risk) * 100));
  const risk = riskLabel(routeData.average_risk);

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="text-emerald-400" size={22} />
          <h2 className="text-xl font-bold text-white">AI Recommendation</h2>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-500/15 border border-cyan-500/25 px-2.5 py-1 rounded-full font-mono">
          <Sparkles size={12} />
          <span>DBSCAN Model</span>
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
        This path covers <strong className="text-white">{routeData.distance_km} km</strong> across{" "}
        <strong className="text-white">{routeData.route_points}</strong> road waypoints. Based on
        historical Bengaluru FIR density, it is rated{" "}
        <strong className={risk.color}>{risk.text}</strong> with an estimated
        safety rating of <strong className="text-emerald-400">{safetyScore}%</strong>.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
          <ShieldCheck className="mx-auto mb-1 text-emerald-400" size={18} />
          <h3 className="text-[10px] uppercase font-bold text-slate-400">Safety</h3>
          <p className="text-lg font-extrabold text-emerald-400">{safetyScore}%</p>
        </div>

        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-center">
          <TriangleAlert className="mx-auto mb-1 text-rose-400" size={18} />
          <h3 className="text-[10px] uppercase font-bold text-slate-400">Risk</h3>
          <p className={`text-sm font-extrabold ${risk.color} mt-0.5`}>{risk.text}</p>
        </div>

        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-center">
          <Ruler className="mx-auto mb-1 text-blue-400" size={18} />
          <h3 className="text-[10px] uppercase font-bold text-slate-400">Distance</h3>
          <p className="text-base font-extrabold text-white mt-0.5">{routeData.distance_km} km</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-white mb-1">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Real-Time Model Insight</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Calculated using police FIR clusters, time-of-day risk multipliers, and arterial lighting metrics. High-risk crime zones are dynamically avoided.
        </p>
      </div>
    </GlassCard>
  );
}

export default AIRecommendation;
