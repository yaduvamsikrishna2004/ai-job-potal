
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function ScreenCandidates() {
  const [jobId, setJobId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [sortDesc, setSortDesc] = useState(true);

  // Load job list automatically
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/recruiter/jobs", { method: "GET" });
        setJobs(data.jobs || []);
      } catch (err) {
        setAlert({ type: "error", message: err.body?.error || "Failed to load job list" });
      }
      setLoading(false);
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
      let ranked = body.ranked_candidates || [];
      ranked = ranked.map((c, i) => ({ ...c, _idx: i }));
      setResults(ranked);
      if (!ranked.length) {
        setAlert({ type: "warning", message: "No resumes found for screening." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.body?.error || "Screening failed." });
    }
    setLoading(false);
  };

  // Sorting
  const sortedResults = [...results].sort((a, b) => {
    if (sortDesc) return (b.score ?? 0) - (a.score ?? 0) || a._idx - b._idx;
    return (a.score ?? 0) - (b.score ?? 0) || a._idx - b._idx;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Screen Candidates</h2>
        <p className="section-subtitle mt-2">
          Rank applicants using AI similarity scores and skill overlap.
        </p>
      </div>
      {/* Alerts */}
      {alert.message && (
        <div
          className={`p-3 mb-4 rounded ${
            alert.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : alert.type === "warning"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
              : "bg-purple-100 text-purple-700 border border-purple-300"
          }`}
        >
          {alert.message}
        </div>
      )}
      {/* Job Selector */}
      <div className="panel p-6">
        <label className="text-sm font-semibold text-slate-700">Select Job</label>
        {loading ? (
          <div className="text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-gray-500">No jobs found.</div>
        ) : (
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">-- Select job --</option>
            {jobs.map((job) => (
              <option key={job.job_id} value={job.job_id}>
                {job.title}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleScreen}
          disabled={loading || !jobId}
          className={`mt-4 ${loading ? "btn-outline" : "btn-purple"}`}
        >
          {loading ? "Screening..." : "Screen Candidates"}
        </button>
      </div>
      {/* Results */}
      <div className="panel p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900">Results</h3>
          {results.length > 0 && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => setSortDesc((s) => !s)}
            >
              Sort: {sortDesc ? "High → Low" : "Low → High"}
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : results.length === 0 ? (
          <div className="text-gray-500">No candidates screened yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-slate-500">
                <th className="text-left py-2">Resume / Candidate</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Rank</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((c, i) => (
                <tr key={i} className="border-b border-slate-200/60">
                  <td className="py-2">{c.candidate_email || c.resume_id || c.candidate_id || "-"}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-3 rounded ${
                            c.score >= 80 ? "bg-purple-500" : c.score >= 50 ? "bg-yellow-400" : "bg-red-400"}
                          }`}
                          style={{ width: `${Math.round(c.score ?? 0)}%` }}
                        ></div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          c.score >= 80
                            ? "bg-purple-100 text-purple-700"
                            : c.score >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {Math.round(c.score ?? 0)}
                      </span>
                    </div>
                  </td>
                  <td className="py-1">{i + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
