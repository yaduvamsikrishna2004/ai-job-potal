import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          AI Job Portal
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">
            Jobs
          </Link>

          <Link to="/" className="hover:text-blue-600">
            Services
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
