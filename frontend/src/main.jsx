import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { RouteProvider } from "./context/RouteContext";

import "./index.css";
import "./styles/globals.css";
import "./styles/glass.css";
import "./styles/animations.css";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteProvider>
        <Toaster position="top-right" />
        <App />
      </RouteProvider>
    </BrowserRouter>
  </React.StrictMode>
);