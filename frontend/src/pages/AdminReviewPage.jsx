import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchPendingPapers, approvePaper, rejectPaper } from "../api/admin";
import { Navigate } from "react-router-dom";

export default function AdminReviewPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token || !user?.isAdmin) return;
    fetchPendingPapers(token)
      .then((res) => setPending(res.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token, user]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  const handleApprove = async (id) => {
    await approvePaper(id, token);
    setPending((p) => p.filter((x) => x._id !== id));
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    await rejectPaper(id, reason, token);
    setPending((p) => p.filter((x) => x._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Pending Papers</h2>

      {fetching && <div className="text-gray-500">Loading papers...</div>}

      <div className="space-y-3">
        {!fetching && pending.map((p) => (
          <div key={p._id} className="bg-white border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{p.title || p.courseCode}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {p.courseCode} • {p.academicYear} • {p.semester} • {p.examType}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  By: {p.uploader?.fullName || "Unknown"} ({p.uploader?.email})
                </div>
                {p.fileUrl && (
                  <a href={p.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline mt-1 inline-block">
                    View file
                  </a>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleApprove(p._id)}
                  className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(p._id)}
                  className="bg-red-500 text-white px-4 py-1.5 rounded text-sm hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {!fetching && pending.length === 0 && (
          <div className="text-gray-500 bg-white border rounded p-8 text-center">
            No pending papers to review 🎉
          </div>
        )}
      </div>
    </div>
  );
}
