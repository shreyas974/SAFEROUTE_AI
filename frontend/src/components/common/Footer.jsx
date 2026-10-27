import { Link } from "react-router-dom";
import { ShieldCheck, Heart, Mail } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import SafeRouteLogo from "./SafeRouteLogo";

function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/80 backdrop-blur-xl text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <SafeRouteLogo size="md" />
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              SafeRoute AI is an enterprise-grade urban safety intelligence platform. 
              We utilize machine learning, DBSCAN crime clustering, and real-time transit telemetry 
              to safeguard urban citizens and night commuters across Bengaluru.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Vercel Edge & Firebase Cloud Operational (99.98% Uptime)</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Home Overview</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition">Navigation Dashboard</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-blue-400 transition">Crime Analytics & Charts</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">AI Architecture & About</Link>
              </li>
            </ul>
          </div>

          {/* Enterprise & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Security & API</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-blue-400" />
                Firebase Auth & Storage
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-cyan-400" />
                DBSCAN Hotspot Clustering
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-emerald-400" />
                OpenStreetMap Geocoding
              </li>
              <li className="text-xs text-slate-500 pt-1">
                Bengaluru Police FIR Dataset Integration
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SafeRoute AI Enterprise. Built for safer cities.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Terms of Service</span>
            <a
              href="https://github.com/shreyas974/SAFEROUTE_AI"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <FaGithub size={14} />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;