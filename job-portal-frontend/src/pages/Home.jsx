// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find the Right Job. Hire the Right Talent.
          </h1>

          <p className="text-xl mb-10 text-blue-100">
            AI-powered job matching and resume screening platform
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

     {/* SERVICES */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-bold text-center mb-4">
    Our AI-Powered Services
  </h2>
  <p className="text-center text-gray-600 mb-14">
    Designed for candidates and recruiters to hire smarter and faster
  </p>

  <div className="grid md:grid-cols-3 gap-8">
    {/* Resume Screening */}
    <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
      <div className="text-4xl mb-4">📄</div>
      <h3 className="text-xl font-bold mb-3">
        Resume Screening
      </h3>
      <p className="text-gray-600 mb-6">
        Instantly rank resumes using AI-powered skill and experience matching.
      </p>
      <Link
        to="/services/resume-screening"
        className="text-blue-600 font-semibold hover:underline"
      >
        Learn More →
      </Link>
    </div>

    {/* Job Recommendation */}
    <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
      <div className="text-4xl mb-4">🤖</div>
      <h3 className="text-xl font-bold mb-3">
        Job Recommendations
      </h3>
      <p className="text-gray-600 mb-6">
        Get personalized job recommendations based on your resume.
      </p>
      <Link
        to="/services/job-recommendation"
        className="text-blue-600 font-semibold hover:underline"
      >
        Learn More →
      </Link>
    </div>

    {/* Smart Hiring */}
    <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
      <div className="text-4xl mb-4">📊</div>
      <h3 className="text-xl font-bold mb-3">
        Smart Hiring Dashboard
      </h3>
      <p className="text-gray-600 mb-6">
        Recruiters get ranked candidates with AI fit scores.
      </p>
      <Link
        to="/login"
        className="text-blue-600 font-semibold hover:underline"
      >
        Start Hiring →
      </Link>
    </div>
  </div>
</section>


      {/* ROLE SECTION */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Who Is This For?
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-8 bg-gray-50 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Candidates</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Upload resumes</li>
                <li>Get AI job recommendations</li>
                <li>Apply for jobs easily</li>
              </ul>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Recruiters</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Post job openings</li>
                <li>Screen hundreds of resumes instantly</li>
                <li>Rank candidates with AI scores</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center">
        © {new Date().getFullYear()} AI Job Portal · Built with ❤️ & AI
      </footer>
    </div>
  );
}
