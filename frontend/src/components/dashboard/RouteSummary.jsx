import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { Navigation, Clock, ShieldCheck } from "lucide-react";
import { LEVEL_STYLE } from "./riskLevels";

function Stat({ icon: Icon, label, value, unit, hint }) {
  return (
    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
      <Icon size={18} className="mx-auto mb-1 text-cyan-300" aria-hidden="true" />
      <p className="text-xs text-slate-300 font-semibold">{label}</p>
      <p className="text-lg font-extrabold text-white mt-0.5">
        {value}
        {unit ? <span className="text-xs font-normal text-slate-300"> {unit}</span> : null}
      </p>
      {hint ? <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p> : null}
    </div>
  );
}

function RouteSummary() {
  const { routeData, activeRouteType } = useRoute();

  if (!routeData) {
    return (
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Route summary</h2>
        <p className="text-sm text-slate-300">Choose a start and a destination to compare the fastest and the lower-risk route.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-5 gap-2">
        <h2 className="text-xl font-bold text-white">{activeRouteType === "fastest" ? "Fastest route" : routeData.name}</h2>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${LEVEL_STYLE[routeData.risk_level] ?? ""}`}>{routeData.risk_level}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Navigation} label="Distance" value={routeData.distance_km} unit="km" />
        <Stat icon={Clock} label="Drive time" value={routeData.duration} hint="free-flow estimate" />
        <Stat icon={ShieldCheck} label="Relative safety" value={routeData.safety_score} unit="/ 100" hint="vs. the city now" />
      </div>
    </GlassCard>
  );
}

export default RouteSummary;
