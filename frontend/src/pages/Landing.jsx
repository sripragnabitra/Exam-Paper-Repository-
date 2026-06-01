import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Landing() {
  const { user, googleAuthUrl } = useContext(AuthContext);

  return (
    <div style={{ minHeight: "calc(100vh - 60px)" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #f8f6f1 0%, #eef4ff 100%)",
        borderBottom: "1px solid var(--color-border)",
        padding: "5rem 1.5rem 4rem",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          background: "var(--color-accent-light)",
          color: "var(--color-accent)",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "6px 16px",
          borderRadius: 99,
          marginBottom: "1.5rem",
          border: "1px solid rgba(37,99,168,0.15)",
        }}>
          Student Resource Platform
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          color: "var(--color-ink)",
          margin: "0 auto 1.25rem",
          maxWidth: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}>
          Every exam paper,<br />
          <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>in one place.</span>
        </h1>

        <p style={{
          color: "var(--color-ink-2)",
          fontSize: "1.1rem",
          maxWidth: 520,
          margin: "0 auto 2.5rem",
          lineHeight: 1.7,
        }}>
          Upload past papers, earn credits, and access a searchable repository of exam questions — built for students, by students.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
                Go to Dashboard →
              </Link>
              <Link to="/search" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
                Browse Papers
              </Link>
            </>
          ) : (
            <>
              <a href={googleAuthUrl} className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "1rem", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Get Started Free
              </a>
              <Link to="/search" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
                Browse Papers
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {[
            {
              icon: "📤",
              title: "Upload & Contribute",
              desc: "Share past exam papers with your campus. Every approved upload earns you credits you can spend on premium papers.",
              color: "var(--color-accent-light)",
            },
            {
              icon: "🔍",
              title: "Search by Anything",
              desc: "Find papers by course code, semester, year, or even search within question text for specific topics.",
              color: "var(--color-green-light)",
            },
            {
              icon: "🏆",
              title: "Credits System",
              desc: "A merit-based economy. The more you contribute, the more access you get. Fair for everyone.",
              color: "var(--color-yellow-light)",
            },
          ].map((f) => (
            <div key={f.title} className="card" style={{ padding: "1.75rem" }}>
              <div style={{
                width: 48,
                height: 48,
                background: f.color,
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.15rem",
                marginBottom: "0.5rem",
                color: "var(--color-ink)",
              }}>{f.title}</h3>
              <p style={{ color: "var(--color-ink-2)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            marginBottom: "2.5rem",
            color: "var(--color-ink)",
          }}>How it works</h2>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { step: "1", label: "Sign in with Google" },
              { step: "2", label: "Upload a past paper" },
              { step: "3", label: "Admin reviews & approves" },
              { step: "4", label: "You earn credits" },
            ].map((s, i, arr) => (
              <div key={s.step} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1rem",
                    margin: "0 auto 8px",
                  }}>{s.step}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-ink-2)", maxWidth: 100 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ color: "var(--color-border-strong)", fontSize: "1.25rem", marginBottom: 24 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
