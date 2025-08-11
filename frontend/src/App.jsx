import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import SearchPage from "./pages/SearchPage";
import PaperView from "./pages/PaperView";
import NotificationsPage from "./pages/NotificationsPage";
import AdminReviewPage from "./pages/AdminReviewPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-5xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/papers/:id" element={<PaperView />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/admin/review" element={<AdminReviewPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
