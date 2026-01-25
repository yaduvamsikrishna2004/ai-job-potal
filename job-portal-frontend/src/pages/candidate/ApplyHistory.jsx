import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function ApplyHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/candidate/applications");
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.body?.error || "Failed to load applications.");
      }
      setLoading(false);
    }
    fetchApps();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
      <div className="bg-white p-6 rounded-xl shadow w-full lg:w-2/3">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        ) : applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <ul className="space-y-3">
            {applications.map((app, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{app.job_title}</p>
                  <p className="text-sm text-gray-500">Applied: {app.applied_at}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Applied ✓</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
