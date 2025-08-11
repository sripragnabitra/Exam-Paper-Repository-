import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchPendingPapers, approvePaper, rejectPaper } from "../api/admin";

export default function AdminReviewPage() {
  const { token, user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    fetchPendingPapers(token).then(res => setPending(res.data)).catch(()=>{});
  }, [token, user]);

  const handleApprove = async (id) => {
    await approvePaper(id, token);
    setPending(p => p.filter(x => x._id !== id));
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    await rejectPaper(id, reason, token);
    setPending(p => p.filter(x => x._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Pending Papers</h2>
      <div className="space-y-3">
        {pending.map(p => (
          <div key={p._id} className="bg-white border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{p.title || p.courseCode}</div>
                <div className="text-sm text-gray-600">{p.year} • {p.semester}</div>
              </div>
              <div className="space-x-2">
                <button onClick={()=>handleApprove(p._id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                <button onClick={()=>handleReject(p._id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </div>
          </div>
        ))}
        {pending.length===0 && <div className="text-gray-500">No pending papers</div>}
      </div>
    </div>
  );
}
