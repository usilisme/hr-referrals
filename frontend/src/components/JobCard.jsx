function scoreBadge(score) {
  const pct = Math.round(score * 100);
  if (pct >= 70) return { bg: "var(--color-green-bg)", color: "var(--color-green)", label: `${pct}%` };
  if (pct >= 40) return { bg: "var(--color-yellow-bg)", color: "var(--color-yellow)", label: `${pct}%` };
  return { bg: "var(--color-red-bg)", color: "var(--color-red)", label: `${pct}%` };
}

function typePillColor(type) {
  if (type === "Remote") return { bg: "#dbeafe", color: "#1d4ed8" };
  if (type === "Part-time") return { bg: "#fce7f3", color: "#9d174d" };
  return { bg: "#f1f5f9", color: "#475569" };
}

export default function JobCard({ job }) {
  const badge = scoreBadge(job.score);
  const pill = typePillColor(job.type);
  const matchedSet = new Set((job.matchedKeywords || []).map((k) => k.toLowerCase()));

  function handleRefer() {
    alert(`Referral for "${job.title}" at ${job.company} submitted! (placeholder)`);
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        boxShadow: "var(--shadow)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
    >
      {/* Top row: title + score badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.3 }}>{job.title}</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>{job.company}</p>
        </div>
        <span
          style={{
            flexShrink: 0,
            padding: "0.25rem 0.625rem",
            borderRadius: 999,
            background: badge.bg,
            color: badge.color,
            fontWeight: 700,
            fontSize: "0.875rem",
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
        <span>{job.location}</span>
        <span>·</span>
        <span
          style={{
            padding: "0.15rem 0.5rem",
            borderRadius: 999,
            background: pill.bg,
            color: pill.color,
            fontWeight: 500,
          }}
        >
          {job.type}
        </span>
        <span>·</span>
        <span>{job.salary}</span>
      </div>

      {/* Description snippet */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {job.description}
      </p>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {job.skills.map((skill) => {
          const isMatched = matchedSet.has(skill.toLowerCase()) ||
            [...matchedSet].some((kw) => skill.toLowerCase().includes(kw) || kw.includes(skill.toLowerCase()));
          return (
            <span
              key={skill}
              style={{
                padding: "0.2rem 0.5rem",
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: 500,
                background: isMatched ? "var(--color-matched-bg)" : "#f1f5f9",
                color: isMatched ? "var(--color-matched)" : "var(--color-text-muted)",
                border: isMatched ? "1px solid #c4b5fd" : "1px solid transparent",
              }}
            >
              {skill}
            </span>
          );
        })}
      </div>

      {/* Refer button */}
      <button
        onClick={handleRefer}
        style={{
          marginTop: "auto",
          padding: "0.5rem 1rem",
          background: "var(--color-primary-light)",
          color: "var(--color-primary)",
          border: "1px solid #c7d2fe",
          borderRadius: "var(--radius-sm)",
          fontWeight: 600,
          fontSize: "0.875rem",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#e0e7ff")}
        onMouseLeave={(e) => (e.target.style.background = "var(--color-primary-light)")}
      >
        Refer Friend
      </button>
    </div>
  );
}
