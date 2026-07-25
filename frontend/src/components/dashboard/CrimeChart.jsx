import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { getTypeStats } from "../../services/analyticsService";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function CrimeChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTypeStats()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading crime type stats...</p>;
  if (error) return <p>Error loading crime type stats: {error}</p>;
  if (!data.length) return <p>No crime type data available.</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Crimes by Type</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="Crime_Type"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => entry.Crime_Type}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CrimeChart;
