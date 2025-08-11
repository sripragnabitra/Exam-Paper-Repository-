import { useEffect, useState } from "react";
import { searchPapers } from "../api/papers";
import PaperCard from "../components/PaperCard";
import SearchFilters from "../components/SearchFilters";

export default function SearchPage() {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async (extraFilters = {}) => {
    setLoading(true);
    try {
      const res = await searchPapers({ ...filters, ...extraFilters });
      setResults(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doSearch(); // initial load
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold">Search Papers</h2>

      {/* Filters */}
      <SearchFilters onChange={(f) => { setFilters(f); doSearch(f); }} />

      {/* Results */}
      <div className="mt-4">
        {loading && <div className="text-gray-500">Searching...</div>}
        {!loading && results.length === 0 && (
          <div className="text-gray-500">No results found</div>
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
