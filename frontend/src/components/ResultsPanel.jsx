import { useState } from "react";
import ScoreRing from "./ScoreRing.jsx";
import KeywordHighlighter from "./KeywordHighlighter.jsx";
import { exportPDF } from "../api/resumeApi.js";

const TABS = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "keywords", icon: "🏷️", label: "Keywords" },
  { id: "resumeText", icon: "📄", label: "Resume Text" },
];

function InfoBadge({ icon, text }) {
  if (!text || text === "Not found") return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
      <span>{icon}</span>
      {text}
    </span>
  );
}

function SkillTag({ label, variant = "green" }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-600 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <span className="text-base">{icon}</span>
        <h3 className="font-semibold text-sm text-slate-700">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ResultsPanel({ result }) {
  const { analysis, resumeText } = result;
  const [showFullText, setShowFullText] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportPDF(analysis, result.jobDescription || "");
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const info = analysis.candidateInfo || {};
  const score = analysis.matchScore ?? 0;

  // Colour-coded match bar
  const matchBarColor =
    score >= 75
      ? "from-emerald-400 to-emerald-600"
      : score >= 50
      ? "from-amber-400 to-amber-600"
      : "from-red-400 to-red-600";

  return (
    <div className="space-y-5">
      {/* ── Hero card ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Top gradient accent bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${matchBarColor}`} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Left: candidate info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 leading-tight truncate">
                  {info.name || "Candidate"}
                </h2>
                {/* contact badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <InfoBadge icon="✉️" text={info.email} />
                  <InfoBadge icon="📞" text={info.phone} />
                  <InfoBadge icon="📍" text={info.location} />
                  {analysis.experienceYears != null && (
                    <InfoBadge
                      icon="💼"
                      text={`${analysis.experienceYears} yrs experience`}
                    />
                  )}
                  {analysis.educationHighlight && (
                    <InfoBadge icon="🎓" text={analysis.educationHighlight} />
                  )}
                </div>
              </div>

              {/* Summary */}
              {info.summary && (
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  {info.summary}
                </p>
              )}

              {/* Quick-stat row */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <span>✓</span>
                  <span>{analysis.matchingSkills?.length ?? 0} Matching</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                  <span>✗</span>
                  <span>{analysis.missingSkills?.length ?? 0} Missing</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                  <span>💡</span>
                  <span>{analysis.suggestions?.length ?? 0} Suggestions</span>
                </div>
              </div>
            </div>

            {/* Right: score ring */}
            <div className="flex-none flex flex-col items-center gap-3 sm:pl-4">
              <ScoreRing score={score} size={160} />
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm disabled:opacity-60 whitespace-nowrap"
              >
                {exporting ? "⏳ Generating…" : "📥 Export PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 px-3 rounded-lg transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Skills — side by side on sm+ */}
          <div className="grid sm:grid-cols-2 gap-4">
            <SectionCard
              title={`Matching Skills (${analysis.matchingSkills?.length ?? 0})`}
              icon="✅"
            >
              {analysis.matchingSkills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.matchingSkills.map((skill) => (
                    <SkillTag key={skill} label={skill} variant="green" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No matching skills found.</p>
              )}
            </SectionCard>

            <SectionCard
              title={`Missing Skills (${analysis.missingSkills?.length ?? 0})`}
              icon="❌"
            >
              {analysis.missingSkills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <SkillTag key={skill} label={skill} variant="red" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No missing skills identified.</p>
              )}
            </SectionCard>
          </div>

          {/* Suggestions */}
          {analysis.suggestions?.length > 0 && (
            <SectionCard title="Improvement Suggestions" icon="💡">
              <ol className="space-y-3">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <span className="shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          {/* Strength Areas */}
          {analysis.strengthAreas?.length > 0 && (
            <SectionCard title="Strength Areas" icon="⭐">
              <div className="flex flex-wrap gap-2">
                {analysis.strengthAreas.map((area) => (
                  <SkillTag key={area} label={area} variant="amber" />
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* ── Tab: Keywords ────────────────────────────────────────────────────── */}
      {activeTab === "keywords" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionCard title="Found in Resume" icon="✅">
            {analysis.keywords?.found?.length ? (
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.found.map((kw) => (
                  <SkillTag key={kw} label={kw} variant="green" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">None identified.</p>
            )}
          </SectionCard>
          <SectionCard title="Missing from Resume" icon="❌">
            {analysis.keywords?.missing?.length ? (
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.missing.map((kw) => (
                  <SkillTag key={kw} label={kw} variant="red" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No missing keywords.</p>
            )}
          </SectionCard>
        </div>
      )}

      {/* ── Tab: Resume Text ──────────────────────────────────────────────────── */}
      {activeTab === "resumeText" && (
        <SectionCard
          title="Extracted Resume Text"
          icon="📄"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Green = Matched Keywords
            </span>
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              {showFullText ? "Show less ↑" : "Show all ↓"}
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showFullText ? "max-h-[2000px]" : "max-h-72"
            }`}
          >
            <KeywordHighlighter
              text={resumeText}
              foundKeywords={analysis.keywords?.found || []}
            />
          </div>
          {!showFullText && (
            <div className="bg-gradient-to-t from-white to-transparent h-10 -mt-10 relative pointer-events-none" />
          )}
        </SectionCard>
      )}
    </div>
  );
}
