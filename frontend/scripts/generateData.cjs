const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../../data/raw/crime_data.csv');
const hotspotsCsvPath = path.resolve(__dirname, '../../data/raw/hotspots.csv');

if (!fs.existsSync(csvPath)) {
  console.error("CSV file not found:", csvPath);
  process.exit(1);
}

const rawLines = fs.readFileSync(csvPath, 'utf-8').split(/\r?\n/).filter(line => line.trim().length > 0);
const headers = rawLines[0].split(',');

const allCrimes = [];
const areaCounts = {};
const typeCounts = {};
const severityCounts = { High: 0, Medium: 0, Low: 0 };

for (let i = 1; i < rawLines.length; i++) {
  const parts = rawLines[i].split(',');
  if (parts.length < headers.length) continue;

  const [
    FIR_ID, Crime_Type, Area, Latitude, Longitude,
    Date, Time, Severity, Status, Victim_Age, Victim_Gender
  ] = parts;

  const lat = parseFloat(Latitude);
  const lon = parseFloat(Longitude);

  if (isNaN(lat) || isNaN(lon)) continue;

  allCrimes.push({
    FIR_ID,
    id: FIR_ID,
    Crime_Type,
    Area,
    Latitude: lat,
    Longitude: lon,
    Date,
    Time,
    Severity,
    Status,
    Victim_Age: parseInt(Victim_Age) || 30,
    Victim_Gender
  });

  areaCounts[Area] = (areaCounts[Area] || 0) + 1;
  typeCounts[Crime_Type] = (typeCounts[Crime_Type] || 0) + 1;
  if (severityCounts[Severity] !== undefined) {
    severityCounts[Severity]++;
  } else {
    severityCounts[Severity] = 1;
  }
}

// Convert hotspots
let hotspots = [];
if (fs.existsSync(hotspotsCsvPath)) {
  const hLines = fs.readFileSync(hotspotsCsvPath, 'utf-8').split(/\r?\n/).filter(line => line.trim().length > 0);
  for (let i = 1; i < hLines.length; i++) {
    const parts = hLines[i].split(',');
    if (parts.length >= 5) {
      hotspots.push({
        id: parseInt(parts[0]),
        Latitude: parseFloat(parts[1]),
        Longitude: parseFloat(parts[2]),
        Crime_Count: parseInt(parts[3]),
        Risk: parts[4]
      });
    }
  }
}

const areaStats = Object.entries(areaCounts)
  .map(([Area, total_crimes]) => ({ Area, total_crimes }))
  .sort((a, b) => b.total_crimes - a.total_crimes);

const typeStats = Object.entries(typeCounts)
  .map(([Crime_Type, total]) => ({ Crime_Type, total }))
  .sort((a, b) => b.total - a.total);

const severityStats = Object.entries(severityCounts)
  .map(([Severity, total]) => ({ Severity, total }));

const outDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Sample representative crimes for ultra-fast browser rendering
const sampleCrimes = allCrimes.filter((_, idx) => idx % 8 === 0 || _.Severity === 'High').slice(0, 900);

fs.writeFileSync(path.join(outDir, 'crimesData.json'), JSON.stringify(sampleCrimes, null, 2));
fs.writeFileSync(path.join(outDir, 'hotspotsData.json'), JSON.stringify(hotspots, null, 2));
fs.writeFileSync(path.join(outDir, 'areaStats.json'), JSON.stringify(areaStats, null, 2));
fs.writeFileSync(path.join(outDir, 'typeStats.json'), JSON.stringify(typeStats, null, 2));
fs.writeFileSync(path.join(outDir, 'severityStats.json'), JSON.stringify(severityStats, null, 2));

console.log(`Successfully generated datasets: ${sampleCrimes.length} sample crimes, ${hotspots.length} hotspots, ${areaStats.length} areas.`);
