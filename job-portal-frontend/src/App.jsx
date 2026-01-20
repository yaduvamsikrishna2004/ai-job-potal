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

// Recruiter pages
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import PostJob from "./pages/recruiter/PostJob";
import ScreenCandidates from "./pages/recruiter/ScreenCandidates";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

            {/* Recruiter */}
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />
            <Route
              path="/recruiter/post-job"
              element={<PostJob />}
            />
            <Route
              path="/recruiter/screen"
              element={<ScreenCandidates />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
