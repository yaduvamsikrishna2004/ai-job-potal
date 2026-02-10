// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dot = ({ active, tone }) => (
  <span
    className={`h-2 w-2 rounded-full ${
      active ? (tone === "recruiter" ? "bg-purple-600" : "bg-blue-600") : "bg-slate-300"
    }`}
  />
);

export default function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role") || "candidate");

  // Listen for role changes in localStorage (for demo/testing)
  useEffect(() => {
    const onStorage = () => {
      const savedRole = localStorage.getItem("role") || "candidate";
      setRole(savedRole);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Demo: allow switching roles in sidebar (for portfolio/demo only)
  const handleRoleSwitch = (newRole) => {
    localStorage.setItem("role", newRole);
    setRole(newRole);
    if (newRole === "candidate") navigate("/candidate/dashboard");
    else navigate("/recruiter/dashboard");
  };

  const linkStyle = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-900 text-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.9)]"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-72 bg-white/90 backdrop-blur border-r border-slate-200/60 min-h-screen p-5 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.55)] flex flex-col justify-between">
      <div>
        <div
          className={`rounded-2xl px-4 py-4 text-white shadow-[0_18px_35px_-18px_rgba(37,99,235,0.75)] ${
            role === "recruiter"
              ? "bg-gradient-to-br from-purple-600 to-fuchsia-500 shadow-[0_18px_35px_-18px_rgba(147,51,234,0.7)]"
              : "bg-gradient-to-br from-blue-600 to-sky-500"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">
            JobFit Engine
          </p>
          <h2 className="mt-1 text-xl font-semibold">Talent Workspace</h2>
          <p className="text-xs text-white/80 mt-1">
            Find, match, and hire with clarity.
          </p>
        </div>

        <div className="mt-6 text-xs uppercase tracking-widest text-slate-400">
          {role === "candidate" ? "Candidate" : "Recruiter"}
        </div>

        <nav className="mt-3 flex flex-col gap-2">
          {role === "candidate" && (
            <>
              <NavLink to="/candidate/dashboard" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="candidate" />
                    Dashboard
                  </>
                )}
              </NavLink>
              <NavLink to="/candidate/upload" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="candidate" />
                    Upload Resume
                  </>
                )}
              </NavLink>
              <NavLink to="/candidate/recommend" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="candidate" />
                    Recommendations
                  </>
                )}
              </NavLink>
              <NavLink to="/candidate/applications" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="candidate" />
                    My Applications
                  </>
                )}
              </NavLink>
            </>
          )}
          {role === "recruiter" && (
            <>
              <NavLink to="/recruiter/dashboard" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="recruiter" />
                    Dashboard
                  </>
                )}
              </NavLink>
              <NavLink to="/recruiter/post-job" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="recruiter" />
                    Post Job
                  </>
                )}
              </NavLink>
              <NavLink to="/recruiter/screen" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="recruiter" />
                    Screen Candidates
                  </>
                )}
              </NavLink>
              <NavLink to="/recruiter/bulk-upload" className={linkStyle}>
                {({ isActive }) => (
                  <>
                    <Dot active={isActive} tone="recruiter" />
                    Bulk Resume Upload
                  </>
                )}
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="mt-8">
        <div className="panel-soft px-3 py-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Switch Role</span>
            <span className="chip bg-slate-900 text-white">Demo</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                role === "candidate"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => handleRoleSwitch("candidate")}
            >
              Candidate
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                role === "recruiter"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => handleRoleSwitch("recruiter")}
            >
              Recruiter
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
