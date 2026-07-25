import { createContext, useContext, useState } from "react";
import { getSafestRoute, getFastestRoute } from "../services/routeService";

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const [selectedRoute, setSelectedRoute] = useState(getSafestRoute());

  const [currentLocation, setCurrentLocation] = useState(null);

  return (
    <RouteContext.Provider
      value={{
        selectedRoute,
        setSelectedRoute,

        currentLocation,
        setCurrentLocation,

        showSafestRoute: () => setSelectedRoute(getSafestRoute()),
        showFastestRoute: () => setSelectedRoute(getFastestRoute()),
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  return useContext(RouteContext);
}