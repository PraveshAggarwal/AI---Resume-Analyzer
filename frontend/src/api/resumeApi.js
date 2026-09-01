/**
 * API client for the AI Resume Analyzer backend.
 * In development, requests go through Vite's proxy (/api → VITE_API_BASE_URL).
 * VITE_API_BASE_URL is defined in frontend/.env
 */

// Use the env var's origin + /api path so requests route through the Vite proxy.
// Falls back to "/api" so existing dev-server proxy works with no extra config.
const BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

/**
 * Analyze a single resume PDF against a job description.
 * @param {File} resumeFile
 * @param {string} jobDescription
 * @returns {Promise<{ resumeText: string, analysis: object }>}
 */
export async function analyzeResume(resumeFile, jobDescription) {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("jobDescription", jobDescription);

  const res = await fetch(`${BASE}/analyze`, { method: "POST", body: form });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Analysis failed");
  return data;
}

/**
 * Compare multiple resume PDFs against a job description.
 * @param {File[]} resumeFiles
 * @param {string} jobDescription
 * @returns {Promise<{ comparison: object[] }>}
 */
export async function compareResumes(resumeFiles, jobDescription) {
  const form = new FormData();
  resumeFiles.forEach((f) => form.append("resumes", f));
  form.append("jobDescription", jobDescription);

  const res = await fetch(`${BASE}/compare`, { method: "POST", body: form });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Comparison failed");
  return data;
}

/**
 * Download a PDF report of the analysis.
 * @param {object} analysis - Analysis result object
 * @param {string} jobDescription
 */
export async function exportPDF(analysis, jobDescription) {
  const res = await fetch(`${BASE}/export-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, jobDescription }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Export failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-analysis-${Date.now()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
