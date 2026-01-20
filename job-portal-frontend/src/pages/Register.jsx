import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

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
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || role);

      // Redirect
      navigate(
        role === "candidate"
          ? "/candidate/dashboard"
          : "/recruiter/dashboard"
      );
    } catch (err) {
      setError("Network error. Please try again.");
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
          Create Account
        </h2>

        {/* Name */}
        <div>
          <label className="font-semibold block mb-1">Full Name</label>
          <input
            type="text"
            className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
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
            className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
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
            className="border p-2 w-full rounded focus:ring focus:ring-blue-200"
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
          className={`w-full py-2 rounded text-white text-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
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
