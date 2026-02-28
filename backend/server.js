import express from "express";
import cors from "cors";
import { jobs } from "./data/jobs.js";
import { matchJobs } from "./lib/matcher.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET /api/jobs — return all job postings
app.get("/api/jobs", (_req, res) => {
  res.json({ jobs });
});

// POST /api/match — match a profile against job postings
app.post("/api/match", (req, res) => {
  const { profile } = req.body;

  if (!profile || typeof profile !== "string" || profile.trim().length < 10) {
    return res.status(400).json({ error: "Profile must be at least 10 characters." });
  }

  const results = matchJobs(profile.trim(), jobs);

  res.json({
    results,
    algorithm: "v1-keyword",
    profileLength: profile.trim().length,
  });
});

app.listen(PORT, () => {
  console.log(`HR Referrals backend running on http://localhost:${PORT}`);
});
