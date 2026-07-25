import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-7xl font-bold mb-4">404</h1>

      <p className="mb-6">
        Page not found.
      </p>

      <Link
        to="/"
        className="glass-btn"
      >
        Back Home
      </Link>
    </main>
  );
}

export default NotFound;