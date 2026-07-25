import { ShieldCheck, TriangleAlert, Clock } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { analyzeRoute } from "../../services/riskEngine";

function AIRecommendation() {
  const { selectedRoute } = useRoute();

  const analysis = analyzeRoute(selectedRoute);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <ShieldCheck className="text-green-500" size={28} />
        <h2 className="text-2xl font-bold">
          AI Recommendation
        </h2>
      </div>

      <p className="text-gray-600 mb-6">
        Based on our analysis, the{" "}
        <strong>{selectedRoute.name}</strong> passes near{" "}
        <strong>{analysis.nearbyCrimes.length}</strong> reported crime
        incident(s). The estimated safety score is{" "}
        <strong>{analysis.safetyScore}%</strong>.
      </p>

      <div className="grid grid-cols-3 gap-4">

        <div className="rounded-xl bg-green-100 p-4 text-center">
          <ShieldCheck className="mx-auto mb-2 text-green-600" />
          <h3 className="font-semibold">Safety</h3>
          <p className="text-2xl font-bold">
            {analysis.safetyScore}%
          </p>
        </div>

        <div className="rounded-xl bg-red-100 p-4 text-center">
          <TriangleAlert className="mx-auto mb-2 text-red-600" />
          <h3 className="font-semibold">Nearby Crimes</h3>
          <p className="text-2xl font-bold">
            {analysis.nearbyCrimes.length}
          </p>
        </div>

        <div className="rounded-xl bg-blue-100 p-4 text-center">
          <Clock className="mx-auto mb-2 text-blue-600" />
          <h3 className="font-semibold">Travel Time</h3>
          <p className="text-xl font-bold">
            {selectedRoute.duration}
          </p>
        </div>

      </div>

      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
        <h3 className="font-semibold mb-2">
          AI Insight
        </h3>

        <p className="text-sm text-gray-700">
          This recommendation is calculated using nearby crime severity,
          route proximity to incidents, and estimated travel time. Routes
          with fewer high-severity incidents receive a higher safety score.
        </p>
      </div>
    </GlassCard>
  );
}

export default AIRecommendation;