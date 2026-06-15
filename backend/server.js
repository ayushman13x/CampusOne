const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const { detectIntentWithGemini } = require("./geminiRouter");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const MCP_SERVERS = {
  library: process.env.LIBRARY_MCP_URL,
  cafeteria: process.env.CAFETERIA_MCP_URL,
  events: process.env.EVENTS_MCP_URL,
  academics: process.env.ACADEMICS_MCP_URL,
  notices: process.env.NOTICES_MCP_URL,
};

app.get("/", (req, res) => {
  res.json({
    service: "CampusOne Backend",
    status: "running",
  });
});

function normalizeIntent(intent) {
  if (!intent) return "unknown";

  const value = String(intent).toLowerCase().trim();

  if (value === "academic") return "academics";
  if (value === "notice") return "notices";
  if (value === "event") return "events";

  if (
    value === "scholarship" ||
    value === "deadline" ||
    value === "holiday" ||
    value === "maintenance" ||
    value === "announcement" ||
    value === "announcements"
  ) {
    return "notices";
  }

  if (
    value === "exam" ||
    value === "attendance" ||
    value === "syllabus" ||
    value === "policy"
  ) {
    return "academics";
  }

  if (
    value === "food" ||
    value === "menu" ||
    value === "lunch" ||
    value === "canteen"
  ) {
    return "cafeteria";
  }

  if (
    value === "workshop" ||
    value === "club" ||
    value === "registration" ||
    value === "fest"
  ) {
    return "events";
  }

  if (value === "book" || value === "books" || value === "library") {
    return "library";
  }

  return value;
}

function detectIntent(question) {
  const q = question.toLowerCase();

  if (
    q.includes("book") ||
    q.includes("library") ||
    q.includes("author") ||
    q.includes("shelf") ||
    q.includes("available")
  ) {
    return "library";
  }

  if (
    q.includes("food") ||
    q.includes("lunch") ||
    q.includes("menu") ||
    q.includes("cafeteria") ||
    q.includes("canteen") ||
    q.includes("eat") ||
    q.includes("crowd")
  ) {
    return "cafeteria";
  }

  if (
    q.includes("event") ||
    q.includes("workshop") ||
    q.includes("club") ||
    q.includes("registration") ||
    q.includes("fest") ||
    q.includes("robotics")
  ) {
    return "events";
  }

  if (
    q.includes("exam") ||
    q.includes("syllabus") ||
    q.includes("attendance") ||
    q.includes("academic") ||
    q.includes("subject") ||
    q.includes("policy")
  ) {
    return "academics";
  }

  if (
    q.includes("notice") ||
    q.includes("deadline") ||
    q.includes("scholarship") ||
    q.includes("maintenance") ||
    q.includes("holiday") ||
    q.includes("urgent") ||
    q.includes("lost")
  ) {
    return "notices";
  }

  return "unknown";
}

function extractSearchQuery(question, intent) {
  let q = question.toLowerCase();

  const commonWords = [
    "is",
    "are",
    "the",
    "a",
    "an",
    "for",
    "of",
    "on",
    "in",
    "by",
    "to",
    "show",
    "tell",
    "me",
    "what",
    "when",
    "where",
    "which",
    "any",
    "today",
    "this",
    "week",
    "available",
    "suggest",
    "books",
    "book",
    "events",
    "event",
    "menu",
    "lunch",
    "exam",
    "syllabus",
    "notice",
    "notices",
  ];

  commonWords.forEach((word) => {
    q = q.replace(new RegExp(`\\b${word}\\b`, "g"), "");
  });

  q = q.replace(/\s+/g, " ").trim();

  if (!q) {
    if (intent === "library") return "machine learning";
    if (intent === "events") return "tech";
    if (intent === "academics") return "dbms";
    if (intent === "notices") return "scholarship";
    return "";
  }

  return q;
}

