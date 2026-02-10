import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      const data = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect based on role
      navigate(
        data.role === "candidate"
          ? "/candidate/dashboard"
          : "/recruiter/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError(err.body?.error || "Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100" />
      <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <form
        onSubmit={handleSubmit}
        className="panel p-8 w-full max-w-md space-y-5"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Login to JobFit Engine
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Find jobs smarter with AI
        </p>

        {/* Email */}
        <div>
          <label className="font-semibold block mb-1 text-slate-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="border border-slate-200 p-2 w-full rounded-lg focus:ring focus:ring-blue-200 outline-none bg-white/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="font-semibold block mb-1 text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              className="border border-slate-200 p-2 w-full rounded-lg focus:ring focus:ring-blue-200 outline-none bg-white/80"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 text-xs font-semibold"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white text-lg transition ${
            loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600"
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
