const express = require("express");
const cors = require("cors");
const cafeterias = require("./data/cafeterias.json");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "CampusOne Cafeteria MCP",
    status: "running",
    tools: [
      "get_today_menu",
      "get_cafeteria_status",
      "get_crowd_levels",
      "recommend_nearest_cafeteria",
    ],
  });
});

app.get("/tools", (req, res) => {
  res.json([
    {
      name: "get_today_menu",
      description: "Get today's menu for all cafeterias or a specific cafeteria",
      endpoint: "/menu",
    },
    {
      name: "get_crowd_levels",
      description: "Get current crowd levels across campus cafeterias",
      endpoint: "/crowd",
    },
    {
      name: "recommend_nearest_cafeteria",
      description: "Recommend cafeteria based on campus area",
      endpoint: "/recommend?area=",
    },
  ]);
});

app.get("/cafeterias", (req, res) => {
  res.json({
    source: "Cafeteria MCP",
    count: cafeterias.length,
    results: cafeterias,
  });
});

app.get("/menu", (req, res) => {
  const name = String(req.query.name || "").toLowerCase();

  let results = cafeterias;

  if (name) {
    results = cafeterias.filter((cafe) =>
      cafe.name.toLowerCase().includes(name)
    );
  }

  res.json({
    source: "Cafeteria MCP",
    query: name || "all",
    results: results.map((cafe) => ({
      name: cafe.name,
      area: cafe.area,
      todayMenu: cafe.todayMenu,
      isOpen: cafe.isOpen,
      openingTime: cafe.openingTime,
      closingTime: cafe.closingTime,
    })),
  });
});

app.get("/crowd", (req, res) => {
  res.json({
    source: "Cafeteria MCP",
    results: cafeterias.map((cafe) => ({
      name: cafe.name,
      area: cafe.area,
      crowdLevel: cafe.crowdLevel,
    })),
  });
});

app.get("/recommend", (req, res) => {
  const area = String(req.query.area || "").trim();

  if (!area) {
    return res.status(400).json({
      message: "Please provide area. Example: /recommend?area=Library Block",
    });
  }

  const ranked = cafeterias
    .map((cafe) => {
      const distanceText = cafe.distanceFrom[area] || "9999m";
      const distanceNumber = Number(distanceText.replace("m", ""));

      return {
        name: cafe.name,
        area: cafe.area,
        distance: distanceText,
        crowdLevel: cafe.crowdLevel,
        todayMenu: cafe.todayMenu,
        score: distanceNumber + (cafe.crowdLevel === "High" ? 300 : 0),
      };
    })
    .sort((a, b) => a.score - b.score);

  res.json({
    source: "Cafeteria MCP",
    userArea: area,
    recommended: ranked[0],
    alternatives: ranked.slice(1),
  });
});

app.listen(PORT, () => {
  console.log(`Cafeteria MCP running on http://localhost:${PORT}`);
});