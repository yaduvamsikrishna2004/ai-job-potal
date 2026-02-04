// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen for role/token changes in localStorage (for demo/testing)
  // Ensures navbar updates instantly on role switch
  useEffect(() => {
    const onStorage = () => {
      setRole(localStorage.getItem("role"));
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
          <span className={`px-3 py-1 text-sm rounded-full capitalize font-semibold ${role === "recruiter" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {role}
          </span>
          {/* AVATAR */}
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-bold border-2 border-blue-200 hover:border-blue-400 transition"
          >
            {avatarLetter}
          </div>
          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white border rounded-lg shadow-lg z-50 animate-fade-in">
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
                    onClick={() => setOpen(false)}
                  >
                    Upload Resume
                  </Link>
                  <Link
                    to="/candidate/recommend"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Recommendations
                  </Link>
                  <Link
                    to="/candidate/applications"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    My Applications
                  </Link>
                </>
              )}
              {role === "recruiter" && (
                <>
                  <Link
                    to="/recruiter/post-job"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Post Job
                  </Link>
                  <Link
                    to="/recruiter/screen"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Screen Candidates
                  </Link>
                  <Link
                    to="/recruiter/bulk-upload"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Bulk Resume Upload
                  </Link>
                </>
              )}
              <hr className="my-1" />
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
