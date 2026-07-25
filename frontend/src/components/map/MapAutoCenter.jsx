import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useRoute } from "../../context/RouteContext";

function MapAutoCenter() {
  const map = useMap();
  const { currentLocation } = useRoute();

  useEffect(() => {
    if (currentLocation) {
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

  return null;
}

export default MapAutoCenter;