async function callMCP(intent, question) {
  const normalizedIntent = normalizeIntent(intent);
  const cleanQuestion = String(question || "").replace(/[^\w\s]/g, " ");
  const query = extractSearchQuery(cleanQuestion, normalizedIntent);
  const lowerQuestion = cleanQuestion.toLowerCase();

  if (normalizedIntent === "library") {
    if (lowerQuestion.includes("open") || lowerQuestion.includes("close")) {
      return axios.get(`${MCP_SERVERS.library}/status`);
    }

    return axios.get(`${MCP_SERVERS.library}/books/search`, {
      params: { query },
    });
  }

  if (normalizedIntent === "cafeteria") {
    if (
      lowerQuestion.includes("crowd") ||
      lowerQuestion.includes("busy") ||
      lowerQuestion.includes("least crowded")
    ) {
      return axios.get(`${MCP_SERVERS.cafeteria}/crowd`);
    }

    if (
      lowerQuestion.includes("near") ||
      lowerQuestion.includes("where should i eat") ||
      lowerQuestion.includes("library block")
    ) {
      return axios.get(`${MCP_SERVERS.cafeteria}/recommend`, {
        params: { area: "Library Block" },
      });
    }

    return axios.get(`${MCP_SERVERS.cafeteria}/menu`);
  }

  if (normalizedIntent === "events") {
    if (lowerQuestion.includes("next")) {
      return axios.get(`${MCP_SERVERS.events}/events/next`);
    }

    return axios.get(`${MCP_SERVERS.events}/events/search`, {
      params: { query },
    });
  }

  if (normalizedIntent === "academics") {
    if (lowerQuestion.includes("attendance")) {
      return axios.get(`${MCP_SERVERS.academics}/attendance-policy`);
    }

    if (
      lowerQuestion.includes("exam") ||
      lowerQuestion.includes("test") ||
      lowerQuestion.includes("schedule")
    ) {
      return axios.get(`${MCP_SERVERS.academics}/exams`, {
        params: { subject: query },
      });
    }

    if (lowerQuestion.includes("calendar")) {
      return axios.get(`${MCP_SERVERS.academics}/calendar`);
    }

    return axios.get(`${MCP_SERVERS.academics}/syllabus/search`, {
      params: { query },
    });
  }

  if (normalizedIntent === "notices") {
    if (lowerQuestion.includes("urgent")) {
      return axios.get(`${MCP_SERVERS.notices}/notices/urgent`);
    }

    return axios.get(`${MCP_SERVERS.notices}/notices/search`, {
      params: { query },
    });
  }

  return null;
}

