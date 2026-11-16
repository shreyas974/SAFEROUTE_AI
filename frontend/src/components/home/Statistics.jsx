import { useEffect, useState } from "react";
import { Database, MapPinned, Flame, CalendarRange } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { getDatasetInfo, getHotspots } from "../../services/crimeService";

/** Live facts about the data behind the app, read from the API (nothing here is typed in by hand). */
function Statistics() {
  const [info, setInfo] = useState(null);
  const [hotspots, setHotspots] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    Promise.all([getDatasetInfo(), getHotspots()])
      .then(([i, h]) => {
        setInfo(i);
        setHotspots(h.length);
      })
      .catch((e) => setError(e.message));
  }, []);
  const years = info?.date_range?.map((d) => d?.slice(0, 4)).join("–");
  const stats = [
    { icon: Database, value: info?.records?.toLocaleString(), label: "Demo incidents (synthetic)" },
    { icon: MapPinned, value: info?.areas, label: "Named areas" },
    { icon: Flame, value: hotspots, label: "Hotspot clusters (DBSCAN)" },
    { icon: CalendarRange, value: years, label: "Dates covered" },
  ];
  return (
    <section className="container py-24" aria-labelledby="stats-title">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 id="stats-title" className="text-4xl sm:text-5xl font-bold mb-4">
          The data behind the map
        </h2>
        <p className="text-lg text-[color:var(--text-secondary)]">
          Read live from the API. The incidents are generated for demonstration, so these numbers describe the demo dataset, not Bengaluru.
        </p>
      </div>
      {error ? (
        <p role="alert" className="text-center text-sm text-rose-300">
          {error}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <GlassCard key={label} className="p-8 text-center">
              <Icon size={26} className="mx-auto mb-5 text-cyan-300" aria-hidden="true" />
              <p className="text-3xl font-bold mb-1">{value ?? <span className="inline-block h-8 w-20 rounded bg-white/10 animate-pulse motion-reduce:animate-none" aria-label="Loading" />}</p>
              <p className="text-sm text-[color:var(--text-secondary)]">{label}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}

export default Statistics;
