import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, updateUserCredits } from "../api/admin";
import { Navigate } from "react-router-dom";

export default function AdminUsersPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token || !user?.isAdmin) return;
    fetchUsers(token)
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token, user]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  const changeCredits = async (id) => {
    const amount = Number(prompt("Amount to add/subtract (use negative to subtract):"));
    if (Number.isNaN(amount)) return;
    try {
      await updateUserCredits(id, amount, token);
      setUsers((u) =>
        u.map((x) => (x._id === id ? { ...x, credits: Math.max(0, x.credits + amount) } : x))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update credits");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Users ({users.length})</h2>

      {fetching && <div className="text-gray-500">Loading users...</div>}

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="bg-white border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{u.fullName}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
              <div className="text-sm text-gray-600 mt-0.5">
                Credits: <strong>{u.credits}</strong>
                {u.isAdmin && <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Admin</span>}
              </div>
            </div>
            <button
              onClick={() => changeCredits(u._id)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Adjust Credits
            </button>
          </div>
        ))}
        {!fetching && users.length === 0 && (
          <div className="text-gray-500 bg-white border rounded p-8 text-center">No users yet</div>
        )}
      </div>
    </div>
  );
}