function buildHumanAnswer(intent, data) {
  const normalizedIntent = normalizeIntent(intent);

  if (normalizedIntent === "library") {
    if (data.isOpen !== undefined) {
      return `The library is ${data.isOpen ? "open" : "closed"} today. Timing: ${data.openingTime} to ${data.closingTime}. Current crowd level is ${data.crowd}.`;
    }

    if (!data.results || data.results.length === 0) {
      return "I could not find matching books in the library records.";
    }

    return data.results
      .map((book) => {
        return `${book.title} by ${book.author} is ${
          book.available ? "available" : "currently issued"
        }. Shelf: ${book.shelf}.`;
      })
      .join(" ");
  }

  if (normalizedIntent === "cafeteria") {
    if (data.recommended) {
      return `${data.recommended.name} is recommended from ${data.userArea}. It is ${data.recommended.distance} away, crowd level is ${data.recommended.crowdLevel}, and today's menu includes ${data.recommended.todayMenu.join(", ")}.`;
    }

    if (
      data.results &&
      data.results[0]?.crowdLevel &&
      !data.results[0]?.todayMenu
    ) {
      return data.results
        .map((cafe) => `${cafe.name}: ${cafe.crowdLevel} crowd`)
        .join(". ");
    }

    if (!data.results || data.results.length === 0) {
      return "I could not find cafeteria information right now.";
    }

    return data.results
      .map(
        (cafe) =>
          `${cafe.name} menu: ${cafe.todayMenu.join(", ")}. Open ${cafe.openingTime} to ${cafe.closingTime}.`,
      )
      .join(" ");
  }

  if (normalizedIntent === "events") {
    if (data.nextEvent) {
      const e = data.nextEvent;
      return `The next event is ${e.title} by ${e.club} on ${e.date} at ${e.time}, venue: ${e.venue}.`;
    }

    if (!data.results || data.results.length === 0) {
      return "I could not find matching campus events.";
    }

    return data.results
      .map(
        (e) =>
          `${e.title} by ${e.club} is on ${e.date} at ${e.time} in ${e.venue}.`,
      )
      .join(" ");
  }

  if (normalizedIntent === "academics") {
    if (data.result) {
      return `${data.result.description} Shortage rule: ${data.result.shortageRule}`;
    }

    if (!data.results || data.results.length === 0) {
      return "I could not find matching academic information.";
    }

    if (data.results[0].units) {
      return data.results
        .map(
          (s) =>
            `${s.subject} (${s.code}) syllabus includes: ${s.units.join("; ")}.`,
        )
        .join(" ");
    }

    return data.results
      .map(
        (e) =>
          `${e.subject} (${e.code}) exam is on ${e.date}, ${e.time}, at ${e.venue}.`,
      )
      .join(" ");
  }

  if (normalizedIntent === "notices") {
    if (!data.results || data.results.length === 0) {
      return "I could not find matching notices.";
    }

    return data.results
      .map((n) => `${n.title} on ${n.date}: ${n.description}`)
      .join(" ");
  }

  return "I could not understand which campus source to use.";
}

app.get("/library/books", async (req, res) => {
  try {
    const response = await axios.get(`${MCP_SERVERS.library}/books`);
    res.json({
      source: "Library MCP via CampusOne Backend",
      results: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch library books",
      error: error.message,
    });
  }
});

app.get("/cafeteria/list", async (req, res) => {
  try {
    const response = await axios.get(`${MCP_SERVERS.cafeteria}/cafeterias`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cafeterias",
      error: error.message,
    });
  }
});

app.get("/events/list", async (req, res) => {
  try {
    const response = await axios.get(`${MCP_SERVERS.events}/events`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });
  }
});

app.get("/academics/summary", async (req, res) => {
  try {
    const [attendance, exams, syllabus, calendar] = await Promise.all([
      axios.get(`${MCP_SERVERS.academics}/attendance-policy`),
      axios.get(`${MCP_SERVERS.academics}/exams`),
      axios.get(`${MCP_SERVERS.academics}/syllabus`),
      axios.get(`${MCP_SERVERS.academics}/calendar`),
    ]);

    res.json({
      source: "Academics MCP via CampusOne Backend",
      attendance: attendance.data.result,
      exams: exams.data.results,
      syllabus: syllabus.data.results,
      calendar: calendar.data.results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch academics summary",
      error: error.message,
    });
  }
});

app.get("/notices/list", async (req, res) => {
  try {
    const response = await axios.get(`${MCP_SERVERS.notices}/notices`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notices",
      error: error.message,
    });
  }
});

