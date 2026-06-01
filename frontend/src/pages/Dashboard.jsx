import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchPapers } from "../api/papers";
import { Link, Navigate } from "react-router-dom";
import PaperCard from "../components/PaperCard";

export default function Dashboard() {
  const { user, token, loading } = useContext(AuthContext);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    searchPapers({ limit: 5 })
      .then((res) => setRecent(res.data?.results || []))
      .catch(() => {});
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.fullName}!</h1>
          <div className="text-sm text-gray-600 mt-1">
            Credits: <strong>{user.credits ?? 0}</strong>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            Upload Paper
          </Link>
          <Link to="/subscription" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
            Subscription
          </Link>
        </div>
      </div>

      {user.isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6 flex justify-between items-center">
          <span className="text-yellow-800 font-medium">You have admin access</span>
          <div className="flex gap-2">
            <Link to="/admin/review" className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
              Review Papers
            </Link>
            <Link to="/admin/users" className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
              Manage Users
            </Link>
          </div>
        </div>
      )}

      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Recent Papers</h3>
          <Link to="/search" className="text-blue-600 text-sm">View all →</Link>
        </div>
        <div className="space-y-2">
          {recent.length === 0 && (
            <div className="text-gray-500 bg-white border rounded p-6 text-center">
              No papers yet. <Link to="/upload" className="text-blue-600 underline">Upload the first one!</Link>
            </div>
          )}
          {recent.map((p) => (
            <PaperCard key={p._id} paper={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
