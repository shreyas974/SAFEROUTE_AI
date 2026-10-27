import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { getTypeStats } from "../../services/analyticsService";

const COLORS = ["#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#f97316", "#ef4444"];

function CrimeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTypeStats()
      .then((res) => setData(res.slice(0, 8)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-72 flex items-center justify-center text-xs text-slate-400">Loading crime type stats...</div>;
  if (error) return <div className="h-72 flex items-center justify-center text-xs text-rose-400">Error loading crime type stats: {error}</div>;
  if (!data.length) return <div className="h-72 flex items-center justify-center text-xs text-slate-400">No crime type data available.</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Incident Breakdown by Type</h3>
        <span className="text-[11px] text-slate-400">Classification</span>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="Crime_Type"
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={45}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CrimeChart;
