
import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobError, setJobError] = useState("");
  // Load jobs for this recruiter
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setJobsLoading(true);
    setJobError("");
    try {
      const data = await apiFetch("/recruiter/jobs");
      setJobs(data.jobs || []);
    } catch (err) {
      setJobError(err.body?.error || "Failed to load jobs.");
    }
    setJobsLoading(false);
  };

  // Add skill when pressing Enter
  const handleAddSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillInput.trim() !== "") {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });

    // Auto-hide success alert
    if (type === "success") {
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      showAlert("error", "Job title and description are required.");
      return;
    }
    const payload = {
      title,
      description,
      skills,
      experience_required: Number(experience),
    };
    try {
      setLoading(true);
      showAlert("", "");
      await apiFetch("/recruiter/post-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showAlert("success", "Job posted successfully!");
      setTitle("");
      setDescription("");
      setSkills([]);
      setExperience("");
      fetchJobs();
    } catch (err) {
      showAlert("error", err.body?.error || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await apiFetch(`/recruiter/delete-job/${jobId}`, { method: "DELETE" });
      fetchJobs();
      showAlert("success", "Job deleted.");
    } catch (err) {
      showAlert("error", err.body?.error || "Failed to delete job.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div>
        <h2 className="text-3xl font-bold mb-6">Post a Job</h2>
        {/* Alerts */}
        {alert.message && (
          <div
            className={`p-3 mb-4 rounded-lg ${
              alert.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {alert.message}
          </div>
        )}
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md border space-y-5"
        >
          {/* Title */}
          <div>
            <label className="font-semibold">Job Title</label>
            <input
              type="text"
              className="border rounded p-2 w-full mt-1"
              placeholder="Senior Python Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* Description */}
          <div>
            <label className="font-semibold">Job Description</label>
            <textarea
              className="border rounded p-2 w-full mt-1"
              rows="4"
              placeholder="Explain responsibilities, required skills, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          {/* Skills with dynamic tags */}
          <div>
            <label className="font-semibold">Required Skills</label>
            <input
              type="text"
              className="border rounded p-2 w-full mt-1"
              placeholder="Press Enter to add a skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
            />
            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    className="text-red-500 font-bold"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Experience */}
          <div>
            <label className="font-semibold">Experience Required (Years)</label>
            <input
              type="number"
              className="border rounded p-2 w-full mt-1"
              placeholder="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              min="0"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
            }`}
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
      {/* Job List */}
      <div>
        <h3 className="text-xl font-bold mb-4">My Posted Jobs</h3>
        {jobsLoading ? (
          <div className="text-gray-500">Loading jobs...</div>
        ) : jobError ? (
          <div className="text-red-500">{jobError}</div>
        ) : jobs.length === 0 ? (
          <div className="text-gray-500">No jobs posted yet.</div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.job_id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-semibold">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.skills?.join(", ")}</div>
                  <div className="text-xs text-gray-400">{job.posted_on || job.created_at || ""}</div>
                </div>
                <button
                  onClick={() => handleDelete(job.job_id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
