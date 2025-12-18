import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links this result to a specific user
    required: true,
  },
  wpm: {
    type: Number,
    required: true, // The "Net WPM" (adjusted for errors)
  },
  rawWpm: {
    type: Number,
    required: true, // The speed calculated purely by characters typed
  },
  accuracy: {
    type: Number,
    required: true, // Percentage (0-100)
  },
  testType: {
    type: String,
    required: true, // e.g., "words_10", "words_25", "time_60"
  },
  date: {
    type: Date,
    default: Date.now, // Automatically sets the time when saved
  },
});

// Performance Index:
// This ensures that fetching a user's history sorted by newest first is extremely fast,
// even if they have thousands of results.
resultSchema.index({ userId: 1, date: -1 });

export const Result = mongoose.model("Result", resultSchema);
