import { ShieldCheck, TriangleAlert, Ruler } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";

function riskLabel(risk) {
  if (risk >= 0.6) return { text: "High Risk", color: "text-red-600" };
  if (risk >= 0.3) return { text: "Medium Risk", color: "text-orange-500" };
  return { text: "Low Risk", color: "text-green-600" };
}

function AIRecommendation() {
  const { routeData } = useRoute();

  if (!routeData || routeData.error) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="text-green-500" size={28} />
          <h2 className="text-2xl font-bold">AI Recommendation</h2>
        </div>
        <p className="text-gray-500">
          Select a source and destination to get a route recommendation.
        </p>
      </GlassCard>
    );
  }

  const safetyScore = Math.max(0, Math.round(100 - routeData.average_risk * 100));
  const risk = riskLabel(routeData.average_risk);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <ShieldCheck className="text-green-500" size={28} />
        <h2 className="text-2xl font-bold">AI Recommendation</h2>
      </div>

      <p className="text-gray-600 mb-6">
        This route covers <strong>{routeData.distance_km} km</strong> across{" "}
        <strong>{routeData.route_points}</strong> road segments. Based on
        historical crime patterns along this path, it is rated{" "}
        <strong className={risk.color}>{risk.text}</strong> with an estimated
        safety score of <strong>{safetyScore}%</strong>.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-green-100 p-4 text-center">
          <ShieldCheck className="mx-auto mb-2 text-green-600" />
          <h3 className="font-semibold">Safety</h3>
          <p className="text-2xl font-bold">{safetyScore}%</p>
        </div>

        <div className="rounded-xl bg-red-100 p-4 text-center">
          <TriangleAlert className="mx-auto mb-2 text-red-600" />
          <h3 className="font-semibold">Risk Level</h3>
          <p className={`text-lg font-bold ${risk.color}`}>{risk.text}</p>
        </div>

        <div className="rounded-xl bg-blue-100 p-4 text-center">
          <Ruler className="mx-auto mb-2 text-blue-600" />
          <h3 className="font-semibold">Distance</h3>
          <p className="text-xl font-bold">{routeData.distance_km} km</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
        <h3 className="font-semibold mb-2">AI Insight</h3>
        <p className="text-sm text-gray-700">
          This score is calculated by our trained risk model using historical
          FIR data along the road segments in this route, weighted by time of
          day and reported crime severity in each area.
        </p>
      </div>
    </GlassCard>
  );
}

export default AIRecommendation;
