import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// Pages load on demand; the map page (Leaflet) and charts (Recharts) are the heavy ones.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoading() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#0b132b] text-slate-300" role="status">
      Loading…
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
