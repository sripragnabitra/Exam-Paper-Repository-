import { useState } from "react";

export default function UploadForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    courseCode: "",
    year: "",
    semester: "",
    examType: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    onSubmit(file, metadata);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-sm space-y-4"
    >
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="block"
      />
      {["courseCode", "year", "semester", "examType"].map((field) => (
        <input
          key={field}
          placeholder={field}
          value={metadata[field]}
          onChange={(e) =>
            setMetadata({ ...metadata, [field]: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
      ))}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
