import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { uploadPaper } from "../api/papers";
import { Navigate, Link } from "react-router-dom";

export default function UploadPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    courseCode: "",
    year: "",
    semester: "",
    examType: "",
    title: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    if (!metadata.courseCode) return setError("Course code is required");

    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", metadata.title || `${metadata.courseCode} - ${metadata.examType || "Exam"}`);
    fd.append("courseCode", metadata.courseCode);
    fd.append("academicYear", metadata.year);
    fd.append("semester", metadata.semester);
    fd.append("examType", metadata.examType);

    try {
      await uploadPaper(fd, token);
      setSuccess(true);
      setFile(null);
      setProgress(0);
      setMetadata({ courseCode: "", year: "", semester: "", examType: "", title: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed. Please try again.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Exam Paper</h2>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-green-800">
          ✅ Paper uploaded successfully! It will be reviewed by an admin before going live.{" "}
          <Link to="/dashboard" className="underline">Go to Dashboard</Link>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={submit} className="bg-white p-6 rounded shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image) *</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: "courseCode", label: "Course Code *", placeholder: "e.g. CS301" },
            { key: "year", label: "Academic Year", placeholder: "e.g. 2024" },
            { key: "semester", label: "Semester", placeholder: "e.g. Fall, Sem 1" },
            { key: "examType", label: "Exam Type", placeholder: "e.g. Midterm, Final" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                placeholder={placeholder}
                value={metadata[key]}
                onChange={(e) => setMetadata({ ...metadata, [key]: e.target.value })}
                className="border p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
          <input
            placeholder="Custom title for this paper"
            value={metadata.title}
            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
            className="border p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? `Uploading... ${progress > 0 ? progress + "%" : ""}` : "Upload Paper"}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Papers go through admin review before becoming publicly available. You earn credits upon approval.
      </p>
    </div>
  );
}
