import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      // Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || role);

      // Redirect
      navigate(
        (data.role || role) === "candidate"
          ? "/candidate/dashboard"
          : "/recruiter/dashboard"
      );
    } catch (err) {
      setError(err.body?.error || "Registration failed");
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
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Create Account
        </h2>

        {/* Name */}
        <div>
          <label className="font-semibold block mb-1">Full Name</label>
          <input
            type="text"
            className="border border-slate-200 p-2 w-full rounded-lg focus:ring focus:ring-blue-200 bg-white/80"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            className="border border-slate-200 p-2 w-full rounded-lg focus:ring focus:ring-blue-200 bg-white/80"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="font-semibold block mb-1">Password</label>
          <input
            type="password"
            className="border border-slate-200 p-2 w-full rounded-lg focus:ring focus:ring-blue-200 bg-white/80"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="font-semibold block mb-2">Register as</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="candidate"
                checked={role === "candidate"}
                onChange={() => setRole("candidate")}
              />
              Candidate
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="recruiter"
                checked={role === "recruiter"}
                onChange={() => setRole("recruiter")}
              />
              Recruiter
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white text-lg ${
            loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600"
          }`}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Error */}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 p-2 rounded text-center">
            {error}
          </div>
        )}

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
