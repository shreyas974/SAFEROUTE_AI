import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

// Scroll to #anchors (e.g. /about#privacy) and to the top on page changes.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) return el.scrollIntoView({ block: "start" });
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900">
        Skip to content
      </a>
      <ScrollManager />
      <AppRoutes />
    </>
  );
}

export default App;
