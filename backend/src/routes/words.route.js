import express from "express";
import words from "../data/words.js";

const router = express.Router();

router.get("/", (req, res) => {
  const count = req.query.count ? parseInt(req.query.count) : 25;

  // Shuffle words
  const shuffled = words.sort(() => 0.5 - Math.random());

  // Slice to requested word count
  const selectedWords = shuffled.slice(0, count);

  res.json({
    count: count,
    words: selectedWords,
  });
});

export default router;
