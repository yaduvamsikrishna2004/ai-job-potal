// src/App.jsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
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
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Candidate routes */}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/upload" element={<UploadResume />} />
          <Route path="/candidate/recommend" element={<Recommendations />} />

          {/* Recruiter routes */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/screen" element={<ScreenCandidates />} />
        </Route>
      </Route>
    </Routes>
  );
}
