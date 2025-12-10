import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function RecruiterDashboard() {
  const [jobCount, setJobCount] = useState(0);
  const [resumeCount, setResumeCount] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Fetch job count
      const jobs = await apiFetch("/recruiter/jobs");
      setJobCount(jobs.count || 0);
      setRecentJobs(jobs.jobs?.slice(0, 3) || []);

      // Count resumes
      const resumes = await apiFetch("/candidate/resumes");
      setResumeCount(resumes.count || 0);
    } catch (err) {
      console.log("Dashboard loading error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage job postings, screen candidates, and view analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-gray-500 text-sm">Total Jobs Posted</h3>
          <p className="text-3xl font-bold mt-2">{jobCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-gray-500 text-sm">Total Resumes Received</h3>
          <p className="text-3xl font-bold mt-2">{resumeCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-gray-500 text-sm">Pending Screening</h3>
          <p className="text-3xl font-bold mt-2">
            {resumeCount > 0 ? resumeCount : 0}
          </p>
        </div>
      </div>

      {/* Latest Jobs */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Job Posts</h2>

        {recentJobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.job_id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.description.slice(0, 120)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Experience: {job.experience_required} yrs
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-4">
        <a
          href="/recruiter/post-job"
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Post New Job
        </a>

        <a
          href="/recruiter/screen"
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          🔍 Screen Candidates
        </a>
      </div>
    </div>
  );
}
