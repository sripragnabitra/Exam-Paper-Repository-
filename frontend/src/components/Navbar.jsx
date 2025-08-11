import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./Notification";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-lg">ExamRepo</Link>
          <Link to="/search" className="text-sm text-gray-600">Search</Link>
          <Link to="/upload" className="text-sm text-gray-600">Upload</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && <span className="text-sm">Credits: <strong>{user.credits ?? 0}</strong></span>}
          <NotificationBell />
          {user ? (
            <>
              {user.role === "admin" && <Link to="/admin/review" className="text-sm">Admin</Link>}
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Logout</button>
            </>
          ) : (
            <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/google`} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}
