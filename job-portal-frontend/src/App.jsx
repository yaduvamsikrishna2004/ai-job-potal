import ResumeScreening from "./pages/services/ResumeScreening";
import JobRecommendation from "./pages/services/JobRecommendation";
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layout/AppLayout";

// Public pages
import Home from "./pages/Home";        // Landing page
import Login from "./pages/Login";
import Register from "./pages/Register";

// Candidate pages
import CandidateDashboard from "./pages/candidate/Dashboard";
import UploadResume from "./pages/candidate/UploadResume";
import Recommendations from "./pages/candidate/Recommendations";
import ApplyHistory from "./pages/candidate/ApplyHistory";

// Recruiter pages
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import PostJob from "./pages/recruiter/PostJob";
import ScreenCandidates from "./pages/recruiter/ScreenCandidates";
import BulkUpload from "./pages/recruiter/BulkUpload";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Services Pages */}
        <Route path="/services/resume-screening" element={<ResumeScreening />} />
        <Route path="/services/job-recommendation" element={<JobRecommendation />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route element={<AppLayout />}>
            {/* Candidate */}
            <Route
              path="/candidate/dashboard"
              element={<CandidateDashboard />}
            />
            <Route
              path="/candidate/upload"
              element={<UploadResume />}
            />
            <Route
              path="/candidate/recommend"
              element={<Recommendations />}
            />
            <Route
              path="/candidate/applications"
              element={<ApplyHistory />}
            />
            {/* Recruiter */}
            <Route
              path="/recruiter/dashboard"
              element={<ProtectedRoute roles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>}
            />
            <Route
              path="/recruiter/post-job"
              element={<ProtectedRoute roles={["recruiter"]}><PostJob /></ProtectedRoute>}
            />
            <Route
              path="/recruiter/screen"
              element={<ProtectedRoute roles={["recruiter"]}><ScreenCandidates /></ProtectedRoute>}
            />
            <Route
              path="/recruiter/bulk-upload"
              element={<ProtectedRoute roles={["recruiter"]}><BulkUpload /></ProtectedRoute>}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
