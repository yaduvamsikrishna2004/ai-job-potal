// src/pages/candidate/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
  const [resumeCount, setResumeCount] = useState(0);
  const [recommendations, setRecommendations] = useState(0);
  const [latestResumes, setLatestResumes] = useState([]);

  // 🔸 MOCK DATA (replace with API later)
  useEffect(() => {
    setResumeCount(2);
    setRecommendations(5);
    setLatestResumes([
      { name: "Resume_Jan2025.pdf", uploadedAt: "12 Jan 2025" },
      { name: "Resume_Project.pdf", uploadedAt: "03 Jan 2025" },
    ]);
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
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Uploaded Resumes</p>
          <p className="text-3xl font-bold mt-2">{resumeCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Job Recommendations</p>
          <p className="text-3xl font-bold mt-2">{recommendations}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Applications Submitted</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
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

        {latestResumes.length === 0 ? (
          <p className="text-gray-500">No resumes uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {latestResumes.map((res, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{res.name}</span>
                <span className="text-sm text-gray-500">
                  {res.uploadedAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
