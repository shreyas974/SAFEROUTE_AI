import { useNavigate } from "react-router-dom";
import GlassCard from "../common/GlassCard";
import { Navigation, BarChart3, ArrowRight } from "lucide-react";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />
      
      <GlassCard className="p-10 sm:p-14 text-center border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/60 rounded-3xl relative z-10">
        <h2 className="mb-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ready to Travel Safer in Bengaluru?
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Experience intelligent route planning powered by AI, crime analytics,
          and real-time safety insights. Start your safer journey today.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/30 transition active:scale-95"
          >
            <Navigation size={18} />
            <span>Find Safe Route</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition"
          >
            <BarChart3 size={18} className="text-cyan-400" />
            <span>Explore Analytics</span>
          </button>
        </div>
      </GlassCard>
    </section>
  );
}

export default CTA;