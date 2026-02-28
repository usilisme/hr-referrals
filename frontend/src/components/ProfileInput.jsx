import { useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

const MIN_CHARS = 10;

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, (_, i) =>
      pdf.getPage(i + 1).then((page) =>
        page.getTextContent().then((content) =>
          content.items.map((item) => item.str).join(" ")
        )
      )
    )
  );
  return pages.join("\n").replace(/\s+/g, " ").trim();
}

export default function ProfileInput({ profile, onChange, onSubmit, loading }) {
  const fileInputRef = useRef(null);
  const [pdfState, setPdfState] = useState(null); // null | "parsing" | { name, pages } | "error"
  const charCount = profile.length;
  const isDisabled = loading || charCount < MIN_CHARS || pdfState === "parsing";

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isDisabled) {
      onSubmit();
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so same file can be re-selected
    e.target.value = "";

    setPdfState("parsing");
    try {
      const text = await extractPdfText(file);
      onChange(text);
      setPdfState({ name: file.name });
    } catch {
      setPdfState("error");
    }
  }

  function handleClearPdf() {
    setPdfState(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      {/* Label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.625rem",
        }}
      >
        <label
          htmlFor="profile-input"
          style={{ fontWeight: 600, fontSize: "0.95rem" }}
        >
          Friend's Profile
        </label>

        {/* PDF upload button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {pdfState && pdfState !== "parsing" && pdfState !== "error" && (
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--color-text-muted)",
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={pdfState.name}
            >
              {pdfState.name}
            </span>
          )}
          {pdfState === "error" && (
            <span style={{ fontSize: "0.78rem", color: "var(--color-red)" }}>
              Failed to parse PDF
            </span>
          )}
          {pdfState && pdfState !== "parsing" && (
            <button
              onClick={handleClearPdf}
              title="Clear PDF"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                fontSize: "0.8rem",
                padding: "0.1rem 0.3rem",
              }}
            >
              ✕
            </button>
          )}
          <input
            ref={fileInputRef}
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="pdf-upload"
            style={{
              padding: "0.35rem 0.75rem",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: pdfState === "parsing" ? "wait" : "pointer",
              background: "var(--color-surface)",
              color: "var(--color-text-muted)",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {pdfState === "parsing" ? "Parsing…" : "Upload PDF"}
          </label>
        </div>
      </div>

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
