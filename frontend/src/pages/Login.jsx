import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";

export default function Login() {
  const { googleAuthUrl } = useContext(AuthContext);
  const [params] = useSearchParams();
  const error = params.get("error");

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "linear-gradient(135deg, #f8f6f1 0%, #eef4ff 100%)",
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, padding: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📚</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: 8 }}>
          Welcome back
        </h1>
        <p style={{ color: "var(--color-ink-3)", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Sign in to access, upload, and search exam papers.
        </p>

        {error && (
          <div style={{
            background: "var(--color-red-light)",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem",
            marginBottom: "1rem",
            color: "var(--color-red)",
            fontSize: "0.875rem",
          }}>
            {error === "auth_failed" ? "Authentication failed. Please try again." : "Login error. Please try again."}
          </div>
        )}

        <a href={googleAuthUrl} className="btn" style={{
          width: "100%",
          justifyContent: "center",
          padding: "12px",
          background: "white",
          border: "1px solid var(--color-border)",
          color: "var(--color-ink)",
          fontSize: "0.95rem",
          boxShadow: "var(--shadow-sm)",
          gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </a>

        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)" }}>
          <Link to="/search" style={{ fontSize: "0.85rem", color: "var(--color-ink-3)" }}>
            Browse papers without logging in →
          </Link>
        </div>
      </div>
    </div>
  );
}
