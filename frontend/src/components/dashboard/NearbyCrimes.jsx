import { useEffect, useState } from "react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { getAllCrimes } from "../../services/crimeService";

const THRESHOLD = 0.008;

function distance(lat1, lon1, lat2, lon2) {
  const dx = lat1 - lat2;
  const dy = lon1 - lon2;
  return Math.sqrt(dx * dx + dy * dy);
}

function NearbyCrimes() {
  const { routeData } = useRoute();
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCrimes() {
      try {
        const data = await getAllCrimes();
        setCrimes(data);
      } catch (err) {
        console.error("Error loading crimes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCrimes();
  }, []);

  if (!routeData || routeData.error) {
    return (
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">Nearby Crime Reports</h2>
        <p className="text-gray-500">Select a route to see nearby reports.</p>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">Nearby Crime Reports</h2>
        <p className="text-gray-500">Loading...</p>
      </GlassCard>
    );
  }

  const nearby = [];
  const seen = new Set();

  for (const point of routeData.route) {
    for (const crime of crimes) {
      if (seen.has(crime.FIR_ID)) continue;
      const d = distance(point.lat, point.lon, crime.Latitude, crime.Longitude);
      if (d < THRESHOLD) {
        nearby.push(crime);
        seen.add(crime.FIR_ID);
      }
    }
    if (nearby.length >= 20) break;
  }

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-4">
        Nearby Crime Reports ({nearby.length})
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {nearby.length === 0 && (
          <p className="text-gray-500">No reported crimes found near this route.</p>
        )}
        {nearby.map((crime) => (
          <div key={crime.FIR_ID} className="rounded-lg border p-3">
            <h3 className="font-semibold">{crime.Crime_Type}</h3>
            <p>{crime.Area}</p>
            <p>Severity: {crime.Severity}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default NearbyCrimes;
