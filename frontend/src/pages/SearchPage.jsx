import { useEffect, useState } from "react";
import { searchPapers } from "../api/papers";
import PaperCard from "../components/PaperCard";

export default function SearchPage() {
  const [filters, setFilters] = useState({ courseCode: "", year: "", semester: "", keywords: "" });
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (activeFilters) => {
    setLoading(true);
    setSearched(true);
    try {
      const clean = Object.fromEntries(Object.entries(activeFilters).filter(([, v]) => v));
      const res = await searchPapers(clean);
      const data = res.data;
      if (Array.isArray(data)) { setResults(data); setTotal(data.length); }
      else { setResults(data?.results || []); setTotal(data?.total || 0); }
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { doSearch({}); }, []);

  const handleChange = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => { e.preventDefault(); doSearch(filters); };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }} className="fade-in">
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1.5rem" }}>
        Search Papers
      </h1>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
          {[
            { key: "keywords", placeholder: "🔍  Search questions or topics...", span: true },
            { key: "courseCode", placeholder: "Course code (e.g. CS301)" },
            { key: "year", placeholder: "Year (e.g. 2024)" },
            { key: "semester", placeholder: "Semester (e.g. Fall)" },
          ].map(({ key, placeholder, span }) => (
            <input
              key={key}
              className="input"
              placeholder={placeholder}
              value={filters[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              style={span ? { gridColumn: "1 / -1" } : {}}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" className="btn btn-primary">Search</button>
          {hasFilters && (
            <button type="button" className="btn btn-secondary" onClick={() => { setFilters({ courseCode: "", year: "", semester: "", keywords: "" }); doSearch({}); }}>
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-ink-3)" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          Searching...
        </div>
      )}

      {!loading && searched && (
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-ink-3)", marginBottom: "1rem" }}>
            {total} paper{total !== 1 ? "s" : ""} found
          </div>
          {results.length === 0 ? (
            <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-ink-3)" }}>
              No papers match your search. Try different filters.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {results.map((p) => <PaperCard key={p._id} paper={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
