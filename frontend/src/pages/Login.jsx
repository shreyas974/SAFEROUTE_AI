import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle 
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import SafeRouteLogo from "../components/common/SafeRouteLogo";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginAsDemo, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to SafeRoute AI!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google sign-in was interrupted.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    try {
      await loginAsDemo();
      toast.success("Logged in as Enterprise Safety Lead!");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      toast.success("Reset link sent! Please check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Ambient background glow circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <GlassCard className="p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/70 rounded-3xl">
            {/* Header Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <SafeRouteLogo size="lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enterprise Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Access AI crime analytics, safety heatmaps, and routing.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs text-rose-300 animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Social / Demo One-Click Sign In */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wide transition shadow-sm active:scale-[0.99]"
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
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold tracking-wide transition shadow-sm active:scale-[0.99]"
              >
                <Sparkles size={14} className="text-cyan-400" />
                One-Click Demo Account (Instant Access)
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest shrink-0">
                Or with email
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Corporate / Personal Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="••••••••"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className="text-xs text-slate-400">Remember on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold tracking-wide transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <p className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-white/10">
              Don't have an enterprise account?{" "}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Create Account
              </Link>
            </p>
          </GlassCard>
        </div>

        {/* Forgot Password Modal */}
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl glass p-6 border border-white/15 bg-slate-900 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your registered email and we'll send a Firebase password recovery link.
              </p>

              {resetSent ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-3">
                  <p>Reset link sent! Please check your spam/inbox folders.</p>
                  <button
                    onClick={() => {
                      setForgotModalOpen(false);
                      setResetSent(false);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                    >
                      Send Reset Email
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Login;
