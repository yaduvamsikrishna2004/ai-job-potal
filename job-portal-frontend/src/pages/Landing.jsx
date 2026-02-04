// src/pages/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {

  return (
    <div className="bg-linear-to-b from-blue-50 to-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-blue-100 via-white to-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Find the <span className="text-blue-600">Right Job</span>.<br />
              Hire the <span className="text-purple-600">Right Talent</span>.
            </h1>
            <div className="mt-4 flex gap-2">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">AI Matching</span>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Resume Parsing</span>
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">Role-based Access</span>
            </div>
            <p className="mt-6 text-lg text-gray-600">
              AI-powered job portal that matches candidates and recruiters using
              resume screening and intelligent recommendations.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded text-lg font-semibold shadow hover:bg-blue-700 transition"
              >
                Find Jobs
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border-2 border-purple-600 text-purple-700 rounded text-lg font-semibold hover:bg-purple-50 transition"
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
              className="w-full drop-shadow-xl"
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
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h4" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Resume Screening</h3>
                <p className="text-gray-600">
                  Automatically rank resumes using AI-powered text similarity and embeddings.
                </p>
              </div>
            </div>
            {/* Service 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4v-4a4 4 0 00-4-4H7a4 4 0 00-4 4v4a4 4 0 004 4h4" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Job Recommendation</h3>
                <p className="text-gray-600">
                  Get personalized job recommendations based on your resume and skills.
                </p>
              </div>
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
              className="px-6 py-3 bg-green-600 text-white rounded text-lg font-semibold shadow hover:bg-green-700 transition"
            >
              I'm a Candidate
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-purple-600 text-white rounded text-lg font-semibold shadow hover:bg-purple-700 transition"
            >
              I'm a Recruiter
            </Link>
          </div>
        </div>
      </section>
      {/* TESTIMONIALS / TRUST SIGNALS */}
      <section className="py-16 bg-linear-to-r from-blue-50 to-purple-50 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8">Trusted by job seekers & recruiters</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
              <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <p className="text-gray-700 text-center mb-2">“I found my dream job in just a week! The recommendations were spot on.”</p>
              <span className="text-xs text-gray-400">— Priya S., Candidate</span>
            </div>
            <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
              <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <p className="text-gray-700 text-center mb-2">“Bulk resume upload and AI screening saved us hours every week.”</p>
              <span className="text-xs text-gray-400">— Rahul M., Recruiter</span>
            </div>
            <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
              <svg className="w-10 h-10 text-purple-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <p className="text-gray-700 text-center mb-2">“The interface is clean, fast, and easy to use. Highly recommended!”</p>
              <span className="text-xs text-gray-400">— Anjali T., HR Manager</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
