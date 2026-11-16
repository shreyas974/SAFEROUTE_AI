import { useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, ShieldCheck, Zap, Bookmark, Loader2 } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { useRoute } from "../../context/RouteContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { getCurrentLocation } from "../../services/locationService";
import { getAreas } from "../../services/crimeService";

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const fmtHour = (h) => `${String(h).padStart(2, "0")}:00`;
const bucketOf = (h) => (h < 6 ? "Night" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening");
const PREFERENCE = [
  { max: 0, label: "Fastest only" },
  { max: 2, label: "Mostly fastest" },
  { max: 5, label: "Balanced" },
  { max: 8, label: "Prefer lower risk" },
  { max: 10, label: "Avoid risk strongly" },
];
const preferenceLabel = (w) => PREFERENCE.find((p) => w <= p.max).label;

const PRESETS = [
  ["Koramangala", "Indiranagar"],
  ["Hebbal", "HSR Layout"],
  ["Jayanagar", "MG Road"],
  ["Malleshwaram", "Bellandur"],
];

const selectClass =
  "w-full rounded-xl border border-white/20 bg-slate-900 text-white text-sm p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60";

function SearchPanel() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [hour, setHour] = useState(21);
  const [weight, setWeight] = useState(5);
  const [areas, setAreas] = useState(null);
  const [areasError, setAreasError] = useState(null);
  const { user, saveRoute, accountsAvailable } = useAuth();
  const { fetchRoute, clearRoute, routeData, rawRouteData, activeRouteType, setActiveRouteType, loading, error, setCurrentLocation } = useRoute();

  // Area list (and whether the road graph reaches each one) comes from the server.
  useEffect(() => {
    let live = true;
    let timer;
    const load = () =>
      getAreas()
        .then((d) => {
          if (!live) return;
          setAreas(d.areas);
          setAreasError(null);
          if (d.road_graph !== "loaded") timer = setTimeout(load, 3000); // coverage known once the graph has loaded
        })
        .catch((e) => live && setAreasError(e.message));
    load();
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, []);

  const byName = useMemo(() => Object.fromEntries((areas ?? []).map((a) => [a.name, a])), [areas]);
  const presets = PRESETS.filter(([a, b]) => byName[a]?.covered !== false && byName[b]?.covered !== false);

  const run = (src, dst) => {
    if (!src || !dst) return toast.error("Choose a start and a destination.");
    if (src === dst) return toast.error("Start and destination must be different areas.");
    fetchRoute([byName[src].lat, byName[src].lon], [byName[dst].lat, byName[dst].lon], hour, src, dst, weight);
  };

  const handleCurrentLocation = async () => {
    try {
      setCurrentLocation(await getCurrentLocation());
      toast.success("Your location is shown on the map. It is not sent to the server.");
    } catch {
      toast.error("Location access was denied or is unavailable in this browser.");
    }
  };

  const cmp = rawRouteData?.comparison;
  const alt = rawRouteData?.alternative_route;

  return (
    <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold text-white">Plan a route</h2>
        <span className="text-[11px] text-cyan-200 bg-cyan-500/10 border border-cyan-400/30 px-2 py-0.5 rounded-full">Real road network</span>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          run(source, destination);
        }}
      >
        {areasError ? (
          <p role="alert" className="text-sm text-rose-200 p-2.5 bg-rose-500/15 border border-rose-400/30 rounded-lg">
            {areasError}
          </p>
        ) : null}
        {[
          ["origin", "Start", source, setSource],
          ["destination", "Destination", destination, setDestination],
        ].map(([id, label, value, set]) => (
          <div key={id}>
            <label htmlFor={`sr-${id}`} className="block text-sm font-semibold text-slate-200 mb-1">
              {label}
            </label>
            <select id={`sr-${id}`} className={selectClass} value={value} onChange={(e) => set(e.target.value)} disabled={!areas} required>
              <option value="">{areas ? "Choose an area" : "Loading areas…"}</option>
              {(areas ?? []).map((a) => (
                <option key={a.name} value={a.name} disabled={a.covered === false}>
                  {a.name}
                  {a.covered === false ? " (outside road coverage)" : ""}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label htmlFor="sr-hour" className="block text-sm font-semibold text-slate-200 mb-1">
            Departure time
          </label>
          <select id="sr-hour" className={selectClass} value={hour} onChange={(e) => setHour(Number(e.target.value))}>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {fmtHour(h)} · {bucketOf(h).toLowerCase()}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">The risk model uses four periods: night, morning, afternoon, evening.</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label htmlFor="sr-weight" className="text-sm font-semibold text-slate-200">
              Route preference
            </label>
            <output htmlFor="sr-weight" className="text-xs font-semibold text-cyan-200">
              {preferenceLabel(weight)}
            </output>
          </div>
          <input
            id="sr-weight"
            type="range"
            min="0"
            max="10"
            step="1"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full accent-cyan-400 h-6"
            aria-describedby="sr-weight-help"
          />
          <div className="flex justify-between text-[11px] text-slate-400" aria-hidden="true">
            <span>Fastest</span>
            <span>Lowest risk</span>
          </div>
          <p id="sr-weight-help" className="mt-1 text-xs text-slate-400">
            How many extra minutes you will accept to stay out of areas the model rates riskier at this time.
          </p>
        </div>

        {presets.length ? (
          <fieldset>
            <legend className="text-xs font-semibold text-slate-300 mb-1.5">Try a trip</legend>
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map(([a, b]) => (
                <button
                  key={a + b}
                  type="button"
                  disabled={!areas || loading}
                  onClick={() => {
                    setSource(a);
                    setDestination(b);
                    run(a, b);
                  }}
                  className="text-left text-xs min-h-[36px] px-2.5 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/15 hover:border-cyan-400/40 text-slate-200 transition"
                >
                  {a} → {b}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <button
          type="submit"
          disabled={loading || !areas}
          className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Navigation size={16} aria-hidden="true" />}
          <span>{loading ? "Finding routes…" : "Find routes"}</span>
        </button>

        <button
          type="button"
          onClick={handleCurrentLocation}
          className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-slate-100 text-sm font-semibold transition"
        >
          <MapPin size={15} className="text-cyan-300" aria-hidden="true" />
          <span>Show my location</span>
        </button>

        {error ? (
          <p role="alert" className="text-sm text-rose-200 p-2.5 bg-rose-500/15 border border-rose-400/30 rounded-lg">
            {error}
          </p>
        ) : null}
      </form>

      {rawRouteData ? (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-3" aria-live="polite">
          <p className="text-sm text-slate-200 leading-relaxed">
            {cmp.same_route ? (
              <>The fastest route is also the lowest-risk option at this preference. No detour lowers exposure enough to be worth it.</>
            ) : (
              <>
                The lower-risk route is{" "}
                <strong className="text-white">
                  {cmp.extra_minutes >= 0 ? `${cmp.extra_minutes} min longer` : `${-cmp.extra_minutes} min shorter`}
                </strong>{" "}
                ({cmp.extra_distance_km >= 0 ? "+" : ""}
                {cmp.extra_distance_km} km) and cuts exposure to higher-risk areas by{" "}
                <strong className="text-emerald-300">{cmp.exposure_reduction_pct}%</strong>.
              </>
            )}
          </p>

          <div className={`grid gap-2 ${alt ? "grid-cols-2" : "grid-cols-1"}`} role="radiogroup" aria-label="Route shown on the map">
            {[
              { type: "safest", r: rawRouteData, icon: ShieldCheck, tone: "emerald", label: alt ? "Lower risk" : "Recommended" },
              ...(alt ? [{ type: "fastest", r: alt, icon: Zap, tone: "amber", label: "Fastest" }] : []),
            ].map(({ type, r, icon: Icon, tone, label }) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={activeRouteType === type}
                onClick={() => setActiveRouteType(type)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-0.5 min-h-[44px] ${
                  activeRouteType === type ? (tone === "emerald" ? "bg-emerald-500/20 border-emerald-300" : "bg-amber-500/20 border-amber-300") : "bg-white/5 border-white/15 hover:border-white/30"
                }`}
              >
                <span className="flex items-center gap-1.5 font-bold text-sm text-white">
                  <Icon size={14} className={tone === "emerald" ? "text-emerald-300" : "text-amber-300"} aria-hidden="true" />
                  {label}
                </span>
                <span className="text-xs text-slate-200">
                  {r.distance_km} km · {r.duration}
                </span>
                <span className="text-xs text-slate-300">{r.risk_level}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {user || !accountsAvailable ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await saveRoute({
                      source,
                      destination,
                      distance_km: routeData.distance_km,
                      average_risk: routeData.average_risk,
                      duration: routeData.duration,
                      hour,
                      preference: preferenceLabel(weight),
                    });
                    toast.success(user ? "Route saved to your account." : "Route saved on this device.");
                  } catch {
                    toast.error("The route could not be saved.");
                  }
                }}
                className="flex-1 min-h-[40px] px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border border-cyan-400/30 text-sm font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Bookmark size={14} aria-hidden="true" />
                Save route
              </button>
            ) : null}
            <button type="button" onClick={clearRoute} className="min-h-[40px] px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm transition">
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}

export default SearchPanel;
