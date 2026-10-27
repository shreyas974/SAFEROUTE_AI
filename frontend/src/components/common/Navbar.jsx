import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, User, LogOut, Bookmark, ShieldAlert,
  ChevronDown, ExternalLink, Sparkles
} from "lucide-react";
import SafeRouteLogo from "./SafeRouteLogo";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, savedRoutes } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    toast.success("Successfully logged out");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold tracking-wide transition-all duration-200 py-1 ${
      isActive
        ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400 after:rounded-full"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-3 pb-2 transition-all">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 sm:px-8 py-3.5 border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/60">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <SafeRouteLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={navLinkClass}>
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </li>
        </ul>

        {/* Right Action / Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition active:scale-95"
          >
            <Sparkles size={14} className="animate-pulse" />
            Find Route
          </button>

          {user ? (
            /* Logged in User Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-7 h-7 rounded-full object-cover border border-blue-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {(user.displayName || user.email || "U")[0]}
                  </div>
                )}
                <span className="max-w-[120px] truncate text-slate-200">
                  {user.displayName || user.email.split("@")[0]}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-bold text-white truncate">{user.displayName || "Account"}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    {user.emergencyContact && (
                      <p className="mt-1 text-[11px] text-cyan-400 font-mono truncate">
                        SOS: {user.emergencyContact}
                      </p>
                    )}
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition"
                    >
                      <Bookmark size={15} className="text-blue-400" />
                      <span>Saved Routes ({savedRoutes?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/about");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition"
                    >
                      <ShieldAlert size={15} className="text-cyan-400" />
                      <span>Safety Guidelines</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/15 rounded-xl transition"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out: Sign in / Sign up */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl glass p-5 border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/90 animate-in fade-in slide-in-from-top-4 duration-200">
          <ul className="space-y-3 pb-4 border-b border-white/10">
            <li>
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-200 hover:text-blue-400"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-200 hover:text-blue-400"
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-200 hover:text-blue-400"
              >
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-200 hover:text-blue-400"
              >
                About
              </NavLink>
            </li>
          </ul>

          <div className="pt-4 flex flex-col gap-2.5">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {(user.displayName || user.email || "U")[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;