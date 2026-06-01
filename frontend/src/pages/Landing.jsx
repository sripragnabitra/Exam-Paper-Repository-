import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Landing() {
  const { user, googleAuthUrl } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">📚 Exam Paper Repository</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Upload, search, and access exam papers. Earn credits by contributing papers and use them to download.
      </p>
      {user ? (
        <div className="space-x-4">
          <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700">
            Go to Dashboard
          </Link>
          <Link to="/search" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-300">
            Browse Papers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <a
            href={googleAuthUrl}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Login with Google
          </a>
          <div>
            <Link to="/search" className="text-blue-600 underline text-sm">
              Browse papers without logging in
            </Link>
          </div>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl w-full">
        {[
          { icon: "📤", title: "Upload Papers", desc: "Share exam papers and earn credits for every approved upload." },
          { icon: "🔍", title: "Smart Search", desc: "Search by course code, semester, year, or even question keywords." },
          { icon: "💰", title: "Credits System", desc: "Earn credits by uploading. Use them to access premium papers." },
        ].map((f) => (
          <div key={f.title} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-semibold">{f.title}</div>
            <div className="text-sm text-gray-600 mt-1">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
