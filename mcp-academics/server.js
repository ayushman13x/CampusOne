const express = require("express");
const cors = require("cors");
const academics = require("./data/academics.json");

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "CampusOne Academics MCP",
    status: "running",
    tools: [
      "get_attendance_policy",
      "get_exam_schedule",
      "search_syllabus",
      "get_academic_calendar",
    ],
  });
});

app.get("/tools", (req, res) => {
  res.json([
    {
      name: "get_attendance_policy",
      description: "Get attendance eligibility and shortage rules",
      endpoint: "/attendance-policy",
    },
    {
      name: "get_exam_schedule",
      description: "Get exam schedule for all subjects or one subject",
      endpoint: "/exams",
    },
    {
      name: "search_syllabus",
      description: "Search syllabus by subject name, code, or unit topic",
      endpoint: "/syllabus/search?query=",
    },
    {
      name: "get_academic_calendar",
      description: "Get important academic dates",
      endpoint: "/calendar",
    },
  ]);
});

app.get("/attendance-policy", (req, res) => {
  res.json({
    source: "Academics MCP",
    result: academics.attendancePolicy,
  });
});

app.get("/exams", (req, res) => {
  const subject = String(req.query.subject || "").toLowerCase();

  let results = academics.examSchedule;

  if (subject) {
    results = academics.examSchedule.filter((exam) => {
      return (
        exam.subject.toLowerCase().includes(subject) ||
        exam.code.toLowerCase().includes(subject)
      );
    });
  }

  res.json({
    source: "Academics MCP",
    query: subject || "all",
    count: results.length,
    results,
  });
});

app.get("/syllabus", (req, res) => {
  res.json({
    source: "Academics MCP",
    count: academics.syllabus.length,
    results: academics.syllabus,
  });
});

app.get("/syllabus/search", (req, res) => {
  const query = String(req.query.query || "").toLowerCase();

  if (!query) {
    return res.json({
      source: "Academics MCP",
      query,
      count: 0,
      results: [],
    });
  }

  const results = academics.syllabus.filter((item) => {
    const subjectMatch = item.subject.toLowerCase().includes(query);
    const codeMatch = item.code.toLowerCase().includes(query);
    const unitMatch = item.units.some((unit) =>
      unit.toLowerCase().includes(query)
    );

    return subjectMatch || codeMatch || unitMatch;
  });

  res.json({
    source: "Academics MCP",
    query,
    count: results.length,
    results,
  });
});

app.get("/calendar", (req, res) => {
  res.json({
    source: "Academics MCP",
    count: academics.academicCalendar.length,
    results: academics.academicCalendar,
  });
});

app.listen(PORT, () => {
  console.log(`Academics MCP running on http://localhost:${PORT}`);
});