app.get("/dashboard-summary", async (req, res) => {
  try {
    const [
      libraryResponse,
      cafeteriaResponse,
      eventsResponse,
      academicsResponse,
      noticesResponse,
    ] = await Promise.all([
      axios.get(`${MCP_SERVERS.library}/books`),
      axios.get(`${MCP_SERVERS.cafeteria}/cafeterias`),
      axios.get(`${MCP_SERVERS.events}/events`),
      axios.get(`${MCP_SERVERS.academics}/exams`),
      axios.get(`${MCP_SERVERS.notices}/notices`),
    ]);

    const books = libraryResponse.data;
    const cafeterias = cafeteriaResponse.data.results;
    const events = eventsResponse.data.results;
    const exams = academicsResponse.data.results;
    const notices = noticesResponse.data.results;

    const availableBooks = books.filter((book) => book.available).length;
    const openCafeterias = cafeterias.filter((cafe) => cafe.isOpen).length;
    const lowCrowdCafe = cafeterias.find((cafe) => cafe.crowdLevel === "Low");
    const nextEvent = events[0];
    const nextExam = exams[0];
    const highPriorityNotice = notices.find(
      (notice) => notice.priority === "High",
    );

    res.json({
      source: "CampusOne Dashboard Aggregator",
      cards: {
        library: {
          totalBooks: books.length,
          availableBooks,
          highlight: "Most searched: Machine Learning",
        },
        cafeteria: {
          openNow: openCafeterias,
          leastCrowded: lowCrowdCafe?.name || "Not available",
        },
        events: {
          upcoming: events.length,
          nextEvent,
        },
        academics: {
          nextExam,
          attendanceRule: "75%",
        },
        notices: {
          active: notices.length,
          important: highPriorityNotice,
        },
      },
      pulse: [
        `${nextEvent.title} is trending today`,
        "Machine Learning books are highly searched",
        `${lowCrowdCafe?.name || "Library Cafe"} has low crowd right now`,
        `${highPriorityNotice?.title || "Important notice"} is active`,
      ],
      timeline: [
        {
          time: "12:30 PM",
          title: "Lunch menu updated",
          source: "Cafeteria MCP",
        },
        {
          time: nextEvent.time,
          title: nextEvent.title,
          source: "Events MCP",
        },
        {
          time: "Today",
          title: highPriorityNotice?.title || "Notice active",
          source: "Notices MCP",
        },
      ],
      connectedSources: [
        "Library MCP",
        "Cafeteria MCP",
        "Events MCP",
        "Academics MCP",
        "Notices MCP",
      ],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary from campus sources",
      error: error.message,
    });
  }
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const geminiRoute = await detectIntentWithGemini(question);

    const fallbackIntent = detectIntent(question);

    const intent = normalizeIntent(
      geminiRoute?.intent && geminiRoute.intent !== "unknown"
        ? geminiRoute.intent
        : fallbackIntent,
    );

    const routingMode =
      geminiRoute?.intent && geminiRoute.intent !== "unknown"
        ? "Gemini AI Router"
        : "Rule-based fallback";

    if (intent === "unknown") {
      return res.json({
        answer:
          "I can help with library, cafeteria, events, academics or notices. Try asking about books, menu, workshops, exams or deadlines.",
        intent: "unknown",
        routingMode,
        selectedTool: geminiRoute?.tool || "unknown",
        routingReason:
          geminiRoute?.reason || "No matching campus source was found.",
        searchQuery: geminiRoute?.searchQuery || question,
        sourceUsed: "CampusOne",
        route: [],
      });
    }

    const searchQueryFromGemini = geminiRoute?.searchQuery || "";
    const response = await callMCP(intent, searchQueryFromGemini || question);

    if (!response) {
      return res.status(400).json({
        message:
          "CampusOne could not find a matching campus source for this question.",
        error: `No source route found for intent: ${intent}`,
      });
    }

    const mcpData = response.data;
    const answer = buildHumanAnswer(intent, mcpData);

    res.json({
      answer,
      intent,
      routingMode,
      selectedTool: geminiRoute?.tool || `${intent}_fallback_tool`,
      routingReason:
        geminiRoute?.reason || "Backup routing selected the campus source.",
      searchQuery:
        searchQueryFromGemini || extractSearchQuery(question, intent),
      sourceUsed: mcpData.source || `${intent} MCP`,
      route: [
        "User Question",
        `${intent.toUpperCase()} MCP`,
        "Answer Generated",
      ],
    });
  } catch (error) {
    res.status(500).json({
      message: "CampusOne could not process the question",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`CampusOne backend running on http://localhost:${PORT}`);
});
