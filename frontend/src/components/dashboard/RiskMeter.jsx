import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";

function RiskMeter() {
  const { routeData } = useRoute();

  if (!routeData || routeData.error) {
    return (
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">AI Safety Score</h2>
        <p className="text-gray-500">Select a route to see its safety score.</p>
      </GlassCard>
    );
  }

  const safetyScore = Math.max(0, Math.round(100 - routeData.average_risk * 100));
  const barColor =
    safetyScore >= 70 ? "bg-green-500" : safetyScore >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-4">AI Safety Score</h2>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${barColor} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${safetyScore}%` }}
        />
      </div>
      <h3 className="mt-4 text-2xl font-bold">{safetyScore}%</h3>
      <p className="text-gray-500">
        Average Risk: {routeData.average_risk}
      </p>
    </GlassCard>
  );
}

export default RiskMeter;
