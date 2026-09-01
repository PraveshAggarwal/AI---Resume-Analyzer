import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-3.1-flash-lite" });

/**
 * Builds the structured analysis prompt sent to Gemini.
 */
function buildAnalysisPrompt(resumeText, jobDescription) {
  return `
You are an expert resume analyst and career coach. Analyze the following resume against the provided job description.

RESUME TEXT:
---
${resumeText}
---

JOB DESCRIPTION:
---
${jobDescription}
---

Respond ONLY with a valid JSON object (no markdown, no code fences, no extra text) matching this exact structure:
{
  "candidateInfo": {
    "name": "Full name or 'Not found'",
    "email": "Email or 'Not found'",
    "phone": "Phone or 'Not found'",
    "location": "Location or 'Not found'",
    "summary": "2-3 sentence professional summary of the candidate"
  },
  "matchScore": <integer 0-100>,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "suggestions": [
    "Specific, actionable suggestion 1",
    "Specific, actionable suggestion 2",
    "Specific, actionable suggestion 3",
    "Specific, actionable suggestion 4",
    "Specific, actionable suggestion 5"
  ],
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "strengthAreas": ["area1", "area2"],
  "experienceYears": <integer or null>,
  "educationHighlight": "Highest relevant degree or certification"
}

Rules:
- matchScore must reflect how well the resume matches the job description (100 = perfect match)
- matchingSkills: skills explicitly present in both resume and job description
- missingSkills: important skills in the job description not found in the resume
- suggestions: concrete, specific improvements — not generic advice
- keywords.found: exact keywords/phrases from the JD that appear in the resume
- keywords.missing: important JD keywords absent from the resume
`;
}

/**
 * Builds the comparison prompt for multiple resumes.
 */
function buildComparePrompt(resumeTexts, jobDescription) {
  const resumeBlocks = resumeTexts
    .map((text, i) => `RESUME ${i + 1}:\n---\n${text}\n---`)
    .join("\n\n");

  return `
You are an expert resume analyst. Compare the following ${resumeTexts.length} resumes against the job description and rank them.

${resumeBlocks}

JOB DESCRIPTION:
---
${jobDescription}
---

Respond ONLY with a valid JSON array (no markdown, no code fences, no extra text). Each element represents one resume in order:
[
  {
    "resumeIndex": 1,
    "candidateName": "Name or 'Candidate 1'",
    "matchScore": <integer 0-100>,
    "matchingSkills": ["skill1"],
    "missingSkills": ["skill2"],
    "topStrength": "Single strongest asset",
    "keyGap": "Single most critical gap",
    "recommendation": "Hire / Strong Consider / Consider / Reject"
  }
]

Rank from highest to lowest matchScore.
`;
}

/**
 * Analyzes a single resume against a job description.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Promise<object>} Parsed analysis result
 */
export async function analyzeResume(resumeText, jobDescription) {
  const prompt = buildAnalysisPrompt(resumeText, jobDescription);

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Strip any accidental markdown fences
    const jsonStr = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(jsonStr);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error("Gemini returned invalid JSON. Please try again.");
    }
    throw new Error(`Gemini API error: ${err.message}`);
  }
}

/**
 * Compares multiple resumes against a job description.
 * @param {string[]} resumeTexts
 * @param {string} jobDescription
 * @returns {Promise<object[]>} Ranked comparison results
 */
export async function compareResumes(resumeTexts, jobDescription) {
  const prompt = buildComparePrompt(resumeTexts, jobDescription);

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    const jsonStr = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    return JSON.parse(jsonStr);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error("Gemini returned invalid JSON. Please try again.");
    }
    throw new Error(`Gemini API error: ${err.message}`);
  }
}
