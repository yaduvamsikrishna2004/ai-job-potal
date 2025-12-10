// src/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "guest";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const getPageTitle = () => {
    if (location.pathname.includes("candidate")) return "Candidate Dashboard";
    if (location.pathname.includes("recruiter")) return "Recruiter Dashboard";
    return "Dashboard";
  };

  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        {getPageTitle()}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            role === "recruiter"
              ? "bg-purple-100 text-purple-700"
              : role === "candidate"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {role.toUpperCase()}
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
