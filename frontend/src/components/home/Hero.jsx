import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";
import { useNavigate } from "react-router-dom";
import { Navigation, ArrowRight, ShieldCheck, Sparkles, MapPin } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 flex min-h-[80vh] items-center justify-center relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

      <GlassCard className="max-w-4xl p-8 sm:p-14 text-center fade-up border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/60 rounded-3xl relative z-10">
        {/* Company Enterprise Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span>Enterprise AI Urban Safety & Navigation Engine</span>
        </div>

        <h1 className="mb-6 text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
          Navigate Smarter. <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Travel Safer.
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
          SafeRoute AI empowers daily commuters, women travelers, and night shift workers 
          with predictive crime risk analytics, DBSCAN hotspot avoidance, and dynamic safe corridor routing.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/30 transition active:scale-95"
          >
            <Navigation size={18} />
            <span>Launch Safe Navigation</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition"
          >
            <MapPin size={18} className="text-cyan-400" />
            <span>Explore Crime Heatmaps</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>98.4% Safety Corridor Rating</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span>19 Bengaluru Metro Zones</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-blue-400 shrink-0" />
            <span>Firebase Cloud Storage Sync</span>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

export default Hero;