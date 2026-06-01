import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, updateUserCredits } from "../api/admin";
import { Navigate } from "react-router-dom";

export default function AdminUsersPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token || !user?.isAdmin) return;
    fetchUsers(token).then(r => setUsers(r.data)).catch(() => {}).finally(() => setFetching(false));
  }, [token, user]);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  const changeCredits = async (id) => {
    const amount = Number(prompt("Amount to add/subtract (use negative to subtract):"));
    if (Number.isNaN(amount)) return;
    try {
      await updateUserCredits(id, amount, token);
      setUsers(u => u.map(x => x._id === id ? { ...x, credits: Math.max(0, x.credits + amount) } : x));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update credits");
    }
  };

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 4 }}>Users</h1>
          <p style={{ color: "var(--color-ink-3)", fontSize: "0.9rem" }}>{users.length} total users</p>
        </div>
        <input
          className="input"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
      </div>

      {fetching && <div style={{ textAlign: "center", padding: "3rem" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>}

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {filtered.map(u => (
          <div key={u._id} className="card" style={{ padding: "1.1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: u.isAdmin ? "var(--color-purple-light)" : "var(--color-accent-light)",
                color: u.isAdmin ? "var(--color-purple)" : "var(--color-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.875rem", flexShrink: 0,
              }}>
                {u.fullName?.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.fullName}</span>
                  {u.isAdmin && <span className="badge badge-purple">Admin</span>}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "var(--color-accent)" }}>{u.credits}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--color-ink-3)" }}>credits</div>
              </div>
              <button onClick={() => changeCredits(u._id)} className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                Adjust
              </button>
            </div>
          </div>
        ))}
        {!fetching && filtered.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-ink-3)" }}>
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
