import { Link } from "react-router-dom";

export default function PaperCard({ paper }) {
  return (
    <div className="bg-white border rounded p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link
            to={`/papers/${paper._id}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {paper.title || `${paper.courseCode || "Paper"} - ${paper.examType || "Exam"}`}
          </Link>
          <div className="text-sm text-gray-500 mt-1">
            {[paper.courseCode, paper.academicYear, paper.semester]
              .filter(Boolean)
              .join(" • ")}
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded ml-3 whitespace-nowrap ${
          paper.status === "approved"
            ? "bg-green-100 text-green-700"
            : paper.status === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}>
          {paper.status}
        </span>
      </div>

      {paper.matchedQuestions?.length > 0 && (
        <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
          <span className="font-medium">Matched: </span>
          {paper.matchedQuestions[0].text.slice(0, 120)}
          {paper.matchedQuestions[0].text.length > 120 ? "..." : ""}
        </div>
      )}
    </div>
  );
}
