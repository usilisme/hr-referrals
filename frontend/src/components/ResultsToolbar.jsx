import { useState } from "react";

export default function ResultsToolbar({ count, view, onViewChange }) {
  const [toastVisible, setToastVisible] = useState(false);

  function handleExport() {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem",
        position: "relative",
      }}
    >
      {/* Count + algorithm badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexGrow: 1 }}>
        <span style={{ fontWeight: 600, fontSize: "1rem" }}>
          {count} job{count !== 1 ? "s" : ""} found
        </span>
        <span
          style={{
            padding: "0.2rem 0.6rem",
            borderRadius: 999,
            background: "#f0fdf4",
            color: "#15803d",
            fontSize: "0.75rem",
            fontWeight: 600,
            border: "1px solid #bbf7d0",
          }}
        >
          V1: Keyword Match
        </span>
      </div>

      {/* View toggle */}
      <div
        style={{
          display: "flex",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
        }}
      >
        {["cards", "table"].map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            style={{
              padding: "0.375rem 0.875rem",
              border: "none",
              background: view === v ? "var(--color-primary)" : "var(--color-surface)",
              color: view === v ? "#fff" : "var(--color-text-muted)",
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "capitalize",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {v === "cards" ? "Cards" : "Table"}
          </button>
        ))}
      </div>

      {/* Export CSV */}
      <button
        onClick={handleExport}
        style={{
          padding: "0.375rem 0.875rem",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-surface)",
          color: "var(--color-text-muted)",
          fontSize: "0.875rem",
          fontWeight: 500,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#f8fafc")}
        onMouseLeave={(e) => (e.target.style.background = "var(--color-surface)")}
      >
        Export CSV
      </button>

      {/* Toast */}
      {toastVisible && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 0.5rem)",
            background: "#1e293b",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            zIndex: 10,
            boxShadow: "var(--shadow-md)",
          }}
        >
          Export coming soon
        </div>
      )}
    </div>
  );
}
