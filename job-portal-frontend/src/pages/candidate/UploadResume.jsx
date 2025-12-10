import { useState } from "react";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resumeId, setResumeId] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setMessage("");
    setResumeId("");
  };

  const handleClear = () => {
    setFile(null);
    setMessage("");
    setResumeId("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a resume first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Authentication error: Token missing.");
        setUploading(false);
        return;
      }

      const res = await fetch("http://127.0.0.1:5000/candidate/upload-resume", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Resume uploaded successfully!");
        setResumeId(data.resume_id);

        // Remember last resume ID for candidate recommendation page
        localStorage.setItem("last_resume_id", data.resume_id);
      } else {
        setMessage(data.error || "Upload failed.");
      }
    } catch (err) {
      setMessage("Network error during upload.");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Upload Resume</h1>

      <div className="bg-white p-6 w-full lg:w-2/3 rounded-xl shadow space-y-6">

        {/* File Selector */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Choose Resume (PDF / DOCX)
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="border p-3 w-full rounded"
          />
        </div>

        {/* Selected File Preview */}
        {file && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-gray-700">Selected File</h3>
            <p className="text-sm text-gray-600 mt-1">
              <strong>{file.name}</strong> — {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        )}

        {/* Upload / Clear Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>

        {/* Success or Error Message */}
        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Resume ID Box */}
        {resumeId && (
          <div className="mt-4 bg-blue-50 border border-blue-300 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Resume ID</h3>
            <p className="text-sm break-all mt-1 text-blue-800">{resumeId}</p>

            <button
              onClick={() => navigator.clipboard.writeText(resumeId)}
              className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Copy Resume ID
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
