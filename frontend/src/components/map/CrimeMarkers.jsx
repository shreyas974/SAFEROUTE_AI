import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { getAllCrimes } from "../../services/crimeService";

// Custom SVG DivIcons by severity
const createSeverityIcon = (severity) => {
  const isHigh = severity === "High";
  const isMedium = severity === "Medium";
  const color = isHigh ? "#ef4444" : isMedium ? "#f59e0b" : "#3b82f6";
  const glow = isHigh ? "0 0 10px #ef4444" : "0 0 6px #3b82f6";

  return L.divIcon({
    className: "custom-crime-marker",
    html: `<div style="
      width: 14px;
      height: 14px;
      background-color: ${color};
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: ${glow};
      cursor: pointer;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

function CrimeMarkers() {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCrimes() {
      try {
        const data = await getAllCrimes();
        setCrimes(data);
      } catch (error) {
        console.error("Error loading crimes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCrimes();
  }, []);

  if (loading || !crimes.length) return null;

  return (
    <MarkerClusterGroup chunkedLoading maxClusterRadius={45}>
      {crimes.map((crime, index) => {
        const key = crime.FIR_ID || crime.ID || crime.id || index;
        const isHigh = crime.Severity === "High";
        const isMedium = crime.Severity === "Medium";
        const severityBg = isHigh ? "#ef4444" : isMedium ? "#f59e0b" : "#10b981";

        return (
          <Marker
            key={key}
            position={[crime.Latitude, crime.Longitude]}
            icon={createSeverityIcon(crime.Severity)}
          >
            <Popup className="custom-leaflet-popup">
              <div style={{ minWidth: "160px", padding: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "13px", color: "#0f172a" }}>{crime.Crime_Type}</strong>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    backgroundColor: severityBg,
                    color: "#ffffff",
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}>
                    {crime.Severity}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                  <div>📍 <strong>{crime.Area}</strong></div>
                  {crime.Time && <div>🕒 {crime.Time}</div>}
                  {crime.FIR_ID && <div style={{ color: "#64748b", marginTop: "4px" }}>FIR #{crime.FIR_ID}</div>}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}

export default CrimeMarkers;
