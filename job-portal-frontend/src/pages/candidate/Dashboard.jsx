// src/pages/candidate/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function CandidateDashboard() {
  const [resumeCount, setResumeCount] = useState(0);
  const [recommendations, setRecommendations] = useState(0);
  const [latestResumes, setLatestResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState(0);
  const [error, setError] = useState("");

  // Load from localStorage (mock for now)
  useEffect(() => {
    setLoading(true);
    setError("");
    const resumes = JSON.parse(localStorage.getItem("my_resumes") || "[]");
    setResumeCount(resumes.length);
    setLatestResumes(resumes.slice(-2));
    setRecommendations(Number(localStorage.getItem("recommendation_count")) || 0);
    // Fetch applications count from backend
    apiFetch("/candidate/applications")
      .then((data) => {
        setApplications((data.applications || []).length);
      })
      .catch(() => setApplications(0))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* ================= PAGE HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Candidate Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your resumes and explore AI-powered job matches
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Uploaded Resumes", "Job Recommendations", "Applications Submitted"].map((label, idx) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">{label}</p>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2" />
            ) : (
              <p className="text-3xl font-bold mt-2">
                {idx === 0 ? resumeCount : idx === 1 ? recommendations : applications}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/candidate/upload"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            📄 Upload Resume
          </Link>
          <Link
            to="/candidate/recommend"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            🤖 View Recommendations
          </Link>
        </div>
      </div>

      {/* ================= RECENT RESUMES ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Resume Uploads</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-50 p-3 rounded">{error || "Failed to load resumes."}</div>
        ) : latestResumes.length === 0 ? (
          <div className="flex flex-col items-center text-gray-400 py-8">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span>No resumes uploaded yet.</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {latestResumes.map((res, index) => (
              <li key={index} className="flex justify-between items-center border-b pb-2">
                <span>{res.name}</span>
                <span className="text-sm text-gray-400">{res.uploadedAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
