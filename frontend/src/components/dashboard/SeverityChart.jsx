import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { getSeverityStats } from "../../services/analyticsService";

const SEVERITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
};

function SeverityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSeverityStats()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-72 flex items-center justify-center text-xs text-slate-400">Loading severity distribution...</div>;
  if (error) return <div className="h-72 flex items-center justify-center text-xs text-rose-400">Error loading severity stats: {error}</div>;
  if (!data.length) return <div className="h-72 flex items-center justify-center text-xs text-slate-400">No severity data available.</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Incident Severity Distribution</h3>
          <p className="text-xs text-slate-400">DBSCAN Clustering Severity Weighting</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low</span>
        </div>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="Severity" tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={SEVERITY_COLORS[entry.Severity] || "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SeverityChart;
