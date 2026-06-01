import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchPapers } from "../api/papers";
import { Link, Navigate } from "react-router-dom";
import PaperCard from "../components/PaperCard";

export default function Dashboard() {
  const { user, token, loading } = useContext(AuthContext);
  const [recent, setRecent] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    searchPapers({ limit: 6 })
      .then((res) => setRecent(res.data?.results || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-ink-3)" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      {/* Welcome header */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-accent) 0%, #1d4ed8 100%)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem 2.5rem",
        color: "white",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: 4 }}>Welcome back</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            margin: "0 0 0.5rem",
            color: "white",
          }}>{user.fullName}</h1>
          <div style={{ fontSize: "0.875rem", opacity: 0.85 }}>{user.email}</div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "var(--radius-md)",
            padding: "1rem 1.5rem",
            textAlign: "center",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{user.credits ?? 0}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Credits</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        {[
          { to: "/upload", icon: "📤", label: "Upload Paper", desc: "Contribute & earn credits", primary: true },
          { to: "/search", icon: "🔍", label: "Search Papers", desc: "Find past exams" },
          { to: "/profile", icon: "👤", label: "My Uploads", desc: "Track your submissions" },
          { to: "/notifications", icon: "🔔", label: "Notifications", desc: "Review updates" },
          ...(user.isAdmin ? [{ to: "/admin/review", icon: "⚙️", label: "Admin Panel", desc: "Review submissions", admin: true }] : []),
        ].map((action) => (
          <Link key={action.to} to={action.to} style={{
            display: "block",
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: `1px solid ${action.primary ? "var(--color-accent)" : action.admin ? "var(--color-purple)" : "var(--color-border)"}`,
            background: action.primary ? "var(--color-accent-light)" : action.admin ? "var(--color-purple-light)" : "var(--color-surface)",
            textDecoration: "none",
            transition: "all 0.15s",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{action.icon}</div>
            <div style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: action.primary ? "var(--color-accent-dark)" : action.admin ? "var(--color-purple)" : "var(--color-ink)",
              marginBottom: 2,
            }}>{action.label}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--color-ink-3)" }}>{action.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent papers */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", margin: 0 }}>Recent Papers</h2>
          <Link to="/search" style={{ fontSize: "0.85rem", color: "var(--color-accent)" }}>View all →</Link>
        </div>

        {fetching && <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-ink-3)" }}><div className="spinner" /></div>}

        {!fetching && recent.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-ink-3)" }}>
            No papers yet.{" "}
            <Link to="/upload" style={{ color: "var(--color-accent)" }}>Be the first to upload!</Link>
          </div>
        )}

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {recent.map((p) => <PaperCard key={p._id} paper={p} />)}
        </div>
      </div>
    </div>
  );
}
