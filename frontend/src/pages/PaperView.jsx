import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPaper } from "../api/papers";
import { AuthContext } from "../context/AuthContext";

export default function PaperView() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaper(id, token).then(r => setPaper(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!paper) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <div style={{ color: "var(--color-ink-3)", marginBottom: "1rem" }}>Paper not found.</div>
      <Link to="/search" className="btn btn-secondary">← Back to search</Link>
    </div>
  );

  const meta = [
    { label: "Course", value: paper.courseCode },
    { label: "Year", value: paper.academicYear },
    { label: "Semester", value: paper.semester },
    { label: "Type", value: paper.examType },
    { label: "Status", value: paper.status },
  ].filter(m => m.value);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      <Link to="/search" style={{ fontSize: "0.85rem", color: "var(--color-ink-3)", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: "1.5rem" }}>
        ← Back to search
      </Link>

      {/* Paper header */}
      <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          {paper.title || `${paper.courseCode} Exam`}
        </h1>
        <div style={{ color: "var(--color-ink-3)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Uploaded by {paper.uploader?.fullName || "Unknown"}
        </div>

        {/* Metadata chips */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {meta.map(({ label, value }) => (
            <div key={label} style={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 14px",
            }}>
              <div style={{ fontSize: "0.7rem", color: "var(--color-ink-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-ink)" }}>{value}</div>
            </div>
          ))}
        </div>

        <a
          href={paper.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ padding: "10px 24px" }}
        >
          ↓ Download PDF
        </a>
      </div>

      {/* Questions */}
      {paper.questions?.length > 0 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", marginBottom: "1rem" }}>
            Extracted Questions ({paper.questions.length})
          </h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {paper.questions.map((q, i) => (
              <div key={q._id || i} className="card" style={{ padding: "1.1rem 1.25rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{
                    flexShrink: 0,
                    width: 28, height: 28,
                    background: "var(--color-accent-light)",
                    color: "var(--color-accent)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700,
                  }}>
                    {q.questionIndex || i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", color: "var(--color-ink)", lineHeight: 1.6 }}>{q.text}</div>
                    {q.topic && (
                      <span className="badge badge-blue" style={{ marginTop: 6 }}>{q.topic}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {paper.status === "pending" && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem 1.25rem",
          background: "var(--color-yellow-light)",
          border: "1px solid #fcd34d",
          borderRadius: "var(--radius-md)",
          color: "var(--color-yellow)",
          fontSize: "0.875rem",
        }}>
          ⏳ This paper is pending admin review. Questions will be extracted after approval.
        </div>
      )}
    </div>
  );
}
