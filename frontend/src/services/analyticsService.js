import { api } from "./api";

export const getAreaStats = () => api("/stats/area");
export const getTypeStats = () => api("/stats/type");
export const getSeverityStats = () => api("/stats/severity");
