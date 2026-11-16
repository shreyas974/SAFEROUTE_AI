import { Scale, Info } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";

/** Why this route: the trade-off between the two routes, and what the numbers are based on. */
function AIRecommendation() {
  const { rawRouteData: d } = useRoute();

  if (!d) {
    return (
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <div className="flex items-center gap-2.5 mb-3">
          <Scale className="text-cyan-300" size={22} aria-hidden="true" />
          <h2 className="text-xl font-bold text-white">Why this route</h2>
        </div>
        <p className="text-sm text-slate-300">After you search, this card explains the trade-off between speed and risk exposure.</p>
      </GlassCard>
    );
  }

  const c = d.comparison;
  const fast = d.fastest_route;
  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center gap-2.5 mb-4">
        <Scale className="text-cyan-300" size={22} aria-hidden="true" />
        <h2 className="text-xl font-bold text-white">Why this route</h2>
      </div>

      <table className="w-full text-sm mb-4">
        <caption className="sr-only">Fastest and lower-risk route compared</caption>
        <thead>
          <tr className="text-left text-slate-300">
            <td></td>
            <th scope="col" className="font-semibold pb-2">Fastest</th>
            <th scope="col" className="font-semibold pb-2">{c.same_route ? "(same route)" : "Lower risk"}</th>
          </tr>
        </thead>
        <tbody className="text-slate-100">
          {[
            ["Distance", `${fast.distance_km} km`, `${d.distance_km} km`],
            ["Drive time", fast.duration, d.duration],
            ["Risk exposure", fast.average_risk.toFixed(2), d.average_risk.toFixed(2)],
            ["Relative safety", `${fast.safety_score}/100`, `${d.safety_score}/100`],
            ["Hotspot clusters ≤500 m", fast.hotspot_count, d.hotspot_count],
          ].map(([k, a, b]) => (
            <tr key={k} className="border-t border-white/10">
              <th scope="row" className="py-1.5 pr-2 text-left font-normal text-slate-300">{k}</th>
              <td className="py-1.5">{a}</td>
              <td className="py-1.5">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-slate-300 space-y-1.5">
        <p className="flex items-center gap-1.5 font-semibold text-white">
          <Info size={14} className="text-cyan-300" aria-hidden="true" />
          How it is calculated
        </p>
        <p>
          Both routes are searched on the OpenStreetMap road graph. Each road segment gets the risk score of its nearest area for the{" "}
          {d.time_bucket.toLowerCase()} period ({d.hour}:00), from a model trained on the demo incident data. The lower-risk route minimises
          drive time × (1 + {d.safety_weight} × risk). Exposure is the length-weighted average risk along the route.
        </p>
        <p>{d.duration_basis}</p>
      </div>
    </GlassCard>
  );
}

export default AIRecommendation;
