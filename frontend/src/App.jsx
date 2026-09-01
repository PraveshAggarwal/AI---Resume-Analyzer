import { useState } from 'react';
import UploadForm from './components/UploadForm.jsx';
import CompareForm from './components/CompareForm.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import ComparePanel from './components/ComparePanel.jsx';

const TABS = [
  { id: 'analyze', label: '🔍 Analyze Resume', desc: 'Single resume vs job description' },
  { id: 'compare', label: '⚖️ Compare Resumes', desc: 'Rank multiple candidates' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);

  const handleAnalyzeResult = (result) => {
    setAnalyzeResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompareResult = (result) => {
    setCompareResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalyzeResult(null);
    setCompareResult(null);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* ─── Header ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">
                AI Resume Analyzer
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
        {!analyzeResult && !compareResult && !loading && (
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">
              Land Your Dream Job{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Faster
              </span>
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              Upload your resume, paste a job description, and get instant AI-powered
              analysis with match scores, skill gaps, and actionable improvements.
            </p>
          </div>
        )}

        {/* ─── Mode Tabs ────────────────────────────────────────────────────────── */}
        {!analyzeResult && !compareResult && (
          <div className="flex gap-3 mb-8 flex-col sm:flex-row">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex-1 rounded-2xl p-4 text-left border-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <p className={`font-semibold text-sm ${activeTab === tab.id ? 'text-blue-700' : 'text-slate-700'}`}>
                  {tab.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{tab.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* ─── Loading State ─────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full" />
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
            </div>
            <div className="text-center">
              <p className="text-slate-700 font-semibold text-lg">Analyzing with Gemini AI…</p>
              <p className="text-slate-400 text-sm mt-1">Extracting skills, scoring match, generating insights…</p>
            </div>
          </div>
        )}

        {/* ─── Form Panel ─────────────────────────────────────────────────────────── */}
        {!loading && !analyzeResult && !compareResult && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            {activeTab === 'analyze' ? (
              <UploadForm onResult={handleAnalyzeResult} onLoading={setLoading} />
            ) : (
              <CompareForm onResult={handleCompareResult} onLoading={setLoading} />
            )}
          </div>
        )}

        {/* ─── Results ────────────────────────────────────────────────────────────── */}
        {!loading && analyzeResult && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
              >
                ← Analyze Another
              </button>
            </div>
            <ResultsPanel result={analyzeResult} />
          </>
        )}

        {!loading && compareResult && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Comparison Results</h2>
              <button
                onClick={handleReset}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1.5 bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition"
              >
                ← Compare Again
              </button>
            </div>
            <ComparePanel comparison={compareResult.comparison} />
          </>
        )}
      </main>
    </div>
  );
}
