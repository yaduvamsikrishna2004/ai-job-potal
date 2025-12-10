// src/layout/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      </div>
    </div>
  );
}
