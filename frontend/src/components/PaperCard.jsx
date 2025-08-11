import { Link } from "react-router-dom";

export default function PaperCard({ paper }) {
  return (
    <div className="bg-white border rounded p-3 shadow-sm">
      <div className="flex justify-between">
        <div>
          <Link to={`/papers/${paper._id}`} className="font-semibold text-blue-600">
            {paper.title || `${paper.courseCode || ""} - ${paper.examType || ""}`}
          </Link>
          <div className="text-sm text-gray-600">{paper.year} • {paper.semester}</div>
        </div>
        <div className="text-sm text-gray-500">{paper.status}</div>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        {paper.summary || (paper.questions?.slice?.(0,1).map(q=>q.text).join(" ") || "")}
      </div>
    </div>
  );
}
