import { Link } from "react-router-dom";

export default function ResumeScreening() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">AI-Powered Resume Screening</h1>
        <p className="text-gray-700 text-lg mb-6">
          Instantly screen and rank resumes using advanced AI. Save hours of manual review and find the best-fit candidates faster. Our system analyzes skills, experience, and relevance to your job postings—so you can focus on interviewing, not sorting.
        </p>
        <ul className="text-left text-gray-600 mb-6 list-disc list-inside">
          <li>Automatic skill extraction and scoring</li>
          <li>Ranked candidate lists for every job</li>
          <li>Bias-minimized, data-driven shortlisting</li>
          <li>Seamless integration with your workflow</li>
        </ul>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <Link to="/login" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">Login</Link>
          <Link to="/register" className="w-full md:w-auto bg-white border border-blue-600 text-blue-700 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition">Register</Link>
        </div>
      </div>
    </div>
  );
}
