import { Outlet } from "react-router-dom";
import NavbarPublic from "../components/PublicNavbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarPublic />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
