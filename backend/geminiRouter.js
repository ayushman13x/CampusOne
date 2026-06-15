require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const allowedTools = [
  "search_library_books",
  "get_cafeteria_info",
  "search_events",
  "get_academic_info",
  "search_notices",
  "unknown",
];

function extractJson(text) {
  const cleaned = String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Gemini did not return valid JSON");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function normalizeIntent(intent) {
  if (!intent) return "unknown";

  const value = String(intent).toLowerCase().trim();

  if (value === "library" || value === "book" || value === "books") {
    return "library";
  }

  if (
    value === "cafeteria" ||
    value === "food" ||
    value === "menu" ||
    value === "lunch" ||
    value === "canteen"
  ) {
    return "cafeteria";
  }

  if (
    value === "events" ||
    value === "event" ||
    value === "workshop" ||
    value === "club" ||
    value === "fest" ||
    value === "registration"
  ) {
    return "events";
  }

  if (
    value === "academics" ||
    value === "academic" ||
    value === "exam" ||
    value === "attendance" ||
    value === "syllabus" ||
    value === "policy"
  ) {
    return "academics";
  }

  if (
    value === "notices" ||
    value === "notice" ||
    value === "scholarship" ||
    value === "deadline" ||
    value === "holiday" ||
    value === "maintenance" ||
    value === "announcement" ||
    value === "announcements"
  ) {
    return "notices";
  }

  return "unknown";
}

async function detectIntentWithGemini(question) {

  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are the routing layer for CampusOne, a campus dashboard assistant.

Your task is to choose exactly one backend tool for the user's campus question.
Do not answer the question directly.

Available tools:
- search_library_books
- get_cafeteria_info
- search_events
- get_academic_info
- search_notices
- unknown

Return only valid JSON. Do not use markdown.

Use this exact JSON shape:
{
  "tool": "search_library_books",
  "intent": "library",
  "arguments": {
    "query": "short useful search query"
  },
  "reason": "short reason"
}

Allowed intent values:
library, cafeteria, events, academics, notices, unknown

Important:
- Do not return intent values like scholarship, deadline, exam, food, workshop, notice, academic, or event.
- Convert those meanings into one of the allowed intent values.

Tool selection rules:
- Books, authors, availability, shelves, library resources => search_library_books, intent library
- Food, menu, lunch, dinner, cafeteria timing, crowd, nearest cafeteria => get_cafeteria_info, intent cafeteria
- Workshops, robotics workshop, clubs, tech fest, cultural events, sports, registrations => search_events, intent events
- Exams, syllabus, attendance, academic calendar, academic rules => get_academic_info, intent academics
- Scholarship, deadline, holiday, maintenance, hostel notices, lost and found, announcements => search_notices, intent notices
- Anything unrelated to campus => unknown, intent unknown

User question: "${question}"
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText =
      typeof response.text === "function" ? response.text() : response.text;

    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText);

    if (!allowedTools.includes(parsed.tool)) {
      throw new Error(`Invalid tool returned: ${parsed.tool}`);
    }

    const intent = normalizeIntent(parsed.intent);

    return {
      tool: parsed.tool,
      intent,
      searchQuery: parsed.arguments?.query || question,
      reason: parsed.reason || "CampusOne selected the most relevant source.",
    };
  } catch (error) {
    console.error("Gemini routing failed:", error.message);
    return null;
  }
}

module.exports = { detectIntentWithGemini };