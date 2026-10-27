import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import AreaChart from "../components/dashboard/AreaChart";
import CrimeChart from "../components/dashboard/CrimeChart";
import SeverityChart from "../components/dashboard/SeverityChart";
import { BarChart3, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";

function Analytics() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-12 flex-1">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <BarChart3 size={14} className="text-cyan-400" />
            <span>Bengaluru City Crime Intelligence Dataset</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Crime Analytics & Risk Patterns
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Historical FIR dataset analysis across 19 Bengaluru zones. Understand risk distributions,
            time patterns, and severity clusters to choose safer transit corridors.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Incidents</span>
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <BarChart3 size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">6,193</p>
            <p className="text-xs text-slate-400 mt-1">Verified Police FIR Records</p>
          </GlassCard>

          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Risk Clusters</span>
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                <AlertTriangle size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-rose-400">15</p>
            <p className="text-xs text-slate-400 mt-1">DBSCAN Detected Hotspots</p>
          </GlassCard>

          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Areas Monitored</span>
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                <MapPin size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-cyan-300">19</p>
            <p className="text-xs text-slate-400 mt-1">Metro Police Jurisdictions</p>
          </GlassCard>

          <GlassCard className="p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Safe Route Ratio</span>
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <ShieldCheck size={18} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">98.4%</p>
            <p className="text-xs text-slate-400 mt-1">Risk Avoidance Efficiency</p>
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
