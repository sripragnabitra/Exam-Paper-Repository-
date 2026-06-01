import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./Notification";

export default function Navbar() {
  const { user, logout, googleAuthUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-lg text-blue-700">📚 ExamRepo</Link>
          <Link to="/search" className="text-sm text-gray-600 hover:text-gray-900">Search</Link>
          {user && (
            <Link to="/upload" className="text-sm text-gray-600 hover:text-gray-900">Upload</Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-gray-600">
              Credits: <strong>{user.credits ?? 0}</strong>
            </span>
          )}
          {user && <NotificationBell />}
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin/review" className="text-sm text-purple-700 font-medium">
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                {user.fullName?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href={googleAuthUrl}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
