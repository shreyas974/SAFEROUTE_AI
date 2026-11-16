import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";
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
              SafeRoute AI compares the fastest route with a lower-risk one on Bengaluru's real road network,
              and shows the trade-off. The incident data is a synthetic demo set, not police records.
            </p>

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
                <Link to="/analytics" className="hover:text-blue-400 transition">Demo data analytics</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">How it works</Link>
              </li>
            </ul>
          </div>

          {/* Enterprise & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Built with</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-blue-400" />
                Optional Firebase accounts
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-cyan-400" />
                DBSCAN Hotspot Clustering
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={16} className="text-emerald-400" />
                OpenStreetMap road graph
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SafeRoute AI</p>
          <div className="flex items-center gap-6">
            <Link to="/about#privacy" className="text-slate-300 hover:text-white transition">Privacy</Link>
            <Link to="/about#data" className="text-slate-300 hover:text-white transition">About the data</Link>
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