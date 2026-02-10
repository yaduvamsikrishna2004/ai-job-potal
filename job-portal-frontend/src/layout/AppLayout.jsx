// src/layout/AppLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Chatbot from "../pages/candidate/Chatbot";
import RecruiterChatbot from "../pages/recruiter/RecruiterChatbot";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div className="app-shell flex min-h-screen">

      {/* Sidebar (hidden on mobile if toggled) */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block fixed md:relative z-20`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Navbar with toggle button */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {/* Page content */}
        <main className="flex-1 px-4 pb-16 pt-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <Outlet />
          </div>
        </main>
        {/* Candidate/Recruiter Chatbot Floating Button */}
        {role === "candidate" && (
          <>
            <button
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-[0_18px_32px_-16px_rgba(37,99,235,0.7)] flex items-center justify-center text-2xl hover:from-blue-700 hover:to-sky-600 focus:outline-none"
              style={{ display: showChatbot ? "none" : "flex" }}
              onClick={() => setShowChatbot(true)}
              aria-label="Open Chatbot"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </button>
            {showChatbot && (
              <div className="z-50">
                <Chatbot onClose={() => setShowChatbot(false)} />
              </div>
            )}
          </>
        )}
        {role === "recruiter" && (
          <>
            <button
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-[0_18px_32px_-16px_rgba(147,51,234,0.7)] flex items-center justify-center text-2xl hover:from-purple-700 hover:to-fuchsia-600 focus:outline-none"
              style={{ display: showChatbot ? "none" : "flex" }}
              onClick={() => setShowChatbot(true)}
              aria-label="Open Recruiter Chatbot"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </button>
            {showChatbot && (
              <div className="z-50">
                <RecruiterChatbot onClose={() => setShowChatbot(false)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
