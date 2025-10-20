import express from "express";
import words from "../data/words.js";

const router = express.Router();

router.get("/", (req, res) => {
  const count = req.query.count ? parseInt(req.query.count) : 25;
  const language = req.query.language ? req.query.language : "english";

  // Shuffle words
  const shuffled = words[language].sort(() => 0.5 - Math.random());

  // Slice to requested word count
  const selectedWords = shuffled.slice(0, count);

  res.json({
    count: count,
    words: selectedWords,
    language: language,
  });
});

export default router;
