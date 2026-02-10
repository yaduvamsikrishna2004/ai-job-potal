// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-white" />
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-8">
            <div className="text-3xl md:text-4xl font-semibold text-blue-700 tracking-tight">
              JobFit Engine
            </div>
          </div>
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="panel p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                JobFit Engine
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight text-slate-900">
                Find the right role. Hire the right talent.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                A modern hiring workspace that turns resumes and roles into
                confident, data-backed decisions.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 text-sm text-slate-600">
                <div className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                  <div className="text-slate-900 text-xl font-semibold">92%</div>
                  Hiring accuracy lift
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                  <div className="text-slate-900 text-xl font-semibold">4x</div>
                  Faster shortlists
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                  <div className="text-slate-900 text-xl font-semibold">24/7</div>
                  Candidate support
                </div>
              </div>
            </div>
            <div className="panel p-6 md:p-7">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Live Screening</span>
                <span className="chip bg-blue-100 text-blue-700">AI Enabled</span>
              </div>
              <div className="mt-6 space-y-4">
                {["Frontend Engineer", "Data Scientist", "Product Manager"].map((role) => (
                  <div key={role} className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-slate-900 font-semibold">{role}</div>
                        <div className="text-xs text-slate-500">Top match candidates</div>
                      </div>
                      <div className="text-sm text-blue-700 font-semibold">+87%</div>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-200/70">
                      <div className="h-2 w-4/5 rounded-full bg-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="panel-soft px-6 py-6 bg-white/90">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400">Trusted by teams</div>
              <p className="text-sm text-slate-500 mt-1">Hiring teams that ship faster.</p>
            </div>
            <div className="flex gap-2">
              <span className="chip bg-blue-100 text-blue-700">Secure</span>
              <span className="chip bg-sky-100 text-sky-700">GDPR Ready</span>
              <span className="chip bg-indigo-100 text-indigo-700">SOC2</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-500 md:grid-cols-4">
            <span>NovaWorks</span>
            <span>Axis HR</span>
            <span>PulseStack</span>
            <span>BrightHire</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title">AI-powered services</h2>
            <p className="section-subtitle mt-2">
              Purpose-built flows for candidates and recruiters.
            </p>
          </div>
          <Link to="/services/job-recommendation" className="btn-outline">
            Explore services
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Resume Screening",
              desc: "Instantly rank resumes with skill and experience matching.",
              link: "/services/resume-screening",
              tone: "from-blue-500/10 to-sky-500/10",
            },
            {
              title: "Job Recommendations",
              desc: "Personalized matches based on your actual resume content.",
              link: "/services/job-recommendation",
              tone: "from-sky-500/10 to-cyan-500/10",
            },
            {
              title: "Recruiter Workspace",
              desc: "Post jobs, screen in bulk, and shortlist with clarity.",
              link: "/login",
              tone: "from-indigo-500/10 to-blue-500/10",
            },
          ].map((item) => (
            <div key={item.title} className={`panel p-6 bg-gradient-to-br ${item.tone}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="h-8 w-8 rounded-lg bg-white/70 border border-slate-200/60" />
              </div>
              <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
              <Link to={item.link} className="mt-6 inline-flex text-sm font-semibold text-blue-600">
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="panel p-8 bg-gradient-to-br from-white via-white to-blue-50">
          <div className="flex items-center justify-between">
            <h2 className="section-title">How it works</h2>
            <span className="chip bg-blue-100 text-blue-700">3 Steps</span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              "Upload resumes or post a role",
              "AI scores skills, experience, and relevance",
              "Shortlist and apply with confidence",
            ].map((text, idx) => (
              <div key={text} className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
                <div className="text-xs font-semibold text-slate-500">Step {idx + 1}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{text}</div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-200/70">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(idx + 1) * 30}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title text-center">Built for both sides</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="panel p-6 bg-gradient-to-br from-blue-50 to-white">
            <h3 className="text-lg font-semibold text-slate-900">Candidates</h3>
            <p className="mt-2 text-sm text-slate-600">
              Upload resumes, get matched roles, and track every application.
            </p>
            <Link to="/register" className="mt-5 inline-flex text-sm font-semibold text-blue-600">
              Create candidate profile
            </Link>
          </div>
          <div className="panel p-6 bg-gradient-to-br from-sky-50 to-white">
            <h3 className="text-lg font-semibold text-slate-900">Recruiters</h3>
            <p className="mt-2 text-sm text-slate-600">
              Post roles, screen at scale, and build shortlists in minutes.
            </p>
            <Link to="/register" className="mt-5 inline-flex text-sm font-semibold text-blue-600">
              Create recruiter profile
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="panel p-8 bg-gradient-to-br from-white via-white to-blue-50">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="section-title">Start hiring smarter today</h2>
              <p className="section-subtitle mt-2">
                Build your talent pipeline with AI-guided decisions.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/register" className="btn-primary">
                Create account
              </Link>
              <Link to="/login" className="btn-outline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-blue-700 bg-blue-50/60">
        (c) {new Date().getFullYear()} JobFit Engine. All rights reserved.
      </footer>
    </div>
  );
}
