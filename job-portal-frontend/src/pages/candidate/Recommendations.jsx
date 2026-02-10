
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function Recommendations() {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [applying, setApplying] = useState("");
  const [appliedJobs, setAppliedJobs] = useState({});

  // Load uploaded resumes from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("my_resumes") || "[]");
    setResumes(saved);

    const last = localStorage.getItem("last_resume_id");
    if (last) setResumeId(last);
    // Fetch applied jobs for this candidate
    (async () => {
      try {
        const data = await apiFetch("/candidate/applications");
        // Map job_id to true for quick lookup
        const applied = {};
        (data.applications || []).forEach((a) => {
          applied[a.job_id] = true;
        });
        setAppliedJobs(applied);
      } catch {
        // fail silently, will just not show applied state
      }
    })();
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

  const handleApply = async (job) => {
    if (appliedJobs[job.job_id]) return;
    setApplying(job.job_id);
    setAlert("");
    try {
      await apiFetch("/candidate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.job_id, resume_id: resumeId }),
      });
      setAppliedJobs((prev) => ({ ...prev, [job.job_id]: true }));
    } catch (err) {
      setAlert(err.body?.error || "Failed to apply for job.");
    }
    setApplying("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Job Recommendations</h1>
        <p className="section-subtitle mt-2">
          Pick a resume to get ranked roles that fit your profile.
        </p>
      </div>

      {/* Resume Selector */}
      <div className="panel p-6 w-full lg:w-2/3">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Select Resume
        </label>

        <select
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          className={`mt-4 ${loading ? "btn-outline" : "btn-primary"}`}
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
            className="panel p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h3 className="text-xl font-bold">{job.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills && job.skills.map((skill, i) => (
                  <span key={i} className="chip bg-slate-100 text-slate-700">{skill}</span>
                ))}
              </div>
              <p className="text-gray-600 mt-2">{job.description}</p>
              <div className="mt-3 text-sm">
                <span className="chip bg-blue-100 text-blue-700 mr-2">
                  Score: {job.final_score ?? job.embedding_score}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 min-w-[120px]">
              {appliedJobs[job.job_id] ? (
                <span className="chip bg-blue-100 text-blue-700 text-sm">Applied</span>
              ) : (
                <button
                  onClick={() => handleApply(job)}
                  disabled={!!applying || applying === job.job_id}
                  className={`${applying === job.job_id ? "btn-outline" : "btn-primary"}`}
                >
                  {applying === job.job_id ? "Applying..." : "Apply"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
