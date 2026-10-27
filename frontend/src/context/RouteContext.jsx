import { createContext, useContext, useState } from "react";
import { getSafeRoute } from "../services/routeService";

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const [routeData, setRouteData] = useState(null);
  const [activeRouteType, setActiveRouteType] = useState("safest"); // "safest" | "fastest"
  const [sourceName, setSourceName] = useState("");
  const [destName, setDestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchRoute = async (source, destination, hour = 21, srcName = "", dstName = "") => {
    setLoading(true);
    setError(null);
    if (srcName) setSourceName(srcName);
    if (dstName) setDestName(dstName);
    try {
      const data = await getSafeRoute(source, destination, hour);
      setRouteData(data);
      setActiveRouteType("safest");
    } catch (err) {
      setError(err.message || "Failed to calculate navigation route");
      setRouteData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setRouteData(null);
    setError(null);
    setSourceName("");
    setDestName("");
  };

  // The active display route (either the safest recommended or fastest alternative)
  const activeRoute =
    activeRouteType === "fastest" && routeData?.alternative_route
      ? {
          ...routeData.alternative_route,
          source_coords: routeData.source_coords,
          dest_coords: routeData.dest_coords,
        }
      : routeData;

  return (
    <RouteContext.Provider
      value={{
        routeData: activeRoute,
        rawRouteData: routeData,
        activeRouteType,
        setActiveRouteType,
        sourceName,
        destName,
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
