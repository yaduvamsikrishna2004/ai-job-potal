import { useState } from "react";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

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

      const res = await fetch(`${API_URL}/recruiter/post-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert("error", data.error || "Failed to post job.");
        setLoading(false);
        return;
      }

      showAlert("success", "Job posted successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setSkills([]);
      setExperience("");

    } catch (err) {
      showAlert("error", "Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
