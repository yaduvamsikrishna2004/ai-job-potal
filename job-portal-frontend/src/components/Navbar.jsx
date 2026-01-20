// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!token) return null; // hide navbar on public pages

  const dashboardPath =
    role === "recruiter"
      ? "/recruiter/dashboard"
      : "/candidate/dashboard";

  const avatarLetter = role ? role[0].toUpperCase() : "U";

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link to={dashboardPath} className="text-2xl font-bold text-blue-600">
          AI Job Portal
        </Link>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center gap-4">

          {/* ROLE BADGE */}
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 capitalize">
            {role}
          </span>

          {/* AVATAR */}
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-bold"
          >
            {avatarLetter}
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg z-50">
              <Link
                to={dashboardPath}
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>

              {role === "candidate" && (
                <>
                  <Link
                    to="/candidate/upload"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Upload Resume
                  </Link>
                  <Link
                    to="/candidate/recommend"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Recommendations
                  </Link>
                </>
              )}

              {role === "recruiter" && (
                <>
                  <Link
                    to="/recruiter/post-job"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Post Job
                  </Link>
                  <Link
                    to="/recruiter/screen"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Screen Candidates
                  </Link>
                </>
              )}

              <hr />

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
