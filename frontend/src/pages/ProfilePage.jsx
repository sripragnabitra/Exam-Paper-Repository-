import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import api from "../api/axios";

const statusConfig = {
  approved: { label: "Approved", cls: "badge-green", icon: "✅" },
  pending: { label: "Pending Review", cls: "badge-yellow", icon: "⏳" },
  rejected: { label: "Rejected", cls: "badge-red", icon: "❌" },
  ready_for_review: { label: "Processing", cls: "badge-blue", icon: "🔄" },
};

export default function ProfilePage() {
  const { user, token, loading } = useContext(AuthContext);
  const [papers, setPapers] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPapers(res.data.papers || []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  if (loading || fetching) return <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-ink-3)" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!user) return <Navigate to="/login" replace />;

  const counts = {
    approved: papers.filter(p => p.status === "approved").length,
    pending: papers.filter(p => p.status === "pending").length,
    rejected: papers.filter(p => p.status === "rejected").length,
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      {/* Profile header */}
      <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--color-accent)",
            color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", fontWeight: 700, flexShrink: 0,
          }}>
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", margin: 0 }}>{user.fullName}</h1>
              {user.isAdmin && <span className="badge badge-purple">Admin</span>}
            </div>
            <div style={{ color: "var(--color-ink-3)", fontSize: "0.875rem", marginTop: 4 }}>{user.email}</div>
          </div>
          <div style={{
            textAlign: "center",
            background: "var(--color-accent-light)",
            border: "1px solid rgba(37,99,168,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1.5rem",
          }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-accent)" }}>{user.credits ?? 0}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Credits</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem", marginTop: "1.5rem",
          paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)",
        }}>
          {[
            { label: "Approved", count: counts.approved, color: "var(--color-green)" },
            { label: "Pending", count: counts.pending, color: "var(--color-yellow)" },
            { label: "Rejected", count: counts.rejected, color: "var(--color-red)" },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color }}>{count}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-ink-3)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Uploads list */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", margin: 0 }}>
          My Uploads ({papers.length})
        </h2>
        <Link to="/upload" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>+ Upload New</Link>
      </div>

      {papers.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-ink-3)" }}>
          No uploads yet.{" "}
          <Link to="/upload" style={{ color: "var(--color-accent)" }}>Upload your first paper!</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {papers.map((p) => {
            const s = statusConfig[p.status] || { label: p.status, cls: "badge-blue", icon: "•" };
            return (
              <div key={p._id} className="card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>
                      {p.title || `${p.courseCode} — ${p.examType || "Exam"}`}
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[p.courseCode, p.academicYear, p.semester].filter(Boolean).map((v, i) => (
                        <span key={i} style={{ fontSize: "0.78rem", color: "var(--color-ink-3)" }}>{v}</span>
                      ))}
                      <span style={{ fontSize: "0.78rem", color: "var(--color-ink-3)" }}>
                        {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    {p.status === "approved" && p.creditsAwarded > 0 && (
                      <div style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--color-green)", fontWeight: 600 }}>
                        +{p.creditsAwarded} credits earned
                      </div>
                    )}
                    {p.status === "rejected" && (
                      <div style={{
                        marginTop: 8, fontSize: "0.8rem",
                        background: "var(--color-red-light)", color: "var(--color-red)",
                        padding: "6px 10px", borderRadius: "var(--radius-sm)",
                      }}>
                        Rejected — you can upload a revised version.
                      </div>
                    )}
                    {p.status === "pending" && (
                      <div style={{
                        marginTop: 8, fontSize: "0.8rem",
                        color: "var(--color-yellow)", 
                      }}>
                        Waiting for admin review. You'll be notified.
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span className={`badge ${s.cls}`}>{s.icon} {s.label}</span>
                    {p.status === "approved" && (
                      <Link to={`/papers/${p._id}`} style={{ fontSize: "0.78rem", color: "var(--color-accent)" }}>
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
