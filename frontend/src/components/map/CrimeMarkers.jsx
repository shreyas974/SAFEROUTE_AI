import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { getAllCrimes } from "../../services/crimeService";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  if (loading) return null;

  console.log("Number of crimes:", crimes.length);
  console.log("Sample:", JSON.stringify(crimes[0], null, 2));

  return (
    <MarkerClusterGroup chunkedLoading>
      {crimes.map((crime, index) => (
        <Marker
          key={crime.ID || crime.id || index}
          position={[crime.Latitude, crime.Longitude]}
          icon={icon}
        >
          <Popup>
            <strong>{crime.Crime_Type}</strong>
            <br />
            {crime.Area}
            <br />
            Severity: {crime.Severity}
            <br />
            {crime.Time}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

export default CrimeMarkers;

