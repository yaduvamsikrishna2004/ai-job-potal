// src/pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Find the Right Job. <br />
              Hire the Right Talent.
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              AI-powered job portal that matches candidates and recruiters using
              resume screening and intelligent recommendations.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded text-lg hover:bg-blue-700"
              >
                Find Jobs
              </Link>

              <Link
                to="/register"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded text-lg hover:bg-blue-50"
              >
                Hire Talent
              </Link>
            </div>
          </div>

          {/* RIGHT (Illustration Placeholder) */}
          <div className="hidden md:block">
            <img
              src="https://illustrations.popsy.co/gray/job-interview.svg"
              alt="Job search"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Services
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Resume Screening
              </h3>
              <p className="text-gray-600">
                Automatically rank resumes using AI-powered text similarity and
                embeddings.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">
                Job Recommendation
              </h3>
              <p className="text-gray-600">
                Get personalized job recommendations based on your resume and
                skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Get Started Today
          </h2>

          <div className="flex justify-center gap-6">
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white rounded text-lg hover:bg-green-700"
            >
              I'm a Candidate
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 bg-purple-600 text-white rounded text-lg hover:bg-purple-700"
            >
              I'm a Recruiter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
