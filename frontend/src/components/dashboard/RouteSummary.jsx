import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";

function riskLabel(risk) {
  if (risk >= 0.6) return { text: "High", color: "text-red-600" };
  if (risk >= 0.3) return { text: "Medium", color: "text-orange-500" };
  return { text: "Low", color: "text-green-600" };
}

function RouteSummary() {
  const { routeData } = useRoute();

  if (!routeData || routeData.error) {
    return (
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">Recommended Route</h2>
        <p className="text-gray-500">
          Select a source and destination to see route details.
        </p>
      </GlassCard>
    );
  }

  const risk = riskLabel(routeData.average_risk);

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-4">Recommended Route</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Distance</p>
          <h3 className="text-xl font-semibold">
            {routeData.distance_km} km
          </h3>
        </div>
        <div>
          <p className="text-gray-500">Route Points</p>
          <h3 className="text-xl font-semibold">
            {routeData.route_points}
          </h3>
        </div>
        <div>
          <p className="text-gray-500">Risk Score</p>
          <h3 className={`text-xl font-semibold ${risk.color}`}>
            {risk.text} ({routeData.average_risk})
          </h3>
        </div>
      </div>
    </GlassCard>
  );
}

export default RouteSummary;
