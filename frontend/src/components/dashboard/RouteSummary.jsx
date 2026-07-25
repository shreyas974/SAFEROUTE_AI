import GlassCard from "../common/GlassCard";
import { getSafestRoute } from "../../services/routeService";

function RouteSummary() {
  const route = getSafestRoute();

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-4">
        Recommended Route
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Distance</p>
          <h3 className="text-xl font-semibold">
            {route.distance}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Travel Time</p>
          <h3 className="text-xl font-semibold">
            {route.duration}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Risk Score</p>
          <h3 className="text-xl font-semibold text-green-600">
            {route.risk}
          </h3>
        </div>
      </div>
    </GlassCard>
  );
}

export default RouteSummary;