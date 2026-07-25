import SearchPanel from "./SearchPanel";
import RiskMeter from "./RiskMeter";
import AlertPanel from "./AlertPanel";
import RouteSummary from "./RouteSummary";
import AIRecommendation from "./AIRecommendation";
import MapView from "../map/MapView";
import DirectionsPanel from "../map/DirectionsPanel";
import NearbyCrimes from "./NearbyCrimes";

function DashboardLayout() {
  return (
    <main className="container py-8">
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <SearchPanel />
          <RiskMeter />
          <AlertPanel />
        </aside>

        {/* Map */}
        <section className="lg:col-span-9 space-y-6">
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