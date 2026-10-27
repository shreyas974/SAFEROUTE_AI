import { useEffect, useState } from "react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { getAllCrimes } from "../../services/crimeService";
import { ShieldAlert, MapPin, Clock, FileText } from "lucide-react";

const THRESHOLD = 0.012; // Radius ~1.3 km

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
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={20} className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Nearby Incident Analysis</h2>
        </div>
        <p className="text-sm text-slate-400">
          Calculate a route to analyze historical incidents and police FIRs along the path.
        </p>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Nearby Incident Analysis</h2>
        <p className="text-xs text-slate-400">Loading verified police reports...</p>
      </GlassCard>
    );
  }

  const nearby = [];
  const seen = new Set();

  if (routeData.route && Array.isArray(routeData.route)) {
    for (const point of routeData.route) {
      const pLat = point.lat ?? (Array.isArray(point) ? point[0] : point.latitude);
      const pLon = point.lon ?? (Array.isArray(point) ? point[1] : point.longitude);
      if (pLat == null || pLon == null) continue;

      for (const crime of crimes) {
        const key = crime.FIR_ID || crime.id;
        if (seen.has(key)) continue;
        const d = distance(pLat, pLon, crime.Latitude, crime.Longitude);
        if (d < THRESHOLD) {
          nearby.push(crime);
          seen.add(key);
        }
      }
      if (nearby.length >= 15) break;
    }
  }

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Route Incidents</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
          {nearby.length} Detected
        </span>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {nearby.length === 0 ? (
          <div className="text-center py-8 text-xs text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            ✓ No reported high-risk incidents along this route corridor!
          </div>
        ) : (
          nearby.map((crime) => {
            const isHigh = crime.Severity === "High";
            const isMedium = crime.Severity === "Medium";
            const badgeClass = isHigh
              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
              : isMedium
              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

            return (
              <div
                key={crime.FIR_ID || crime.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1.5 transition hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{crime.Crime_Type}</h3>
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                    {crime.Severity}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-cyan-400" />
                    {crime.Area}
                  </span>
                  {crime.Time && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      {crime.Time}
                    </span>
                  )}
                  {crime.FIR_ID && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                      FIR #{crime.FIR_ID}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}

export default NearbyCrimes;
