# 🤖 AI Resume Analyzer

An intelligent full-stack web application that analyzes PDF resumes against job descriptions using **Google Gemini AI**. Get instant match scores, skill gap analysis, and actionable improvement suggestions.

![Tech Stack](https://img.shields.io/badge/React-19-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss) ![Node](https://img.shields.io/badge/Node.js-Express-green?logo=node.js) ![Gemini](https://img.shields.io/badge/Google-Gemini%201.5%20Flash-orange?logo=google)

---

## ✨ Features

| Feature                     | Description                                                   |
| --------------------------- | ------------------------------------------------------------- |
| 📄 **PDF Upload**           | Drag-and-drop or click-to-upload PDF resumes (up to 10 MB)    |
| 🔍 **AI Analysis**          | Gemini 1.5 Flash extracts candidate info and scores the match |
| 📊 **Match Score**          | Animated circular score gauge (0–100%) with color coding      |
| ✅ **Matching Skills**      | Green-highlighted skills present in both resume and JD        |
| ❌ **Missing Skills**       | Red-highlighted skills from the JD not found in the resume    |
| 💡 **AI Suggestions**       | 5 specific, actionable improvement recommendations            |
| 🏷️ **Keyword Highlighting** | Keywords from JD highlighted directly in resume text          |
| 📥 **PDF Export**           | Download a styled analysis report as a PDF                    |
| ⚖️ **Resume Comparison**    | Upload 2–5 resumes and rank candidates side-by-side           |

---

## 📁 Project Structure

```
Ai-Resume-Analyzer/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server entry point
│   │   ├── routes/
│   │   │   ├── analyze.js        # POST /api/analyze, /api/compare
│   │   │   └── export.js         # POST /api/export-pdf
│   │   ├── services/
│   │   │   └── gemini.js         # Google Gemini API integration
│   │   └── utils/
│   │       └── pdfParser.js      # PDF text extraction
│   ├── .env                      # 🔑 Your Gemini API key goes here
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main application shell
│   │   ├── api/
│   │   │   └── resumeApi.js      # API client (fetch-based)
│   │   └── components/
│   │       ├── UploadForm.jsx    # Single resume upload form
│   │       ├── CompareForm.jsx   # Multi-resume upload form
│   │       ├── ResultsPanel.jsx  # Analysis results display
│   │       ├── ComparePanel.jsx  # Ranked comparison cards
│   │       ├── ScoreRing.jsx     # SVG animated score gauge
│   │       └── KeywordHighlighter.jsx  # Resume text with highlights
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 1. Configure the API Key

Open `backend/.env` and replace the placeholder:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

### 2. Install & Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run at **http://localhost:3000**

### 3. Install & Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at **http://localhost:5173**

### 4. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| `POST` | `/api/analyze`    | Analyze a single resume PDF    |
| `POST` | `/api/compare`    | Compare 2–5 resume PDFs        |
| `POST` | `/api/export-pdf` | Generate a PDF analysis report |
| `GET`  | `/api/health`     | Health check                   |

### `POST /api/analyze`

**Form Data:**

- `resume` — PDF file
- `jobDescription` — string (min 20 chars)

**Response:**

```json
{
  "success": true,
  "resumeText": "...",
  "analysis": {
    "candidateInfo": {
      "name": "...",
      "email": "...",
      "phone": "...",
      "summary": "..."
    },
    "matchScore": 78,
    "matchingSkills": ["Python", "REST APIs"],
    "missingSkills": ["Kubernetes", "GraphQL"],
    "suggestions": ["...", "..."],
    "keywords": { "found": ["python"], "missing": ["kubernetes"] },
    "strengthAreas": ["Backend Development"],
    "experienceYears": 4,
    "educationHighlight": "B.Tech Computer Science"
  }
}
```

---

## 🛠️ Tech Stack

**Frontend:**

- React 19 + Vite 8
- Tailwind CSS 4
- Native `fetch` API

**Backend:**

- Node.js + Express 4
- Multer (file upload)
- `pdf-parse` (text extraction)
- `@google/generative-ai` (Gemini SDK)
- `pdfkit` (PDF report generation)

---

## 📝 License

MIT
