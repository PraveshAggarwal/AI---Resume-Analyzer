import { useState, useCallback } from "react";
import { analyzeResume } from "../api/resumeApi.js";

export default function UploadForm({ onResult, onLoading }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) return setError("Please upload a resume PDF.");
    if (jobDescription.trim().length < 20)
      return setError("Job description must be at least 20 characters.");

    try {
      onLoading(true);
      const result = await analyzeResume(resumeFile, jobDescription);
      onResult(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : resumeFile
                ? "border-green-400 bg-green-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        onClick={() => document.getElementById("pdf-input").click()}
      >
        <input
          id="pdf-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {resumeFile ? (
          <>
            <div className="text-4xl mb-2">📄</div>
            <p className="font-semibold text-green-700">{resumeFile.name}</p>
            <p className="text-sm text-green-600 mt-1">
              {(resumeFile.size / 1024).toFixed(1)} KB — click to change
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">☁️</div>
            <p className="font-semibold text-slate-700">
              Drag & drop your resume PDF here
            </p>
            <p className="text-sm text-slate-500 mt-1">or click to browse</p>
            <p className="text-xs text-slate-400 mt-2">PDF only · Max 10 MB</p>
          </>
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
          placeholder="Paste the full job description here — including required skills, qualifications, and responsibilities..."
          rows={7}
          className="w-full border border-slate-300 rounded-xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
        />
        <p className="text-xs text-slate-400 mt-1">
          {jobDescription.length} characters
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>🔍</span>
        Analyze Resume with AI
      </button>
    </form>
  );
}
