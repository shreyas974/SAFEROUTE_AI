import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import AreaChart from "../components/dashboard/AreaChart";
import CrimeChart from "../components/dashboard/CrimeChart";
import SeverityChart from "../components/dashboard/SeverityChart";
import { BarChart3, AlertTriangle, CalendarRange, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import DataNotice from "../components/common/DataNotice";
import { getDatasetInfo, getHotspots } from "../services/crimeService";

const Num = ({ v, className }) => <p className={`text-3xl font-extrabold ${className}`}>{v ?? "–"}</p>;

function Analytics() {
  const [info, setInfo] = useState(null);
  const [hotspots, setHotspots] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    Promise.all([getDatasetInfo(), getHotspots()])
      .then(([i, h]) => {
        setInfo(i);
        setHotspots(h.length);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100">
      <Navbar />

      <main id="main" className="container mx-auto px-4 sm:px-6 py-12 flex-1">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <BarChart3 size={14} className="text-cyan-400" />
            <span>Synthetic demo dataset</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Demo data analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            The incidents the risk model was trained on. They are generated for demonstration and say nothing about real
            safety in these areas; they show how the app would work with real data.
          </p>
        </div>

        <div className="mb-8">
          <DataNotice />
        </div>
        {error ? (
          <p role="alert" className="mb-6 text-sm text-rose-200 p-3 bg-rose-500/15 border border-rose-400/30 rounded-xl">
            {error}
          </p>
        ) : null}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Incidents</span>
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <BarChart3 size={18} />
              </div>
            </div>
            <Num v={info?.records?.toLocaleString()} className="text-white" />
            <p className="text-xs text-slate-400 mt-1">Synthetic records</p>
          </GlassCard>

          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">High Risk Clusters</span>
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                <AlertTriangle size={18} />
              </div>
            </div>
            <Num v={hotspots} className="text-rose-300" />
            <p className="text-xs text-slate-400 mt-1">Clusters found by DBSCAN</p>
          </GlassCard>

          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Areas Monitored</span>
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                <MapPin size={18} />
              </div>
            </div>
            <Num v={info?.areas} className="text-cyan-300" />
            <p className="text-xs text-slate-400 mt-1">Named areas in the dataset</p>
          </GlassCard>

          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Dates covered</span>
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300">
                <CalendarRange size={18} aria-hidden="true" />
              </div>
            </div>
            <Num v={info?.date_range?.map((d) => d?.slice(0, 7)).join(" → ")} className="text-emerald-300 !text-xl" />
            <p className="text-xs text-slate-300 mt-1">First and last record</p>
          </GlassCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
            <AreaChart />
          </GlassCard>

          <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl">
            <CrimeChart />
          </GlassCard>

          <GlassCard className="p-6 border border-white/10 shadow-xl rounded-2xl lg:col-span-2">
            <SeverityChart />
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Analytics;
