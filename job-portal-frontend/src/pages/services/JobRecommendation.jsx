import { Link } from "react-router-dom";

export default function JobRecommendation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">Personalized Job Recommendations</h1>
        <p className="text-gray-700 text-lg mb-6">
          Discover jobs tailored to your skills and aspirations. Our AI matches your resume and preferences with thousands of listings, surfacing the best opportunities for you. Get ahead in your career with smart, data-driven job discovery.
        </p>
        <ul className="text-left text-gray-600 mb-6 list-disc list-inside">
          <li>AI-matched jobs based on your profile</li>
          <li>Skill and interest-based recommendations</li>
          <li>Instant access to top opportunities</li>
          <li>Easy application process</li>
        </ul>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <Link to="/login" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">Login</Link>
          <Link to="/register" className="w-full md:w-auto bg-white border border-green-600 text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-green-50 transition">Register</Link>
        </div>
      </div>
    </div>
  );
}
