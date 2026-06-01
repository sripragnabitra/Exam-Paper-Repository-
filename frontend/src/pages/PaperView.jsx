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
    getPaper(id, token)
      .then((res) => setPaper(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleDownload = () => {
    if (paper?.fileUrl) {
      window.open(paper.fileUrl, "_blank");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!paper) return (
    <div className="p-8 text-center">
      <div className="text-gray-500 mb-4">Paper not found.</div>
      <Link to="/search" className="text-blue-600 underline">Back to search</Link>
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <Link to="/search" className="text-blue-600 text-sm">← Back to search</Link>
      </div>

      <div className="bg-white border rounded p-6">
        <h2 className="text-xl font-bold mb-1">{paper.title || `${paper.courseCode} Exam`}</h2>
        <div className="text-sm text-gray-500 mb-4">
          Uploaded by {paper.uploader?.fullName || "Unknown"}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            ["Course", paper.courseCode],
            ["Year", paper.academicYear],
            ["Semester", paper.semester],
            ["Type", paper.examType],
          ].map(([label, value]) =>
            value ? (
              <div key={label} className="bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="font-medium text-sm">{value}</div>
              </div>
            ) : null
          )}
        </div>

        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      {paper.questions?.length > 0 && (
        <section className="mt-6">
          <h3 className="font-semibold text-lg mb-3">
            Extracted Questions ({paper.questions.length})
          </h3>
          <div className="space-y-2">
            {paper.questions.map((q, i) => (
              <div key={q._id || i} className="bg-white border rounded p-3">
                <div className="font-medium text-sm text-gray-500 mb-1">
                  Q{q.questionIndex || i + 1}
                  {q.topic && <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{q.topic}</span>}
                </div>
                <div className="text-sm text-gray-800">{q.text}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {paper.questions?.length === 0 && paper.status !== "approved" && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
          This paper is {paper.status}. Questions will be extracted after approval.
        </div>
      )}
    </div>
  );
}
