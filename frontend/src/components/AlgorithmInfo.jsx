import { useState } from "react";

const roadmap = [
  {
    version: "V1 (current)",
    algorithm: "Keyword overlap + skill matching",
    pros: "Fast, transparent, zero dependencies",
    cons: 'Misses synonyms ("JS" ≠ "JavaScript"), order-insensitive',
    current: true,
  },
  {
    version: "V2",
    algorithm: "TF-IDF weighting",
    pros: "Rare important words count more, handles corpus-wide term frequency",
    cons: "Still lexical, no semantic understanding",
    current: false,
  },
  {
    version: "V3",
    algorithm: 'Semantic similarity via embeddings (e.g. OpenAI text-embedding-3-small)',
    pros: 'Understands "ML engineer" ≈ "machine learning developer"',
    cons: "Requires API call, adds cost and latency",
    current: false,
  },
  {
    version: "V4",
    algorithm: "LLM-based structured scoring",
    pros: "Holistic fit, explains reasoning, handles nuance",
    cons: "Highest cost and latency, needs prompt engineering",
    current: false,
  },
];

export default function AlgorithmInfo() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        marginTop: "2.5rem",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        background: "var(--color-surface)",
        overflow: "hidden",
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.25rem",
          border: "none",
          background: "transparent",
          textAlign: "left",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: "pointer",
          color: "var(--color-text)",
        }}
        aria-expanded={open}
      >
        <span>How matching works & algorithm roadmap</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: "0.8rem" }}>
          ▼
        </span>
      </button>

      {/* Collapsible content */}
      {open && (
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
            The current algorithm (<strong>V1</strong>) uses keyword overlap scoring. It tokenizes your profile
            description and computes two sub-scores for each job: a <strong>skill score</strong> (weight 60%) based
            on how many of the job's required skills appear in the profile, and a <strong>description score</strong>{" "}
            (weight 40%) using Jaccard similarity between profile tokens and job description tokens. The final score
            is clamped to [0, 1] and displayed as a percentage.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Version", "Algorithm", "Pros", "Cons"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.625rem 0.875rem",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "var(--color-text-muted)",
                        borderBottom: "1px solid var(--color-border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roadmap.map((row) => (
                  <tr
                    key={row.version}
                    style={{
                      background: row.current ? "var(--color-primary-light)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.625rem 0.875rem",
                        borderBottom: "1px solid var(--color-border)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        color: row.current ? "var(--color-primary)" : "var(--color-text)",
                      }}
                    >
                      {row.version}
                    </td>
                    <td style={{ padding: "0.625rem 0.875rem", borderBottom: "1px solid var(--color-border)" }}>
                      {row.algorithm}
                    </td>
                    <td
                      style={{
                        padding: "0.625rem 0.875rem",
                        borderBottom: "1px solid var(--color-border)",
                        color: "var(--color-green)",
                      }}
                    >
                      {row.pros}
                    </td>
                    <td
                      style={{
                        padding: "0.625rem 0.875rem",
                        borderBottom: "1px solid var(--color-border)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {row.cons}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
