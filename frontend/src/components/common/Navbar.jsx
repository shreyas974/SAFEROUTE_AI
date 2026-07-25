import { NavLink } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `transition-colors duration-300 ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-[color:var(--text-primary)] hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="glass mx-auto mt-4 flex w-[92%] max-w-7xl items-center justify-between rounded-2xl px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold">SafeRoute AI</h1>
        </div>

        {/* Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/analytics" className={linkClass}>
              Analytics
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </li>
        </ul>

        {/* CTA */}
        <button className="glass-btn hidden md:block">
          Find Route
        </button>
      </nav>
    </header>
  );
}

export default Navbar;