import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import GlassButton from "../components/common/GlassButton";
import { signup } from "../services/authService";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(name, email, password);
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
          <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-center text-[color:var(--text-secondary)] mb-8">
            Join SafeRoute AI and travel with confidence.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white/60"
                placeholder="Your name"
              />
            </div>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white/60"
                placeholder="At least 6 characters"
              />
            </div>
            <GlassButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </GlassButton>
          </form>

          <p className="text-center text-sm text-[color:var(--text-secondary)] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[color:var(--primary)] font-medium">
              Log in
            </Link>
          </p>
        </GlassCard>
      </main>
      <Footer />
    </>
  );
}

export default Signup;
