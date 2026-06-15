const express = require("express");
const cors = require("cors");
const books = require("./data/books.json");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "CampusOne Library MCP",
    status: "running",
    tools: ["search_books", "get_book_availability", "get_library_status"],
  });
});

app.get("/tools", (req, res) => {
  res.json([
    {
      name: "search_books",
      description: "Search library books by title, author, or topic",
      endpoint: "/books/search?query=",
    },
    {
      name: "get_library_status",
      description: "Get library opening hours and current status",
      endpoint: "/status",
    },
  ]);
});

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/search", (req, res) => {
  const query = String(req.query.query || "").toLowerCase();

  if (!query) {
    return res.json({
      source: "Library MCP",
      query,
      count: 0,
      results: [],
    });
  }

  const stopWords = [
    "can",
    "you",
    "please",
    "suggest",
    "some",
    "good",
    "books",
    "book",
    "to",
    "start",
    "learning",
    "learn",
    "for",
    "the",
    "a",
    "an",
    "about",
    "on",
  ];

  const queryWords = query
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  const results = books.filter((book) => {
    const searchableText = `${book.title} ${book.author} ${book.topic}`.toLowerCase();

    return queryWords.some((word) => searchableText.includes(word));
  });

  res.json({
    source: "Library MCP",
    query,
    extractedKeywords: queryWords,
    count: results.length,
    results,
  });
});

app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json({
    source: "Library MCP",
    book,
  });
});

app.get("/status", (req, res) => {
  res.json({
    source: "Library MCP",
    isOpen: true,
    openingTime: "8:00 AM",
    closingTime: "8:00 PM",
    today: "Open as usual",
    crowd: "Quiet",
  });
});

app.listen(PORT, () => {
  console.log(`Library MCP running on http://localhost:${PORT}`);
});