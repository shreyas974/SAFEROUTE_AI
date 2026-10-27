import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100">
      <Navbar />
      <div className="flex-1">
        <DashboardLayout />
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;