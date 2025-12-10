// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  const linkStyle = ({ isActive }) =>
    `px-3 py-2 rounded text-sm font-medium 
     ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5 shadow-sm">
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
          </>
        )}
      </nav>
    </aside>
  );
}
