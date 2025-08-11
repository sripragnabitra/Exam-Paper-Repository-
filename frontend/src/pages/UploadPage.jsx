import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { uploadPaper } from "../api/papers";

export default function UploadPage() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({ courseCode: "", year: "", semester: "", examType: "" });
  const [progress, setProgress] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file");
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(metadata).forEach(([k,v]) => fd.append(k, v));
    try {
      const res = await uploadPaper(fd, token, {
        onUploadProgress: (ev) => setProgress(Math.round((ev.loaded/ev.total)*100))
      });
      alert("Uploaded successfully");
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-xl mb-4">Upload Paper</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e)=>setFile(e.target.files[0])} className="mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <input placeholder="Course code" value={metadata.courseCode} onChange={(e)=>setMetadata({...metadata, courseCode: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Year" value={metadata.year} onChange={(e)=>setMetadata({...metadata, year: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Semester" value={metadata.semester} onChange={(e)=>setMetadata({...metadata, semester: e.target.value})} className="border p-2 rounded" />
        <input placeholder="Exam type" value={metadata.examType} onChange={(e)=>setMetadata({...metadata, examType: e.target.value})} className="border p-2 rounded" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>

      {progress > 0 && <div className="mt-3 text-sm text-gray-600">Uploading: {progress}%</div>}
    </form>
  );
}
