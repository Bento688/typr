import { Result } from "../models/result.model.js";

export const saveResult = async (req, res) => {
  try {
    const { wpm, rawWpm, accuracy, testType } = req.body;

    if (wpm < 0 || rawWpm < 0 || accuracy < 0 || accuracy > 100) {
      return res.status(400).json({ message: "Invalid test data" });
    }

    const result = new Result({
      userId: req.user._id,
      wpm,
      rawWpm,
      accuracy,
      testType,
      date: new Date(),
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: "Server error saving result" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json(results);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error fetching history" });
  }
};
