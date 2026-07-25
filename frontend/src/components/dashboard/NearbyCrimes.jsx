import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { analyzeRoute } from "../../services/riskEngine";

function NearbyCrimes() {
  const { selectedRoute } = useRoute();

  const analysis = analyzeRoute(selectedRoute);

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-4">
        Nearby Crime Reports
      </h2>

      <div className="space-y-3">
        {analysis.nearbyCrimes.map((crime) => (
          <div
            key={crime.id}
            className="rounded-lg border p-3"
          >
            <h3 className="font-semibold">
              {crime.type}
            </h3>

            <p>{crime.location}</p>

            <p>{crime.severity}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default NearbyCrimes;