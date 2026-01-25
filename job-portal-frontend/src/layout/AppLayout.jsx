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
    <div className="flex min-h-screen bg-gray-100">

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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        {/* Candidate/Recruiter Chatbot Floating Button */}
        {role === "candidate" && (
          <>
            <button
              className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl hover:bg-blue-700 focus:outline-none"
              style={{ display: showChatbot ? "none" : "flex" }}
              onClick={() => setShowChatbot(true)}
              aria-label="Open Chatbot"
            >
              🤖
            </button>
            {showChatbot && (
              <div className="z-50">
                <Chatbot />
                <button
                  className="fixed bottom-102 right-6 bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs shadow hover:bg-gray-300"
                  onClick={() => setShowChatbot(false)}
                  aria-label="Close Chatbot"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}
        {role === "recruiter" && (
          <>
            <button
              className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl hover:bg-purple-700 focus:outline-none"
              style={{ display: showChatbot ? "none" : "flex" }}
              onClick={() => setShowChatbot(true)}
              aria-label="Open Recruiter Chatbot"
            >
              🤖
            </button>
            {showChatbot && (
              <div className="z-50">
                <RecruiterChatbot />
                <button
                  className="fixed bottom-102 right-6 bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs shadow hover:bg-gray-300"
                  onClick={() => setShowChatbot(false)}
                  aria-label="Close Recruiter Chatbot"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
