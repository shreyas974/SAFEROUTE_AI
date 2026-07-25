import routes from "../mock/routes";

export function getRoutes() {
  return routes;
}

export function getSafestRoute() {
  return routes.find((route) => route.name === "Safest Route");
}

export function getFastestRoute() {
  return routes.find((route) => route.name === "Fastest Route");
}