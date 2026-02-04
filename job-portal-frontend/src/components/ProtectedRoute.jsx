// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

/**
 * Retrieves token from localStorage or sessionStorage.
 */
function getToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
}

/**
 * ProtectedRoute
 * - Ensures user is authenticated
 * - Optionally validates allowed roles
 *
 * @param {string[]} roles - Array of allowed roles ["candidate", "recruiter"]
 * @param {string} redirectTo - Path to redirect if unauthorized
 */
export default function ProtectedRoute({
  roles = [],
  role,
  redirectTo = "/login",
  children,
}) {
  const token = getToken();
  const userRole = localStorage.getItem("role");
  const allowedRoles = roles.length > 0 ? roles : role ? [role] : [];

  // No authentication token
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  // If route restricts roles → validate role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Access granted
  if (children) return children;
  return <Outlet />;
}
