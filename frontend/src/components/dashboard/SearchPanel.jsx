import { useState } from "react";
import { MapPin } from "lucide-react";

import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";

import { useRoute } from "../../context/RouteContext";
import { getCurrentLocation } from "../../services/locationService";

function SearchPanel() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const {
    showSafestRoute,
    showFastestRoute,
    setCurrentLocation,
  } = useRoute();

  const handleSearch = () => {
    if (!source || !destination) {
      alert("Please enter both source and destination.");
      return;
    }

    // Temporary mock implementation
    showSafestRoute();
  };

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();

      setCurrentLocation(location);

      setSource("My Current Location");
    } catch (error) {
      console.error(error);
      alert("Unable to access your location.");
    }
  };

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-5">
        Find Safe Route
      </h2>

      <div className="space-y-4">
        <input
          className="glass w-full rounded-xl p-3"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <input
          className="glass w-full rounded-xl p-3"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <GlassButton onClick={handleSearch}>
          Find Safest Route
        </GlassButton>

        <GlassButton
          variant="secondary"
          onClick={showFastestRoute}
        >
          Show Fastest Route
        </GlassButton>

        <button
          onClick={handleCurrentLocation}
          className="glass flex w-full items-center justify-center gap-2 rounded-xl p-3 transition hover:scale-[1.02]"
        >
          <MapPin size={18} />
          Use My Location
        </button>
      </div>
    </GlassCard>
  );
}

export default SearchPanel;