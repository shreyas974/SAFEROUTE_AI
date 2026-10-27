import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, Mail, Lock, Phone, Eye, EyeOff, 
  ArrowRight, ShieldCheck, AlertCircle 
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import SafeRouteLogo from "../components/common/SafeRouteLogo";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreeTerms) {
      setError("Please agree to the Safety Terms & Privacy Policy to proceed.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup(name, email, password, emergencyContact);
      toast.success("Account created successfully! Welcome to SafeRoute AI.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome to SafeRoute AI!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google signup was cancelled.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <GlassCard className="p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/70 rounded-3xl">
            {/* Header Brand */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <SafeRouteLogo size="lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Join SafeRoute AI and protect your daily urban travel.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs text-rose-300 animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full mb-5 flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wide transition shadow-sm active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest shrink-0">
                Or fill details
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    placeholder="Create secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Emergency Contact Number <span className="text-slate-500">(Optional SOS)</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className="text-[11px] text-slate-400 leading-snug">
                    I agree to SafeRoute AI's Terms of Service and acknowledge emergency location analytics.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold tracking-wide transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-5 pt-4 border-t border-white/10">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Sign In
              </Link>
            </p>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Signup;
