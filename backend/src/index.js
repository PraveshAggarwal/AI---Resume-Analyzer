import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";
import exportRouter from "./routes/export.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — allow requests from the frontend origin (set via env in production)
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api", analyzeRouter);
app.use("/api", exportRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 AI Resume Analyzer backend running on http://localhost:${PORT}`,
  );
});
