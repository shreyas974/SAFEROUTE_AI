import { useState } from "react";
import { MapPin } from "lucide-react";
import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";
import { useRoute } from "../../context/RouteContext";
import { getCurrentLocation } from "../../services/locationService";
import areaCoords from "../../data/areaCoords";

const areaNames = Object.keys(areaCoords);

function SearchPanel() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const {
    fetchRoute,
    clearRoute,
    routeData,
    loading,
    error,
    setCurrentLocation,
  } = useRoute();

  const handleSearch = () => {
    if (!source || !destination) {
      alert("Please select both source and destination.");
      return;
    }
    if (source === destination) {
      alert("Source and destination cannot be the same.");
      return;
    }
    fetchRoute(areaCoords[source], areaCoords[destination]);
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (err) {
      console.error(err);
      alert("Unable to access your location.");
    }
  };

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-5">Find Safe Route</h2>
      <div className="space-y-4">
        <select
          className="glass w-full rounded-xl p-3"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">Select source area</option>
          {areaNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          className="glass w-full rounded-xl p-3"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="">Select destination area</option>
          {areaNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <GlassButton onClick={handleSearch}>
          {loading ? "Finding route..." : "Find Safest Route"}
        </GlassButton>

        {routeData && (
          <button onClick={clearRoute} className="glass w-full rounded-xl p-2 text-sm">
            Clear route
          </button>
        )}

        <button
          onClick={handleCurrentLocation}
          className="glass flex w-full items-center justify-center gap-2 rounded-xl p-3 transition hover:scale-[1.02]"
        >
          <MapPin size={18} />
          Use My Location
        </button>

        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {routeData && !routeData.error && (
          <div className="glass rounded-xl p-4 text-sm space-y-1">
            <p><strong>Distance:</strong> {routeData.distance_km} km</p>
            <p><strong>Average Risk:</strong> {routeData.average_risk}</p>
            <p><strong>Route Points:</strong> {routeData.route_points}</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default SearchPanel;
