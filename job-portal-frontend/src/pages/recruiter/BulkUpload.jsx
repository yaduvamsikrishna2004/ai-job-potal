
import { useState } from "react";
import { apiFetch } from "../../utils/api";

export default function BulkUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

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
    setUploading(true);
    setResults([]);
    setError("");
    const newResults = [];
    for (const file of files) {
      const formData = new FormData();
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold mb-6">Bulk Resume Upload</h2>
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="border p-3 w-full rounded"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded-lg text-white ${uploading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
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
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Uploaded ✓</span>
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
