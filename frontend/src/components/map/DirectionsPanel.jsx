import {
  ArrowUp, ArrowUpRight, ArrowUpLeft,
  CornerUpRight, CornerUpLeft, Navigation, MapPin,
} from "lucide-react";
import { useRoute } from "../../context/RouteContext";
import GlassCard from "../common/GlassCard";

function stepIcon(instruction) {
  switch (instruction) {
    case "Turn right":
      return <CornerUpRight size={20} />;
    case "Turn left":
      return <CornerUpLeft size={20} />;
    case "Slight right":
      return <ArrowUpRight size={20} />;
    case "Slight left":
      return <ArrowUpLeft size={20} />;
    default:
      return <ArrowUp size={20} />;
  }
}

function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

function DirectionsPanel() {
  const { routeData, loading } = useRoute();

  if (loading) {
    return (
      <GlassCard className="p-6">
        <p className="text-[color:var(--text-secondary)]">Calculating safest route...</p>
      </GlassCard>
    );
  }

  if (!routeData || !routeData.steps || routeData.steps.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <Navigation className="mx-auto mb-3 text-[color:var(--text-secondary)]" size={28} />
        <p className="text-[color:var(--text-secondary)]">
          Search a route to see turn-by-turn directions.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Directions</h3>
        <span className="text-sm text-[color:var(--text-secondary)]">
          {routeData.distance_km} km
        </span>
      </div>

      <ol className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
        {routeData.steps.map((step, index) => (
          <li
            key={index}
            className="flex items-start gap-3 py-3 border-b border-white/40 last:border-b-0"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {stepIcon(step.instruction)}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {step.instruction} {step.street !== "unnamed road" ? `onto ${step.street}` : ""}
              </p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {formatDistance(step.distance_m)}
              </p>
            </div>
          </li>
        ))}

        <li className="flex items-start gap-3 pt-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium">You have arrived</p>
            <p className="text-sm text-[color:var(--text-secondary)]">Destination reached</p>
          </div>
        </li>
      </ol>
    </GlassCard>
  );
}

export default DirectionsPanel;
