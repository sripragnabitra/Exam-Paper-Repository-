import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AuthSuccess from "./pages/AuthSuccess";
import Landing from "./pages/Landing";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
          <Navbar />
          <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/papers/:id" element={<PaperView />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin/review" element={<AdminReviewPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
