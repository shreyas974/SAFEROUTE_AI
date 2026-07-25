import { createContext, useContext, useState } from "react";
import { getSafeRoute } from "../services/routeService";

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchRoute = async (source, destination, hour = 21) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSafeRoute(source, destination, hour);
      setRouteData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch route");
      setRouteData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setRouteData(null);
    setError(null);
  };

  return (
    <RouteContext.Provider
      value={{
        routeData,
        loading,
        error,
        fetchRoute,
        clearRoute,
        currentLocation,
        setCurrentLocation,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  return useContext(RouteContext);
}
