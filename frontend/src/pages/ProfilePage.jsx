import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import api from "../api/axios";

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  ready_for_review: "bg-blue-100 text-blue-700",
};

export default function ProfilePage() {
  const { user, token, loading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .get("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  if (loading || fetching) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const { papers = [] } = profile || {};
  const approved = papers.filter((p) => p.status === "approved").length;
  const pending = papers.filter((p) => p.status === "pending").length;
  const rejected = papers.filter((p) => p.status === "rejected").length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.fullName}</h1>
            <div className="text-gray-500 text-sm">{user.email}</div>
            {user.isAdmin && (
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded mt-1 inline-block">
                Admin
              </span>
            )}
          </div>
          <div className="ml-auto text-center">
            <div className="text-2xl font-bold text-blue-600">{user.credits ?? 0}</div>
            <div className="text-xs text-gray-500">Credits</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Approved", count: approved, color: "text-green-600" },
            { label: "Pending", count: pending, color: "text-yellow-600" },
            { label: "Rejected", count: rejected, color: "text-red-600" },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-gray-50 rounded p-3 text-center">
              <div className={`text-xl font-bold ${color}`}>{count}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My Uploads */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">My Uploads ({papers.length})</h2>
        <Link to="/upload" className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
          + Upload New
        </Link>
      </div>

      <div className="space-y-3">
        {papers.length === 0 && (
          <div className="bg-white border rounded p-8 text-center text-gray-500">
            You haven't uploaded any papers yet.{" "}
            <Link to="/upload" className="text-blue-600 underline">Upload your first one!</Link>
          </div>
        )}

        {papers.map((p) => (
          <div key={p._id} className="bg-white border rounded p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {p.title || `${p.courseCode} - ${p.examType || "Exam"}`}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {[p.courseCode, p.academicYear, p.semester].filter(Boolean).join(" • ")}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Uploaded {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded ${statusStyles[p.status] || "bg-gray-100 text-gray-600"}`}>
                  {p.status}
                </span>
                {p.status === "approved" && (
                  <Link to={`/papers/${p._id}`} className="text-xs text-blue-600 underline">
                    View
                  </Link>
                )}
                {p.creditsAwarded > 0 && (
                  <span className="text-xs text-green-600">+{p.creditsAwarded} credits earned</span>
                )}
              </div>
            </div>

            {p.status === "rejected" && (
              <div className="mt-2 text-xs bg-red-50 text-red-600 rounded p-2">
                This paper was rejected. You can upload a revised version.
              </div>
            )}
            {p.status === "pending" && (
              <div className="mt-2 text-xs bg-yellow-50 text-yellow-700 rounded p-2">
                Waiting for admin review. You'll be notified once reviewed.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
