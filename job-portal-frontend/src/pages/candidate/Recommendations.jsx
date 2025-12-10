// src/pages/candidate/Recommendations.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill resume_id if saved earlier
  useEffect(() => {
    const saved = localStorage.getItem("last_resume_id");
    if (saved) setResumeId(saved);
  }, []);

  const handleGetRecs = async () => {
    if (!resumeId.trim()) {
      alert("Please enter a Resume ID first.");
      return;
    }

    setLoading(true);
    setRecommendations([]);

    try {
      const response = await apiFetch("/candidate/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, top_n: 10 }),
      });

      setRecommendations(response.recommendations || []);
    } catch (err) {
      alert(err.body?.error || "Failed to fetch recommendations");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800">
        Job Recommendations
      </h1>

      {/* Resume Input */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4 w-full lg:w-2/3">
        <label className="block font-medium text-gray-700">
          Enter Resume ID (from upload)
        </label>

        <div className="flex gap-3">
          <input
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="e.g., 64b72f0cd8f2f0a998..."
          />

          <button
            onClick={handleGetRecs}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Loading…" : "Get Jobs"}
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-gray-600 animate-pulse">Fetching recommendations...</div>
        )}

        {!loading && recommendations.length === 0 && (
          <div className="text-gray-500">No recommendations yet.</div>
        )}

        {recommendations.map((job) => (
          <div
            key={job.job_id}
            className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
          >
            {/* Job Title */}
            <h2 className="text-xl font-bold text-gray-800">
              {job.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mt-1">{job.description}</p>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Score */}
            <div className="mt-4 text-sm text-gray-700">
              Match Score:{" "}
              <span className="font-bold">
                {job.final_score ?? job.embedding_score ?? job.tfidf_score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
