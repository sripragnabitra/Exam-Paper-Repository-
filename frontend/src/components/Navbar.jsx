import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./Notification";

export default function Navbar() {
  const { user, logout, googleAuthUrl } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-sm)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 1.5rem",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 22 }}>📚</span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            color: "var(--color-ink)",
            letterSpacing: "-0.01em",
          }}>ExamRepo</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {[
            { to: "/search", label: "Search" },
            ...(user ? [{ to: "/upload", label: "Upload" }] : []),
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              fontWeight: isActive(to) ? 600 : 400,
              color: isActive(to) ? "var(--color-accent)" : "var(--color-ink-2)",
              background: isActive(to) ? "var(--color-accent-light)" : "transparent",
              transition: "all 0.15s",
              textDecoration: "none",
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
          {user ? (
            <>
              {/* Credits pill */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 99,
                padding: "4px 12px",
                fontSize: "0.8rem",
              }}>
                <span style={{ color: "var(--color-ink-3)" }}>Credits</span>
                <span style={{ fontWeight: 700, color: "var(--color-accent)" }}>{user.credits ?? 0}</span>
              </div>

              <NotificationBell />

              {user.isAdmin && (
                <Link to="/admin/review" style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--color-purple)",
                  background: "var(--color-purple-light)",
                  padding: "4px 12px",
                  borderRadius: 99,
                  textDecoration: "none",
                }}>
                  ⚙ Admin
                </Link>
              )}

              <Link to="/profile" style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 12px 4px 4px",
                borderRadius: 99,
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                textDecoration: "none",
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.875rem", color: "var(--color-ink)", fontWeight: 500 }}>
                  {user.fullName?.split(" ")[0]}
                </span>
              </Link>

              <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                Logout
              </button>
            </>
          ) : (
            <a href={googleAuthUrl} className="btn btn-primary" style={{ gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
