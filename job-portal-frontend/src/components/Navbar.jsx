// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onToggleSidebar }) {

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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden rounded-lg border border-slate-200 px-2.5 py-2 text-slate-600 hover:bg-slate-50"
            onClick={onToggleSidebar}
            type="button"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link to={dashboardPath} className="text-2xl font-semibold text-slate-900">
            JobFit Engine
          </Link>
          <span className="hidden md:inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Intelligence Suite
          </span>
        </div>
        {/* RIGHT SIDE */}
        <div className="relative flex items-center gap-4">
          {/* ROLE BADGE */}
          <span
            className={`chip capitalize ${
              role === "recruiter"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {role}
          </span>
          {/* AVATAR */}
          <div
            onClick={() => setOpen(!open)}
            className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center cursor-pointer font-bold border-2 border-white shadow-[0_10px_25px_-15px_rgba(15,23,42,0.6)]"
          >
            {avatarLetter}
          </div>
          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 top-12 w-60 panel p-2 z-50 animate-fade-in">
              <Link
                to={dashboardPath}
                className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              {role === "candidate" && (
                <>
                  <Link
                    to="/candidate/upload"
                    className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Upload Resume
                  </Link>
                  <Link
                    to="/candidate/recommend"
                    className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Recommendations
                  </Link>
                  <Link
                    to="/candidate/applications"
                    className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
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
                    className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Post Job
                  </Link>
                  <Link
                    to="/recruiter/screen"
                    className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Screen Candidates
                  </Link>
                  <Link
                    to="/recruiter/bulk-upload"
                    className="block rounded-lg px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Bulk Resume Upload
                  </Link>
                </>
              )}
              <hr className="my-2 border-slate-200" />
              <button
                onClick={logout}
                className="w-full rounded-lg text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
