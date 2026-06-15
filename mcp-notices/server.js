const express = require("express");
const cors = require("cors");
const notices = require("./data/notices.json");

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "CampusOne Notices MCP",
    status: "running",
    tools: [
      "get_all_notices",
      "search_notices",
      "filter_notices_by_category",
      "filter_notices_by_priority",
    ],
  });
});

app.get("/tools", (req, res) => {
  res.json([
    {
      name: "get_all_notices",
      description: "Get all active campus notices",
      endpoint: "/notices",
    },
    {
      name: "search_notices",
      description: "Search notices by title, category, priority, or description",
      endpoint: "/notices/search?query=",
    },
    {
      name: "filter_notices_by_category",
      description: "Filter notices by category such as Deadline, Maintenance, General, or Lost & Found",
      endpoint: "/notices/category/:category",
    },
    {
      name: "filter_notices_by_priority",
      description: "Filter notices by priority such as High, Medium, or Low",
      endpoint: "/notices/priority/:priority",
    },
  ]);
});

app.get("/notices", (req, res) => {
  res.json({
    source: "Notices MCP",
    count: notices.length,
    results: notices,
  });
});
app.get("/notices/search", (req, res) => {
  const query = String(req.query.query || "").toLowerCase();

  if (!query) {
    return res.json({
      source: "Notices MCP",
      query,
      count: 0,
      results: [],
    });
  }

  const stopWords = [
    "any",
    "is",
    "are",
    "the",
    "a",
    "an",
    "for",
    "of",
    "on",
    "in",
    "to",
    "show",
    "tell",
    "me",
    "what",
    "when",
    "where",
    "which",
    "do",
    "i",
    "have",
  ];

  const queryWords = query
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  const results = notices.filter((notice) => {
    const searchableText = `
      ${notice.title}
      ${notice.category}
      ${notice.priority}
      ${notice.description}
      ${notice.date}
    `.toLowerCase();

    return queryWords.some((word) => searchableText.includes(word));
  });

  res.json({
    source: "Notices MCP",
    query,
    extractedKeywords: queryWords,
    count: results.length,
    results,
  });
});

app.get("/notices/category/:category", (req, res) => {
  const category = req.params.category.toLowerCase();

  const results = notices.filter((notice) =>
    notice.category.toLowerCase().includes(category)
  );

  res.json({
    source: "Notices MCP",
    category,
    count: results.length,
    results,
  });
});

app.get("/notices/priority/:priority", (req, res) => {
  const priority = req.params.priority.toLowerCase();

  const results = notices.filter(
    (notice) => notice.priority.toLowerCase() === priority
  );

  res.json({
    source: "Notices MCP",
    priority,
    count: results.length,
    results,
  });
});

app.get("/notices/urgent", (req, res) => {
  const results = notices.filter((notice) => notice.priority === "High");

  res.json({
    source: "Notices MCP",
    count: results.length,
    results,
  });
});

app.listen(PORT, () => {
  console.log(`Notices MCP running on http://localhost:${PORT}`);
});