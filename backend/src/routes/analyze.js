import { Router } from "express";
import multer from "multer";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { analyzeResume, compareResumes } from "../services/gemini.js";

const router = Router();

// Store files in memory (no disk writes needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max per file
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted"));
    }
    cb(null, true);
  },
});

/**
 * POST /api/analyze
 * Body: multipart/form-data { resume: File, jobDescription: string }
 * Returns: Analysis JSON from Gemini
 */
router.post("/analyze", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume PDF uploaded." });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res
        .status(400)
        .json({
          error: "Please provide a job description (min 20 characters).",
        });
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);
    if (!resumeText || resumeText.length < 50) {
      return res
        .status(422)
        .json({
          error:
            "Could not extract readable text from the PDF. Ensure it is not a scanned image.",
        });
    }

    const analysis = await analyzeResume(resumeText, jobDescription);

    res.json({
      success: true,
      resumeText,
      analysis,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/compare
 * Body: multipart/form-data { resumes: File[], jobDescription: string }
 * Returns: Ranked comparison array
 */
router.post("/compare", upload.array("resumes", 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .json({ error: "Upload at least 2 PDF resumes to compare." });
    }

    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res
        .status(400)
        .json({
          error: "Please provide a job description (min 20 characters).",
        });
    }

    const resumeTexts = await Promise.all(
      req.files.map((f) => extractTextFromPDF(f.buffer)),
    );

    const fileNames = req.files.map((f) => f.originalname);
    const comparison = await compareResumes(resumeTexts, jobDescription);

    // Attach original filename to each result
    const enriched = comparison.map((item) => ({
      ...item,
      fileName: fileNames[item.resumeIndex - 1] || `Resume ${item.resumeIndex}`,
    }));

    res.json({ success: true, comparison: enriched });
  } catch (err) {
    next(err);
  }
});

export default router;
