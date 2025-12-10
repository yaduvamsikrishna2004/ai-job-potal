// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (body.token) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("role", body.role || role);

        navigate(
          role === "candidate"
            ? "/candidate/dashboard"
            : "/recruiter/dashboard"
        );
      } else {
        navigate("/login");
      }
    } catch (e) {
      setError(e.body?.error || e.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-lg w-full max-w-md space-y-5 border"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Create Your Account
        </h2>

        {/* Name */}
        <div>
          <label className="font-semibold block mb-1">Full Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="border p-2 w-full rounded focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold block mb-1">Email Address</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border p-2 w-full rounded focus:ring focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Password with visibility toggle */}
        <div>
          <label className="font-semibold block mb-1">Password</label>
          <div className="relative">
            <input
              required
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              className="border p-2 w-full rounded focus:ring focus:ring-blue-200 outline-none"
            />

            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="font-semibold block mb-1">Register As</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full focus:ring focus:ring-blue-200 outline-none"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white text-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Error Display */}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-300 p-2 rounded text-center">
            {error}
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
