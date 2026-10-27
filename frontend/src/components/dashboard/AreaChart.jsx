import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { getAreaStats } from "../../services/analyticsService";

function AreaChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAreaStats()
      .then((res) => setData(res.slice(0, 10)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-72 flex items-center justify-center text-xs text-slate-400">Loading area statistics...</div>;
  if (error) return <div className="h-72 flex items-center justify-center text-xs text-rose-400">Error loading area stats: {error}</div>;
  if (!data.length) return <div className="h-72 flex items-center justify-center text-xs text-slate-400">No area data available.</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Incidents by Bengaluru Area (Top 10)</h3>
        <span className="text-[11px] text-slate-400">Police FIR Data</span>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="Area"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              interval={0}
              angle={-35}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="total_crimes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AreaChart;
