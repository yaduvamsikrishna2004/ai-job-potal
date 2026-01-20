import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function Recommendations() {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

  // Load uploaded resumes from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("my_resumes") || "[]");
    setResumes(saved);

    const last = localStorage.getItem("last_resume_id");
    if (last) setResumeId(last);
  }, []);

  const handleRecommend = async () => {
    if (!resumeId) {
      setAlert("Please select a resume.");
      return;
    }

    setLoading(true);
    setAlert("");
    setRecommendations([]);

    try {
      const data = await apiFetch("/candidate/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, top_n: 10 }),
      });

      setRecommendations(data.recommendations || []);
    } catch (err) {
      setAlert(err.body?.error || "Failed to get recommendations.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Job Recommendations
      </h1>

      {/* Resume Selector */}
      <div className="bg-white p-6 rounded-xl shadow w-full lg:w-2/3">
        <label className="block font-semibold mb-2">
          Select Resume
        </label>

        <select
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select resume --</option>
          {resumes.map((r, i) => (
            <option key={i} value={r.resume_id}>
              {r.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleRecommend}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>

        {alert && (
          <div className="mt-3 bg-red-100 text-red-700 p-2 rounded">
            {alert}
          </div>
        )}
      </div>

      {/* Recommendation Results */}
      <div className="space-y-4">
        {recommendations.length === 0 && !loading && (
          <p className="text-gray-500">No recommendations yet.</p>
        )}

        {recommendations.map((job) => (
          <div
            key={job.job_id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600 mt-2">{job.description}</p>

            <div className="mt-3 text-sm">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full mr-2">
                Score: {job.final_score ?? job.embedding_score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
