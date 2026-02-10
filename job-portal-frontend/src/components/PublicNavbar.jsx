import { Link } from "react-router-dom";
import { useState } from "react";

export default function PublicNavbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobFit Engine
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6 relative">
          <Link to="/" className="hover:text-blue-600">
            Jobs
          </Link>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              className="hover:text-blue-600 flex items-center gap-1 focus:outline-none"
              onClick={() => setServicesOpen((v) => !v)}
              onBlur={() => setTimeout(() => setServicesOpen(false), 150)}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services
              <span className="ml-1">▼</span>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                <Link
                  to="/services/resume-screening"
                  className="block px-4 py-2 hover:bg-blue-50 text-gray-700"
                  onClick={() => setServicesOpen(false)}
                >
                  Resume Screening
                </Link>
                <Link
                  to="/services/job-recommendation"
                  className="block px-4 py-2 hover:bg-blue-50 text-gray-700"
                  onClick={() => setServicesOpen(false)}
                >
                  Job Recommendation
                </Link>
              </div>
            )}
          </div>

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
