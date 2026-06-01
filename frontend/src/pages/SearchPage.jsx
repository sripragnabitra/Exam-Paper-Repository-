import { useEffect, useState } from "react";
import { searchPapers } from "../api/papers";
import PaperCard from "../components/PaperCard";
import SearchFilters from "../components/SearchFilters";

export default function SearchPage() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const doSearch = async (activeFilters = {}) => {
    setLoading(true);
    try {
      const res = await searchPapers(activeFilters);
      const data = res.data;
      // API returns { results, total } or direct array
      if (Array.isArray(data)) {
        setResults(data);
        setTotal(data.length);
      } else {
        setResults(data?.results || []);
        setTotal(data?.total || 0);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doSearch();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold">Search Papers</h2>

      <SearchFilters
        onChange={(f) => {
          setFilters(f);
          doSearch(f);
        }}
      />

      <div className="mt-4">
        {loading && <div className="text-gray-500 py-4 text-center">Searching...</div>}
        {!loading && results.length === 0 && (
          <div className="text-gray-500 py-8 text-center bg-white border rounded">
            No papers found. Try different filters.
          </div>
        )}
        {!loading && results.length > 0 && (
          <div className="text-sm text-gray-500 mb-2">{total} paper{total !== 1 ? "s" : ""} found</div>
        )}
        <div className="grid gap-3">
          {results.map((p) => (
            <PaperCard key={p._id} paper={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
