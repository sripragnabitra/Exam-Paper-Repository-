import { Link } from "react-router-dom";

const statusConfig = {
  approved: { label: "Approved", cls: "badge-green" },
  pending: { label: "Pending", cls: "badge-yellow" },
  rejected: { label: "Rejected", cls: "badge-red" },
  ready_for_review: { label: "Processing", cls: "badge-blue" },
};

export default function PaperCard({ paper }) {
  const status = statusConfig[paper.status] || { label: paper.status, cls: "badge-blue" };

  return (
    <div className="card" style={{
      padding: "1.1rem 1.25rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "1rem",
      transition: "all 0.15s",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to={`/papers/${paper._id}`} style={{
          fontWeight: 600,
          fontSize: "0.95rem",
          color: "var(--color-accent)",
          display: "block",
          marginBottom: 4,
          textDecoration: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {paper.title || `${paper.courseCode || "Paper"} — ${paper.examType || "Exam"}`}
        </Link>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[paper.courseCode, paper.academicYear, paper.semester, paper.examType]
            .filter(Boolean)
            .map((val, i) => (
              <span key={i} style={{ fontSize: "0.78rem", color: "var(--color-ink-3)" }}>
                {val}
              </span>
            ))}
        </div>

        {paper.matchedQuestions?.length > 0 && (
          <div style={{
            marginTop: 8,
            padding: "6px 10px",
            background: "var(--color-accent-light)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.78rem",
            color: "var(--color-accent-dark)",
            borderLeft: "3px solid var(--color-accent)",
          }}>
            <strong>Matched: </strong>
            {paper.matchedQuestions[0].text.slice(0, 110)}
            {paper.matchedQuestions[0].text.length > 110 ? "…" : ""}
          </div>
        )}
      </div>

      <span className={`badge ${status.cls}`} style={{ flexShrink: 0, marginTop: 2 }}>
        {status.label}
      </span>
    </div>
  );
}
