import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, updateUserCredits } from "../api/admin";

export default function AdminUsersPage() {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    fetchUsers(token).then(res => setUsers(res.data)).catch(()=>{});
  }, [token, user]);

  const changeCredits = async (id) => {
    const amount = Number(prompt("Amount to add/subtract (use negative to subtract):"));
    if (Number.isNaN(amount)) return;
    await updateUserCredits(id, amount, token);
    setUsers(u => u.map(x => x._id===id ? {...x, credits: x.credits + amount} : x));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Users</h2>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u._id} className="bg-white border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{u.name} • {u.email}</div>
              <div className="text-sm text-gray-600">Credits: {u.credits}</div>
            </div>
            <button onClick={()=>changeCredits(u._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Adjust Credits</button>
          </div>
        ))}
        {users.length === 0 && <div className="text-gray-500">No users</div>}
      </div>
    </div>
  );
}
