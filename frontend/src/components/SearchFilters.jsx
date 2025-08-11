import { useState } from "react";

export default function SearchFilters({ onChange }) {
  const [filters, setFilters] = useState({
    courseCode: "",
    year: "",
    semester: "",
    topic: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onChange(newFilters);
  };

  return (
    <div className="bg-white p-3 border rounded shadow-sm flex flex-wrap gap-2">
      <input
        name="courseCode"
        placeholder="Course code"
        value={filters.courseCode}
        onChange={handleChange}
        className="border p-2 rounded flex-1 min-w-[120px]"
      />
      <input
        name="year"
        placeholder="Year"
        value={filters.year}
        onChange={handleChange}
        className="border p-2 rounded flex-1 min-w-[80px]"
      />
      <input
        name="semester"
        placeholder="Semester"
        value={filters.semester}
        onChange={handleChange}
        className="border p-2 rounded flex-1 min-w-[80px]"
      />
      <input
        name="topic"
        placeholder="Topic"
        value={filters.topic}
        onChange={handleChange}
        className="border p-2 rounded flex-1 min-w-[120px]"
      />
    </div>
  );
}
