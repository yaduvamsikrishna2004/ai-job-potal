// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    `px-3 py-2 rounded text-sm font-medium 
     ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Job Portal</h2>
        <nav className="flex flex-col gap-2">
          {/* Candidate Menu */}
          {role === "candidate" && (
            <>
              <NavLink to="/candidate/dashboard" className={linkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/candidate/upload" className={linkStyle}>
                Upload Resume
              </NavLink>
              <NavLink to="/candidate/recommend" className={linkStyle}>
                Recommendations
              </NavLink>
              <NavLink to="/candidate/applications" className={linkStyle}>
                My Applications
              </NavLink>
            </>
          )}
          {/* Recruiter Menu */}
          {role === "recruiter" && (
            <>
              <NavLink to="/recruiter/dashboard" className={linkStyle}>
                Dashboard
              </NavLink>
              <NavLink to="/recruiter/post-job" className={linkStyle}>
                Post Job
              </NavLink>
              <NavLink to="/recruiter/screen" className={linkStyle}>
                Screen Candidates
              </NavLink>
              <NavLink to="/recruiter/bulk-upload" className={linkStyle}>
                Bulk Resume Upload
              </NavLink>
            </>
          )}
        </nav>
      </div>
      {/* Role Switcher for demo/portfolio */}
      <div className="mt-8">
        <div className="flex gap-2 items-center justify-center">
          <span className="text-xs text-gray-400">Switch Role:</span>
          <button
            className={`px-2 py-1 rounded text-xs font-semibold ${role === "candidate" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
            onClick={() => handleRoleSwitch("candidate")}
          >
            Candidate
          </button>
          <button
            className={`px-2 py-1 rounded text-xs font-semibold ${role === "recruiter" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            onClick={() => handleRoleSwitch("recruiter")}
          >
            Recruiter
          </button>
        </div>
      </div>
    </aside>
  );
}
