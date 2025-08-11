import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchNotifications} from "../api/notifications";

export function NotificationBell() {
  const { token, socket } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    fetchNotifications(token).then(res => {
      const unread = res.data.filter(n => !n.read).length;
      setCount(unread);
    }).catch(()=>{});
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", (n) => {
      setCount((c) => c + 1);
    });
    return () => socket.off("notification");
  }, [socket]);

  return (
    <Link to="/notifications" className="relative">
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
      {count > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{count}</span>}
    </Link>
  );
}

export default NotificationBell;
