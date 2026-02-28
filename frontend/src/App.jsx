import { useState } from "react";
import ProfileInput from "./components/ProfileInput.jsx";
import JobCard from "./components/JobCard.jsx";
import ResultsToolbar from "./components/ResultsToolbar.jsx";
import AlgorithmInfo from "./components/AlgorithmInfo.jsx";

export default function App() {
  const [profile, setProfile] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("cards");

  async function handleMatch() {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.5rem" }}>
          HR Referrals
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1.05rem" }}>
          Describe a friend's background and we'll match them to the best open roles.
        </p>
      </header>

      {/* Profile input */}
      <ProfileInput
        profile={profile}
        onChange={setProfile}
        onSubmit={handleMatch}
        loading={loading}
      />

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            marginTop: "1rem",
            padding: "0.875rem 1rem",
            background: "var(--color-red-bg)",
            color: "var(--color-red)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <section style={{ marginTop: "2rem" }}>
          <ResultsToolbar count={results.length} view={view} onViewChange={setView} />

          {view === "cards" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {results.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div
              style={{
                marginTop: "1rem",
                padding: "2rem",
                background: "var(--color-surface)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--color-border)",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📋</span>
              <p style={{ marginTop: "0.5rem", fontWeight: 500 }}>Table view coming soon</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>Switch to Cards view to see results.</p>
            </div>
          )}
        </section>
      )}

      {/* Algorithm info */}
      <AlgorithmInfo />
    </div>
  );
}
