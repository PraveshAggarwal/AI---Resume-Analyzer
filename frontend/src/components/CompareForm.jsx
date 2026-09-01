import { useState } from "react";
import { compareResumes } from "../api/resumeApi.js";

export default function CompareForm({ onResult, onLoading }) {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");

  const handleFiles = (newFiles) => {
    const pdfs = [...newFiles].filter((f) => f.type === "application/pdf");
    if (pdfs.length !== newFiles.length) {
      setError("Only PDF files are accepted.");
    } else {
      setError("");
    }
    setFiles((prev) => {
      const combined = [...prev, ...pdfs];
      return combined.slice(0, 5);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (files.length < 2)
      return setError("Upload at least 2 resumes to compare.");
    if (jobDescription.trim().length < 20)
      return setError("Job description must be at least 20 characters.");

    try {
      onLoading(true);
      const result = await compareResumes(files, jobDescription);
      onResult(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">
            Resume PDFs <span className="text-slate-400">(2–5 files)</span>
          </label>
          <span className="text-xs text-slate-400">
            {files.length}/5 uploaded
          </span>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-2 mb-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">📄</span>
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400 shrink-0">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-slate-400 hover:text-red-500 transition ml-2 shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add More */}
        {files.length < 5 && (
          <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-5 text-center cursor-pointer transition block">
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <span className="text-2xl">➕</span>
            <p className="text-sm text-slate-600 font-medium mt-1">
              {files.length === 0
                ? "Upload 2–5 resume PDFs"
                : "Add more resumes"}
            </p>
          </label>
        )}
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description to rank all candidates against..."
          rows={6}
          className="w-full border border-slate-300 rounded-xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>⚖️</span>
        Compare All Resumes
      </button>
    </form>
  );
}
