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
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading area stats...</p>;
  if (error) return <p>Error loading area stats: {error}</p>;
  if (!data.length) return <p>No area data available.</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Crimes by Area</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Area" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_crimes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChart;
