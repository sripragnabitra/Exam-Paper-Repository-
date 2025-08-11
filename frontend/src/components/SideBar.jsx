import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ links }) {
  const { pathname } = useLocation();

  return (
    <aside className="bg-gray-800 text-white w-60 p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">ExamRepo</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-3 py-2 rounded ${
              pathname === link.to ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
