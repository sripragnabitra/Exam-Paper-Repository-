import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchNotifications, markRead } from "../api/notifications";
import { Navigate } from "react-router-dom";

export default function NotificationsPage() {
  const { token, user, loading } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchNotifications(token).then(r => setList(r.data)).catch(() => {}).finally(() => setFetching(false));
  }, [token]);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleMark = async (id) => {
    await markRead(id, token);
    setList(l => l.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const unread = list.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: 4 }}>Notifications</h1>
          {unread > 0 && (
            <span className="badge badge-red">{unread} unread</span>
          )}
        </div>
        {unread > 0 && (
          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.8rem" }}
            onClick={async () => {
              await Promise.all(list.filter(n => !n.read).map(n => markRead(n._id, token)));
              setList(l => l.map(n => ({ ...n, read: true })));
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {fetching && <div style={{ textAlign: "center", padding: "3rem" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>}

      {!fetching && list.length === 0 && (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔔</div>
          <div style={{ color: "var(--color-ink-2)", fontWeight: 600 }}>No notifications yet</div>
          <div style={{ color: "var(--color-ink-3)", fontSize: "0.875rem", marginTop: 4 }}>
            You'll be notified when your papers are reviewed.
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {list.map(n => (
          <div key={n._id} className="card" style={{
            padding: "1.1rem 1.25rem",
            borderLeft: n.read ? "3px solid var(--color-border)" : "3px solid var(--color-accent)",
            background: n.read ? "var(--color-surface)" : "var(--color-accent-light)",
            opacity: n.read ? 0.8 : 1,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 4, color: "var(--color-ink)" }}>
                  {n.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-ink-2)", lineHeight: 1.5 }}>{n.body}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink-3)", marginTop: 6 }}>
                  {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {!n.read && (
                <button
                  onClick={() => handleMark(n._id)}
                  className="btn btn-ghost"
                  style={{ fontSize: "0.78rem", flexShrink: 0, padding: "4px 10px" }}
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
