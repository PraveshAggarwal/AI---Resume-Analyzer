/**
 * Highlights found/missing keywords in a block of resume text.
 * Props:
 *  - text: string — full resume text
 *  - foundKeywords: string[] — keywords to highlight in green
 *  - missingKeywords: string[] — keywords to highlight in red (in the JD, not resume)
 */
export default function KeywordHighlighter({ text = "", foundKeywords = [] }) {
  if (!text) return null;

  // Build a regex that matches any found keyword (case-insensitive)
  if (foundKeywords.length === 0) {
    return (
      <pre className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed font-mono">
        {text}
      </pre>
    );
  }

  const escaped = foundKeywords.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <pre className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed font-mono">
      {parts.map((part, i) => {
        const isMatch = foundKeywords.some(
          (k) => k.toLowerCase() === part.toLowerCase(),
        );
        return isMatch ? (
          <mark
            key={i}
            className="bg-green-100 text-green-800 rounded px-0.5 font-semibold not-italic"
          >
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </pre>
  );
}
