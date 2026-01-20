import { useState, useEffect } from "react";

export default function UploadResume() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumes, setResumes] = useState([]);

  const API_URL = "http://127.0.0.1:5000";

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

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication error: Token missing.");
      return;
    }

    setUploading(true);
    setMessage("");

    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("resume", file);

      try {
        const res = await fetch(`${API_URL}/candidate/upload-resume`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          const resumeObj = {
            name: file.name,
            resume_id: data.resume_id,
            uploadedAt: new Date().toISOString().split("T")[0],
          };

          uploaded.push(resumeObj);

          // Save last uploaded resume for recommendations
          localStorage.setItem("last_resume_id", data.resume_id);
        }
      } catch {
        setMessage("Network error during upload.");
      }
    }

    const updated = [...resumes, ...uploaded];
    setResumes(updated);
    localStorage.setItem("my_resumes", JSON.stringify(updated));

    setFiles([]);
    setUploading(false);
    setMessage("Resume(s) uploaded successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Upload Resumes</h1>

      {/* Upload Card */}
      <div className="bg-white p-6 w-full lg:w-2/3 rounded-xl shadow space-y-5">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="border p-3 w-full rounded"
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
            className={`px-4 py-2 rounded-lg text-white ${
              uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Resume(s)"}
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        </div>

        {message && (
          <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-lg">
            {message}
          </div>
        )}
      </div>

      {/* Uploaded Resume List */}
      <div className="bg-white p-6 w-full lg:w-2/3 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">My Uploaded Resumes</h2>

        {resumes.length === 0 ? (
          <p className="text-gray-500">No resumes uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {resumes.map((r, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-gray-500">
                    Resume ID: {r.resume_id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="text-sm text-gray-400">{r.uploadedAt}</span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(r.resume_id)
                    }
                    className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Copy ID
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
