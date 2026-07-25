import crimeData from "../mock/crimeData";

function distance(lat1, lon1, lat2, lon2) {
  const dx = lat1 - lat2;
  const dy = lon1 - lon2;
  return Math.sqrt(dx * dx + dy * dy);
}

const weights = {
  High: 5,
  Medium: 3,
  Low: 1,
};

export function analyzeRoute(route) {
  let totalRisk = 0;
  const nearbyCrimes = [];

  route.coordinates.forEach(([lat, lng]) => {
    crimeData.forEach((crime) => {
      const d = distance(lat, lng, crime.latitude, crime.longitude);

      // Approx. 300–400 m threshold (using mock coordinates)
      if (d < 0.0035) {
        totalRisk += weights[crime.severity];
        nearbyCrimes.push(crime);
      }
    });
  });

  const uniqueCrimes = [
    ...new Map(nearbyCrimes.map((c) => [c.id, c])).values(),
  ];

  const safetyScore = Math.max(0, 100 - totalRisk * 4);

  return {
    safetyScore,
    totalRisk,
    nearbyCrimes: uniqueCrimes,
  };
}