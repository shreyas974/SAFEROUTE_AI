import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { getDatasetInfo } from "../../services/crimeService";

/** States where the incident numbers come from. Shown wherever incident-derived numbers appear. */
function DataNotice({ compact = false }) {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    getDatasetInfo().then(setInfo).catch(() => setInfo(null));
  }, []);
  const synthetic = !info || info.kind === "synthetic";
  if (!synthetic) return null;
  return (
    <aside
      role="note"
      aria-label="About the data"
      className={`rounded-2xl border border-amber-400/40 bg-amber-500/10 text-amber-100 ${compact ? "p-3 text-xs" : "p-4 text-sm"} flex gap-3`}
    >
      <Info size={compact ? 16 : 18} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
      <div>
        <strong className="text-amber-200">Demo data.</strong>{" "}
        The incidents are synthetic{info?.records ? ` (${info.records.toLocaleString()} generated records)` : ""}, not police records. Routes use the
        real road network, but their risk scores do not describe real safety in any neighbourhood.{" "}
        <Link to="/about#data" className="underline font-semibold text-amber-200 hover:text-white">
          How this works
        </Link>
      </div>
    </aside>
  );
}

export default DataNotice;
