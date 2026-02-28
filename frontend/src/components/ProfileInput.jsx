const MIN_CHARS = 10;

export default function ProfileInput({ profile, onChange, onSubmit, loading }) {
  const charCount = profile.length;
  const isDisabled = loading || charCount < MIN_CHARS;

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isDisabled) {
      onSubmit();
    }
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        boxShadow: "var(--shadow)",
      }}
    >
      <label
        htmlFor="profile-input"
        style={{
          display: "block",
          fontWeight: 600,
          marginBottom: "0.625rem",
          fontSize: "0.95rem",
        }}
      >
        Friend's Profile
      </label>

      <textarea
        id="profile-input"
        value={profile}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your friend's background, skills, and experience...&#10;&#10;Example: Senior React developer with 5 years of experience, strong TypeScript and AWS skills, worked on large-scale SaaS products."
        rows={5}
        style={{
          width: "100%",
          padding: "0.75rem",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          resize: "vertical",
          minHeight: "120px",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.875rem",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            color: charCount < MIN_CHARS ? "var(--color-red)" : "var(--color-text-muted)",
          }}
        >
          {charCount < MIN_CHARS
            ? `${MIN_CHARS - charCount} more characters needed`
            : `${charCount} characters · Cmd+Enter to submit`}
        </span>

        <button
          onClick={onSubmit}
          disabled={isDisabled}
          style={{
            padding: "0.625rem 1.375rem",
            background: isDisabled ? "#c7d2fe" : "var(--color-primary)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: isDisabled ? "not-allowed" : "pointer",
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) e.target.style.background = "var(--color-primary-hover)";
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) e.target.style.background = "var(--color-primary)";
          }}
        >
          {loading ? "Matching…" : "Find Matching Jobs"}
        </button>
      </div>
    </div>
  );
}
