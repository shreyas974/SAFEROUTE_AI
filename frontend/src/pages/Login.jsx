import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import GlassButton from "../components/common/GlassButton";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container min-h-screen flex items-center justify-center py-12">
        <GlassCard className="p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
          <p className="text-center text-[color:var(--text-secondary)] mb-8">
            Log in to continue to SafeRoute AI.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white/60"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white/60"
                placeholder="••••••••"
              />
            </div>
            <GlassButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </GlassButton>
          </form>

          <p className="text-center text-sm text-[color:var(--text-secondary)] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[color:var(--primary)] font-medium">
              Sign up
            </Link>
          </p>
        </GlassCard>
      </main>
      <Footer />
    </>
  );
}

export default Login;
