const express = require("express");
const cors = require("cors");
const events = require("./data/events.json");

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "CampusOne Events MCP",
    status: "running",
    tools: [
      "get_upcoming_events",
      "search_events",
      "filter_events_by_club",
      "filter_events_by_type",
    ],
  });
});

app.get("/tools", (req, res) => {
  res.json([
    {
      name: "get_upcoming_events",
      description: "Get all upcoming campus events",
      endpoint: "/events",
    },
    {
      name: "search_events",
      description: "Search events by title, club, type, or venue",
      endpoint: "/events/search?query=",
    },
    {
      name: "filter_events_by_type",
      description: "Filter events by type such as Tech, Cultural, or Sports",
      endpoint: "/events/type/:type",
    },
    {
      name: "filter_events_by_club",
      description: "Filter events by club name",
      endpoint: "/events/club/:club",
    },
  ]);
});

app.get("/events", (req, res) => {
  res.json({
    source: "Events MCP",
    count: events.length,
    results: events,
  });
});

app.get("/events/search", (req, res) => {
  const query = String(req.query.query || "").toLowerCase();

  if (!query) {
    return res.json({
      source: "Events MCP",
      query,
      count: 0,
      results: [],
    });
  }

  const results = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(query) ||
      event.club.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
    );
  });

  res.json({
    source: "Events MCP",
    query,
    count: results.length,
    results,
  });
});

app.get("/events/type/:type", (req, res) => {
  const type = req.params.type.toLowerCase();

  const results = events.filter(
    (event) => event.type.toLowerCase() === type
  );

  res.json({
    source: "Events MCP",
    type,
    count: results.length,
    results,
  });
});

app.get("/events/club/:club", (req, res) => {
  const club = req.params.club.toLowerCase();

  const results = events.filter((event) =>
    event.club.toLowerCase().includes(club)
  );

  res.json({
    source: "Events MCP",
    club,
    count: results.length,
    results,
  });
});

app.get("/events/next", (req, res) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  res.json({
    source: "Events MCP",
    nextEvent: sortedEvents[0],
  });
});

app.listen(PORT, () => {
  console.log(`Events MCP running on http://localhost:${PORT}`);
});