import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Extracts plain text from a PDF file buffer.
 * @param {Buffer} buffer - Raw PDF file buffer
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (err) {
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}
