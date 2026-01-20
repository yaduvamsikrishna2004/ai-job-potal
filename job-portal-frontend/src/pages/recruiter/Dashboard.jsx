// src/pages/recruiter/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    jobsPosted: 3,
    resumesScreened: 42,
    activeJobs: 2,
  });

  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    // Mock data (replace later with API)
    setRecentJobs([
      {
        id: "JOB001",
        title: "Python Backend Developer",
        applicants: 18,
        postedOn: "2025-01-10",
      },
      {
        id: "JOB002",
        title: "Frontend React Developer",
        applicants: 12,
        postedOn: "2025-01-08",
      },
      {
        id: "JOB003",
        title: "Data Analyst",
        applicants: 9,
        postedOn: "2025-01-05",
      },
    ]);
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
          <p className="text-3xl font-bold mt-2">{stats.jobsPosted}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Resumes Screened</h3>
          <p className="text-3xl font-bold mt-2">{stats.resumesScreened}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Active Jobs</h3>
          <p className="text-3xl font-bold mt-2">{stats.activeJobs}</p>
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
            ➕ Post New Job
          </Link>

          <Link
            to="/recruiter/screen"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📄 Screen Candidates
          </Link>
        </div>
      </div>

      {/* ================= RECENT JOBS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Job Posts</h2>

        {recentJobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2">Job Title</th>
                  <th className="py-2">Applicants</th>
                  <th className="py-2">Posted On</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} className="border-b">
                    <td className="py-3 font-medium">{job.title}</td>
                    <td className="py-3">{job.applicants}</td>
                    <td className="py-3">{job.postedOn}</td>
                    <td className="py-3">
                      <Link
                        to="/recruiter/screen"
                        className="text-blue-600 hover:underline"
                      >
                        Screen →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
