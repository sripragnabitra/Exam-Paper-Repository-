import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaper, downloadPaper } from "../api/papers";
import { saveAs } from "file-saver";

export default function PaperView() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);

  useEffect(() => {
    getPaper(id).then(res => setPaper(res.data)).catch(()=>{});
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await downloadPaper(id);
      const blob = new Blob([res.data]);
      saveAs(blob, `${paper._id}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!paper) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">{paper.title || "Paper"}</h2>
      <div className="mt-2">
        <button onClick={handleDownload} className="bg-green-600 text-white px-3 py-1 rounded">Download</button>
      </div>

      <section className="mt-4">
        <h3 className="font-semibold">Metadata</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>Course: {paper.courseCode}</li>
          <li>Year: {paper.year}</li>
          <li>Semester: {paper.semester}</li>
          <li>Status: {paper.status}</li>
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold">Questions</h3>
        <div className="space-y-2 mt-2">
          {(paper.questions || []).map((q, i) => (
            <div key={q._id || i} className="bg-white border rounded p-3">
              <div className="font-medium">Q{q.questionNumber || i+1}</div>
              <div className="text-sm text-gray-800 mt-1">{q.text}</div>
              <div className="text-xs text-gray-500 mt-2">Topics: {(q.topics || []).join(", ")}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
