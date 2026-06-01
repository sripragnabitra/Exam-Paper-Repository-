import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchNotifications } from "../api/notifications";

export function NotificationBell() {
  const { token } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    fetchNotifications(token)
      .then(res => setCount(res.data.filter(n => !n.read).length))
      .catch(() => {});
  }, [token]);

  return (
    <Link to="/notifications" style={{ position: "relative", display: "flex", alignItems: "center", color: "var(--color-ink-2)" }}>
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      {count > 0 && (
        <span style={{
          position: "absolute",
          top: -6, right: -8,
          background: "var(--color-red)",
          color: "white",
          borderRadius: "50%",
          width: 17, height: 17,
          fontSize: "0.65rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid var(--color-surface)",
        }}>{count > 9 ? "9+" : count}</span>
      )}
    </Link>
  );
}

export default NotificationBell;
