
import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

export default function UploadResume() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumes, setResumes] = useState([]);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");

  // Load previously uploaded resumes (local cache)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("my_resumes") || "[]");
    setResumes(saved);
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setMessage("");
  };

  const handleClear = () => {
    setFiles([]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one resume.");
      return;
    }
    setUploading(true);
    setMessage("");
    setError("");
    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("resume", file);
      try {
        const data = await apiFetch("/candidate/upload-resume", {
          method: "POST",
          body: formData,
        });
        const resumeObj = {
          name: file.name,
          resume_id: data.resume_id,
          uploadedAt: new Date().toISOString().split("T")[0],
        };
        uploaded.push(resumeObj);
        localStorage.setItem("last_resume_id", data.resume_id);
      } catch (err) {
        setError(err.body?.error || "Network error during upload.");
      }
    }
    const updated = [...resumes, ...uploaded];
    setResumes(updated);
    localStorage.setItem("my_resumes", JSON.stringify(updated));
    setFiles([]);
    setUploading(false);
    setMessage("Resume(s) uploaded successfully!");
  };

  const handleDelete = async (resume) => {
    if (!window.confirm(`Delete resume '${resume.name}'?`)) return;
    setDeleting(resume.resume_id);
    setError("");
    try {
      await apiFetch(`/candidate/delete-resume/${resume.resume_id}`, {
        method: "DELETE",
      });
      const updated = resumes.filter((r) => r.resume_id !== resume.resume_id);
      setResumes(updated);
      localStorage.setItem("my_resumes", JSON.stringify(updated));
      setMessage("Resume deleted.");
    } catch (err) {
      setError(err.body?.error || "Failed to delete resume.");
    }
    setDeleting("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Upload Resumes</h1>
        <p className="section-subtitle mt-2">
          Keep your resume library up to date for smarter recommendations.
        </p>
      </div>

      {/* Upload Card */}
      <div className="panel p-6 w-full lg:w-2/3 space-y-5">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm"
        />

        {files.length > 0 && (
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`${uploading ? "btn-outline" : "btn-primary"}`}
          >
            {uploading ? "Uploading..." : "Upload Resume(s)"}
          </button>

          <button
            onClick={handleClear}
            className="btn-outline"
          >
            Clear
          </button>
        </div>

        {message && (
          <div className="bg-blue-100 text-blue-700 border border-blue-300 p-3 rounded-lg">
            {message}
          </div>
        )}
      </div>

      {/* Uploaded Resume List */}
      <div className="panel p-6 w-full lg:w-2/3">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">My Uploaded Resumes</h2>
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded mb-2">{error}</div>
        )}
        {resumes.length === 0 ? (
          <p className="text-gray-500">No resumes uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {resumes.map((r, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b border-slate-200/70 pb-2"
              >
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-gray-500">
                    Resume ID: {r.resume_id}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-400">{r.uploadedAt}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(r.resume_id)}
                    className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Copy ID
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
                    disabled={deleting === r.resume_id}
                    className={`text-sm px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 ${deleting === r.resume_id ? "opacity-60" : ""}`}
                  >
                    {deleting === r.resume_id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
