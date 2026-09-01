/**
 * Side-by-side comparison table for multiple resumes ranked by match score.
 * Props:
 *  - comparison: Array of result objects from the compare API
 */
export default function ComparePanel({ comparison = [] }) {
  if (!comparison.length) return null;

  const recommendationColor = (rec) => {
    if (!rec) return "bg-slate-100 text-slate-500";
    const r = rec.toLowerCase();
    if (r.includes("hire")) return "bg-green-100 text-green-700";
    if (r.includes("strong")) return "bg-emerald-100 text-emerald-700";
    if (r.includes("consider")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-600";
  };

  const scoreColor = (score) =>
    score >= 75
      ? "text-green-600"
      : score >= 50
        ? "text-amber-600"
        : "text-red-500";

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span>📊</span> Resume Comparison Results
        <span className="text-sm font-normal text-slate-500">
          — {comparison.length} candidates ranked
        </span>
      </h2>

      {/* Ranked Cards */}
      <div className="space-y-3">
        {comparison.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border shadow-sm p-5 transition hover:shadow-md
              ${idx === 0 ? "border-green-200 ring-2 ring-green-100" : "border-slate-100"}`}
          >
            {/* Header Row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                    ${idx === 0 ? "bg-yellow-400 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {item.candidateName ||
                      item.fileName ||
                      `Candidate ${item.resumeIndex}`}
                  </p>
                  <p className="text-xs text-slate-400 truncate max-w-xs">
                    {item.fileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Score */}
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${scoreColor(item.matchScore)}`}
                  >
                    {item.matchScore}%
                  </p>
                  <p className="text-xs text-slate-400">match</p>
                </div>

                {/* Recommendation */}
                {item.recommendation && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${recommendationColor(item.recommendation)}`}
                  >
                    {item.recommendation}
                  </span>
                )}
              </div>
            </div>

            {/* Score Bar */}
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${item.matchScore}%`,
                  backgroundColor:
                    item.matchScore >= 75
                      ? "#16a34a"
                      : item.matchScore >= 50
                        ? "#d97706"
                        : "#dc2626",
                }}
              />
            </div>

            {/* Skills + Insights */}
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {/* Matching Skills */}
              {item.matchingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-1.5">
                    ✓ Matching Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.matchingSkills.slice(0, 6).map((s) => (
                      <span
                        key={s}
                        className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {item.matchingSkills.length > 6 && (
                      <span className="text-xs text-slate-400 self-center">
                        +{item.matchingSkills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {item.missingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1.5">
                    ✗ Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.missingSkills.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Strength & Key Gap */}
            {(item.topStrength || item.keyGap) && (
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {item.topStrength && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-amber-700 mb-0.5">
                      ⭐ Top Strength
                    </p>
                    <p className="text-xs text-slate-700">{item.topStrength}</p>
                  </div>
                )}
                {item.keyGap && (
                  <div className="bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-rose-700 mb-0.5">
                      ⚠️ Key Gap
                    </p>
                    <p className="text-xs text-slate-700">{item.keyGap}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
