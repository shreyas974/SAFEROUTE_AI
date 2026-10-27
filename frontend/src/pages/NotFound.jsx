import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import { Compass, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <GlassCard className="max-w-md w-full p-10 text-center border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/70 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-6">
            <Compass size={32} className="animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-200 mb-3">Route Not Found</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            The page or navigation corridor you are looking for does not exist or has been relocated.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Return to Safe Navigation</span>
          </Link>
        </GlassCard>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;