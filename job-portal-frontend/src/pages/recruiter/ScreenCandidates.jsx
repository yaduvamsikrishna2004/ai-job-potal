import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function ScreenCandidates() {
  const [jobId, setJobId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Load job list automatically
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await apiFetch("/recruiter/jobs", { method: "GET" });
        setJobs(data.jobs || []);
      } catch (err) {
        setAlert({ type: "error", message: "Failed to load job list" });
      }
    };
    loadJobs();
  }, []);

  // Screen candidates API call
  const handleScreen = async () => {
    if (!jobId) {
      setAlert({ type: "error", message: "Please select a job." });
      return;
    }

    setAlert({ type: "", message: "" });
    setLoading(true);

    try {
      const body = await apiFetch("/recruiter/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, top_n: 20 }),
      });

      setResults(body.ranked_candidates || []);

      if (!body.ranked_candidates || body.ranked_candidates.length === 0) {
        setAlert({
          type: "warning",
          message: "No resumes found for screening.",
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err.body?.error || "Screening failed.",
      });
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Screen Candidates</h2>

      {/* Alerts */}
      {alert.message && (
        <div
          className={`p-3 mb-4 rounded ${
            alert.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : alert.type === "warning"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Job Selector */}
      <div className="bg-white p-5 rounded shadow border mb-6 w-2/3">
        <label className="font-semibold block mb-1">Select Job</label>

        <select
          className="border p-2 rounded w-full"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        >
          <option value="">-- Select a job --</option>
          {jobs.map((job) => (
            <option key={job.job_id} value={job.job_id}>
              {job.title} ({job.job_id})
            </option>
          ))}
        </select>

        <button
          onClick={handleScreen}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Screening..." : "Start Screening"}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((r) => (
          <div
            key={r.resume_id}
            className="border bg-white p-5 rounded-lg shadow-sm"
          >
            <div className="font-semibold text-lg">
              Resume ID: {r.resume_id}
            </div>

            <div className="mt-2 flex gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Final Score: <strong>{r.final_score}</strong>
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                TF-IDF: {r.tfidf_score}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                Embedding: {r.embedding_score}
              </span>
            </div>
          </div>
        ))}

        {results.length === 0 && !loading && (
          <p className="text-gray-500">No candidates screened yet.</p>
        )}
      </div>
    </div>
  );
}
