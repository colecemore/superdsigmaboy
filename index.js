const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/repos", async (req, res) => {
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const data = await response.json();

    // Optionally filter the data
    const simplified = data.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      private: repo.private
    }));

    res.json(simplified);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch repos" });
  }
});

app.get("/", (req, res) => {
  res.send("GitHub API proxy is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
