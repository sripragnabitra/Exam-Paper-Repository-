import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchNotifications, markRead } from "../api/notifications";

export default function NotificationsPage() {
  const { token } = useContext(AuthContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetchNotifications(token).then(res => setList(res.data)).catch(()=>{});
  }, [token]);

  const handleMark = async (id) => {
    await markRead(id, token);
    setList(l => l.map(n => n._id===id ? {...n, read:true} : n));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Notifications</h2>
      <div className="space-y-2">
        {list.map(n => (
          <div key={n._id} className={`p-3 rounded ${n.read ? "bg-gray-100" : "bg-white border"}`}>
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-gray-600">{n.body}</div>
              </div>
              {!n.read && <button onClick={()=>handleMark(n._id)} className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Mark read</button>}
            </div>
          </div>
        ))}
        {list.length===0 && <div className="text-gray-500">No notifications</div>}
      </div>
    </div>
  );
}
