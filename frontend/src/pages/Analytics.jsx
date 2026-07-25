import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AreaChart from "../components/dashboard/AreaChart";
import CrimeChart from "../components/dashboard/CrimeChart";
import SeverityChart from "../components/dashboard/SeverityChart";

function Analytics() {
  return (
    <>
      <Navbar />
      <main className="container min-h-screen py-12">
        <h1 className="text-5xl font-bold mb-4">
          Analytics
        </h1>
        <p className="mb-8 text-gray-500">
          Crime statistics and charts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 border rounded-lg shadow-sm">
            <AreaChart />
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <CrimeChart />
          </div>
          <div className="p-4 border rounded-lg shadow-sm md:col-span-2">
            <SeverityChart />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Analytics;
