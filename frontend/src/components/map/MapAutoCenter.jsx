import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useRoute } from "../../context/RouteContext";

function MapAutoCenter() {
  const map = useMap();
  const { currentLocation, routeData } = useRoute();

  // 1. Auto-center on user GPS when requested
  useEffect(() => {
    if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
      map.flyTo(
        [currentLocation.latitude, currentLocation.longitude],
        15,
        {
          animate: true,
          duration: 1.5,
        }
      );
    }
  }, [currentLocation, map]);

  // 2. Auto-fit bounds on searched route
  useEffect(() => {
    if (routeData && routeData.route && routeData.route.length > 0) {
      try {
        const latLngs = routeData.route.map((p) => [
          p.lat ?? (Array.isArray(p) ? p[0] : p.latitude),
          p.lon ?? (Array.isArray(p) ? p[1] : p.longitude),
        ]);
        const bounds = L.latLngBounds(latLngs);
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [60, 60],
            animate: true,
            duration: 1.2,
            maxZoom: 15,
          });
        }
      } catch (e) {
        console.warn("Map fitBounds warning:", e);
      }
    }
  }, [routeData, map]);

  return null;
}

export default MapAutoCenter;