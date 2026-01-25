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
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Jobs Posted</h3>
          <p className="text-3xl font-bold mt-2">{loading ? "-" : stats.jobsPosted}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Resumes Screened</h3>
          <p className="text-3xl font-bold mt-2">{loading ? "-" : stats.resumesScreened}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Active Jobs</h3>
          <p className="text-3xl font-bold mt-2">{loading ? "-" : stats.activeJobs}</p>
        </div>
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
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recentJobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
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
