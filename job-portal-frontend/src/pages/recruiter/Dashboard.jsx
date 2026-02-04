// src/pages/recruiter/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ jobsPosted: 0, resumesScreened: 0, activeJobs: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    apiFetch("/recruiter/jobs")
      .then((data) => {
        const jobs = data.jobs || [];
        setRecentJobs(jobs.slice(0, 5));
        setStats({
          jobsPosted: jobs.length,
          resumesScreened: jobs.reduce((acc, j) => acc + (j.screened_count || 0), 0),
          activeJobs: jobs.filter((j) => j.active !== false).length,
        });
      })
      .catch((err) => setError(err.body?.error || "Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        Recruiter Dashboard
      </h1>
      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Jobs Posted", "Resumes Screened", "Active Jobs"].map((label, idx) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 text-sm">{label}</h3>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2" />
            ) : (
              <p className="text-3xl font-bold mt-2">
                {idx === 0 ? stats.jobsPosted : idx === 1 ? stats.resumesScreened : stats.activeJobs}
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
            to="/recruiter/post-job"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
             Post New Job
          </Link>
          <Link            to="/recruiter/screen"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
             Screen Candidates
          </Link>
          <Link
            to="/recruiter/bulk-upload"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
             Bulk Resume Upload
          </Link>
        </div>
      </div>
      {/* ================= RECENT JOBS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-50 p-3 rounded">{error || "Failed to load jobs."}</div>
        ) : recentJobs.length === 0 ? (
          <div className="flex flex-col items-center text-gray-400 py-8">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span>No jobs posted yet.</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentJobs.map((job, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <span>{job.title}</span>
                <span className="text-sm text-gray-400">{job.posted_on || job.created_at || ""}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
