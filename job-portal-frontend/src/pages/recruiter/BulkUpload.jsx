
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function BulkUpload() {
  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await apiFetch("/recruiter/jobs");
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.body?.error || "Failed to load jobs");
      }
    };
    loadJobs();
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError("");
    setResults([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one resume.");
      return;
    }
    if (!jobId) {
      setError("Please select a job.");
      return;
    }
    setUploading(true);
    setResults([]);
    setError("");
    const newResults = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("resume", file);
      try {
        await apiFetch("/recruiter/bulk-upload", {
          method: "POST",
          body: formData,
        });
        newResults.push({ name: file.name, status: "success" });
      } catch (err) {
        newResults.push({ name: file.name, status: "error", message: err.body?.error || "Upload failed" });
      }
    }
    setResults(newResults);
    setUploading(false);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="section-title">Bulk Resume Upload</h2>
        <p className="section-subtitle mt-2">
          Upload multiple resumes and link them to a specific role.
        </p>
      </div>
      <div className="panel p-6 space-y-4">
        <select
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select a job to screen for</option>
          {jobs.map((job) => (
            <option key={job.job_id} value={job.job_id}>
              {job.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`${uploading ? "btn-outline" : "btn-purple"}`}
        >
          {uploading ? "Uploading..." : "Upload Resumes"}
        </button>
        {error && <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded">{error}</div>}
        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <span>{r.name}</span>
                {r.status === "success" ? (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Uploaded ✓</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Failed: {r.message}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
