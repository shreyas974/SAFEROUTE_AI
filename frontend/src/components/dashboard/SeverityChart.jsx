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

  if (loading) return <p>Loading severity stats...</p>;
  if (error) return <p>Error loading severity stats: {error}</p>;
  if (!data.length) return <p>No severity data available.</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Crimes by Severity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Severity" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={SEVERITY_COLORS[entry.Severity] || "#3b82f6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SeverityChart;
