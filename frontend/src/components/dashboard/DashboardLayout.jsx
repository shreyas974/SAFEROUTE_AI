import SearchPanel from "./SearchPanel";
import RiskMeter from "./RiskMeter";
import DataNotice from "../common/DataNotice";
import RouteSummary from "./RouteSummary";
import AIRecommendation from "./AIRecommendation";
import MapView from "../map/MapView";
import DirectionsPanel from "../map/DirectionsPanel";
import NearbyCrimes from "./NearbyCrimes";

function DashboardLayout() {
  return (
    <main id="main" className="container py-8">
      <h1 className="sr-only">Plan a route</h1>
      <div className="mb-6">
        <DataNotice />
      </div>
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6" aria-label="Route planning">
          <SearchPanel />
          <RiskMeter />
        </aside>

        {/* Map */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-6" aria-label="Map and directions">
          <MapView />
          <DirectionsPanel />
        </section>
      </div>

      {/* Bottom Cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <RouteSummary />
        <AIRecommendation />
        <NearbyCrimes />
      </div>
    </main>
  );
}

export default DashboardLayout;