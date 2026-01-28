import { Result } from "../models/result.model.js";

// endpoint to save the result from react to the backend
export const saveResult = async (req, res) => {
  try {
    // 1. get the data from req.body
    const { wpm, rawWpm, accuracy, testType } = req.body;

    // 2. for invalid data, return error 400
    if (wpm < 0 || rawWpm < 0 || accuracy < 0 || accuracy > 100) {
      return res.status(400).json({ message: "Invalid test data" });
    }

    // 3. format the data to save to the backend
    const result = new Result({
      userId: req.user._id,
      wpm,
      rawWpm,
      accuracy,
      testType,
      date: new Date(),
    });

    // 4. save it to the backend
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: "Server error saving result" });
  }
};

// used to find the typing history for the user (for profile page)
export const getHistory = async (req, res) => {
  try {
    // from mongoDB, find all results where the id === user._id
    const results = await Result.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(results);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error fetching history" });
  }
};
