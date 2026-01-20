import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  // ------------------------------------------
  // Auto-redirect if already logged in
  // ------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate(
        role === "candidate"
          ? "/candidate/dashboard"
          : "/recruiter/dashboard",
        { replace: true }
      );
    }
  }, [navigate]);

  // ------------------------------------------
  // Handle Login
  // ------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect based on role
      navigate(
        data.role === "candidate"
          ? "/candidate/dashboard"
          : "/recruiter/dashboard"
      );
    } catch {
      setError("Server not reachable. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md space-y-5 border"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Login to AI Job Portal
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Find jobs smarter with AI
        </p>

        {/* Email */}
        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="border p-2 w-full rounded focus:ring focus:ring-blue-200 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="font-semibold block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white text-lg transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Error */}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
