// src/pages/candidate/CandidateDashboard.jsx
import { useEffect, useState } from "react";

export default function CandidateDashboard() {
  const [resumeCount, setResumeCount] = useState(0);
  const [recommendations, setRecommendations] = useState(0);
  const [latestResumes, setLatestResumes] = useState([]);

  // TODO: Replace with actual API calls
  useEffect(() => {
    // Example mock data until backend is connected
    setResumeCount(2);
    setRecommendations(5);
    setLatestResumes([
      { name: "Resume_Jan2025.pdf", uploadedAt: "2025-01-12" },
      { name: "Resume_Project.pdf", uploadedAt: "2025-01-03" },
    ]);
  }, []);

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        Candidate Dashboard
      </h1>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Uploaded Resumes</h3>
          <p className="text-3xl font-bold mt-2">{resumeCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Job Recommendations</h3>
          <p className="text-3xl font-bold mt-2">{recommendations}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Applications Submitted</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

        <div className="flex gap-4">
          <a
            href="/candidate/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload Resume
          </a>

          <a
            href="/candidate/recommend"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Recommendations
          </a>
        </div>
      </div>

      {/* Recent Resume Uploads */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Resumes</h2>

        {latestResumes.length === 0 ? (
          <p className="text-gray-500">No resumes uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {latestResumes.map((res, index) => (
              <li
                key={index}
                className="flex justify-between border-b pb-2 text-gray-700"
              >
                <span>{res.name}</span>
                <span className="text-sm">{res.uploadedAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
