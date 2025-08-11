import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchPapers } from "../api/papers";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    searchPapers({ limit: 5 }).then(res => setRecent(res.data)).catch(()=>{});
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome{user ? `, ${user.name}` : ""}</h1>
          <div className="text-sm text-gray-600">Credits: {user?.credits ?? 0}</div>
        </div>
        <div>
          <Link to="/subscription" className="bg-indigo-600 text-white px-3 py-2 rounded">Subscription</Link>
        </div>
      </div>

      <section>
        <h3 className="font-semibold mb-2">Recent Papers</h3>
        <div className="space-y-2">
          {recent.length === 0 && <div className="text-gray-500">No recent papers</div>}
          {recent.map(p => (
            <div key={p._id} className="bg-white border rounded p-3">
              <Link to={`/papers/${p._id}`} className="font-medium text-blue-600">{p.title || p.courseCode}</Link>
              <div className="text-sm text-gray-600">{p.year} • {p.semester}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
