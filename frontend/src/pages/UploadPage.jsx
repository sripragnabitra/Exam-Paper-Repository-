import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { uploadPaper } from "../api/papers";
import { Navigate, Link } from "react-router-dom";

export default function UploadPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({ courseCode: "", year: "", semester: "", examType: "", title: "" });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const set = (key, val) => setMetadata(m => ({ ...m, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    if (!metadata.courseCode) return setError("Course code is required");
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", metadata.title || `${metadata.courseCode} — ${metadata.examType || "Exam"}`);
    fd.append("courseCode", metadata.courseCode);
    fd.append("academicYear", metadata.year);
    fd.append("semester", metadata.semester);
    fd.append("examType", metadata.examType);
    try {
      await uploadPaper(fd, token);
      setSuccess(true);
      setFile(null);
      setMetadata({ courseCode: "", year: "", semester: "", examType: "", title: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    { key: "courseCode", label: "Course Code", placeholder: "e.g. CS301", required: true },
    { key: "year", label: "Academic Year", placeholder: "e.g. 2024" },
    { key: "semester", label: "Semester", placeholder: "e.g. Fall, Sem 1" },
    { key: "examType", label: "Exam Type", placeholder: "e.g. Midterm, Final" },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 6 }}>Upload Paper</h1>
        <p style={{ color: "var(--color-ink-3)", fontSize: "0.9rem" }}>
          Papers are reviewed by an admin before going live. You earn <strong>10 credits</strong> per approval.
        </p>
      </div>

      {success && (
        <div style={{
          background: "var(--color-green-light)",
          border: "1px solid #86efac",
          borderRadius: "var(--radius-md)",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--color-green)",
        }}>
          <span>✅ Uploaded successfully! Pending admin review.</span>
          <Link to="/profile" style={{ fontSize: "0.85rem", color: "var(--color-green)", textDecoration: "underline" }}>
            View status →
          </Link>
        </div>
      )}

      {error && (
        <div style={{
          background: "var(--color-red-light)",
          border: "1px solid #fca5a5",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          marginBottom: "1rem",
          color: "var(--color-red)",
          fontSize: "0.875rem",
        }}>{error}</div>
      )}

      <form onSubmit={submit} className="card" style={{ padding: "1.75rem" }}>
        {/* File drop area */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", marginBottom: 8, color: "var(--color-ink)" }}>
            File (PDF or Image) *
          </label>
          <label style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "2rem",
            border: `2px dashed ${file ? "var(--color-accent)" : "var(--color-border)"}`,
            borderRadius: "var(--radius-md)",
            background: file ? "var(--color-accent-light)" : "var(--color-surface-2)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: "2rem" }}>{file ? "📄" : "📁"}</span>
            <span style={{ fontSize: "0.875rem", color: "var(--color-ink-2)", fontWeight: 500 }}>
              {file ? file.name : "Click to choose file"}
            </span>
            {!file && <span style={{ fontSize: "0.78rem", color: "var(--color-ink-3)" }}>PDF, JPG, PNG supported</span>}
            <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
          </label>
        </div>

        {/* Metadata fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
          {fields.map(({ key, label, placeholder, required }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: 5, color: "var(--color-ink-2)" }}>
                {label}{required && " *"}
              </label>
              <input
                className="input"
                placeholder={placeholder}
                value={metadata[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: 5, color: "var(--color-ink-2)" }}>
            Custom Title (optional)
          </label>
          <input
            className="input"
            placeholder="Leave blank to auto-generate from course code & type"
            value={metadata.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: "0.95rem" }}
        >
          {uploading ? "Uploading…" : "Upload Paper"}
        </button>
      </form>
    </div>
  );
}
