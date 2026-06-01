import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchPendingPapers, approvePaper, rejectPaper } from "../api/admin";
import { Navigate } from "react-router-dom";

export default function AdminReviewPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!token || !user?.isAdmin) return;
    fetchPendingPapers(token).then(r => setPending(r.data)).catch(() => {}).finally(() => setFetching(false));
  }, [token, user]);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  const handleApprove = async (id) => {
    setProcessing(id + "_approve");
    await approvePaper(id, token);
    setPending(p => p.filter(x => x._id !== id));
    setProcessing(null);
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    setProcessing(id + "_reject");
    await rejectPaper(id, reason, token);
    setPending(p => p.filter(x => x._id !== id));
    setProcessing(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 4 }}>Review Papers</h1>
        <p style={{ color: "var(--color-ink-3)", fontSize: "0.9rem" }}>
          {pending.length} paper{pending.length !== 1 ? "s" : ""} awaiting review
        </p>
      </div>

      {fetching && <div style={{ textAlign: "center", padding: "3rem" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>}

      {!fetching && pending.length === 0 && (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉</div>
          <div style={{ color: "var(--color-ink-2)", fontWeight: 600 }}>All caught up!</div>
          <div style={{ color: "var(--color-ink-3)", fontSize: "0.875rem", marginTop: 4 }}>No pending papers to review.</div>
        </div>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {pending.map((p) => (
          <div key={p._id} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>
                  {p.title || `${p.courseCode} — ${p.examType || "Exam"}`}
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  {[p.courseCode, p.academicYear, p.semester, p.examType].filter(Boolean).map((v, i) => (
                    <span key={i} className="badge badge-blue">{v}</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-ink-3)" }}>
                  By <strong style={{ color: "var(--color-ink-2)" }}>{p.uploader?.fullName || "Unknown"}</strong>
                  {p.uploader?.email && <span> · {p.uploader.email}</span>}
                </div>
                {p.fileUrl && (
                  <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: "0.8rem", color: "var(--color-accent)",
                    marginTop: 8, textDecoration: "none",
                  }}>
                    📄 Preview file →
                  </a>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button
                  onClick={() => handleApprove(p._id)}
                  disabled={!!processing}
                  className="btn"
                  style={{
                    background: "var(--color-green)", color: "white",
                    opacity: processing === p._id + "_approve" ? 0.7 : 1,
                  }}
                >
                  {processing === p._id + "_approve" ? "…" : "✓ Approve"}
                </button>
                <button
                  onClick={() => handleReject(p._id)}
                  disabled={!!processing}
                  className="btn btn-danger"
                  style={{ opacity: processing === p._id + "_reject" ? 0.7 : 1 }}
                >
                  {processing === p._id + "_reject" ? "…" : "✕ Reject"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
