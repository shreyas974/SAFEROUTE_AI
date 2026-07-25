import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { analyzeRoute } from "../../services/riskEngine";

function RiskMeter() {
  const { selectedRoute } = useRoute();

  const analysis = analyzeRoute(selectedRoute);

  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-4">
        AI Safety Score
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-500"
          style={{
            width: `${analysis.safetyScore}%`,
          }}
        />
      </div>

      <h3 className="mt-4 text-2xl font-bold">
        {analysis.safetyScore}%
      </h3>

      <p className="text-gray-500">
        Risk Points: {analysis.totalRisk}
      </p>
    </GlassCard>
  );
}

export default RiskMeter;