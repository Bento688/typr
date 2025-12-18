import { create } from "zustand";
import { useWordStore } from "./useWordStore";
import { useAuthStore } from "./useAuthStore"; // [!code ++]
import { axiosInstance } from "../lib/axios"; // [!code ++]

export const useTypingStore = create((set, get) => ({
  inputValue: "",
  currentWordIndex: 0,
  correctWords: 0,
  incorrectWords: 0,
  isFinished: false,
  typedWords: [],
  startTime: null,
  endTime: null,

  setInputValue: (value, words) => {
    const { currentWordIndex, typedWords, startTime } = get();

    if (!startTime) {
      set({ startTime: Date.now() });
    }

    // Update input value
    set({ inputValue: value });

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const targetWord = words[currentWordIndex];
      const isCorrect = typedWord === targetWord;

      const newIndex = currentWordIndex + 1;
      const finished = newIndex >= words.length;
      const endTime = finished ? Date.now() : null; // Capture end time

      set({
        typedWords: [...typedWords, { word: typedWord, isCorrect }],
        currentWordIndex: newIndex,
        inputValue: "",
        correctWords: get().correctWords + (isCorrect ? 1 : 0),
        incorrectWords: get().incorrectWords + (!isCorrect ? 1 : 0),
        isFinished: finished,
        endTime: endTime,
      });

      // [!code ++] Trigger save if finished
      if (finished) {
        get().saveResult();
      }
    }
  },

  // [!code ++] New action to calculate and save stats
  saveResult: async () => {
    const { startTime, endTime, correctWords, incorrectWords, typedWords } =
      get();
    const { authUser } = useAuthStore.getState();
    const { selectedCount } = useWordStore.getState();

    // 1. Check if user is logged in & game had a valid time
    if (!authUser || !startTime || !endTime) return;

    // 2. Calculate Stats
    const timeInMinutes = (endTime - startTime) / 60000;

    // Total characters typed (including spaces)
    // We sum the length of every typed word + 1 space per word
    const totalChars =
      typedWords.reduce((sum, item) => sum + item.word.length, 0) +
      typedWords.length;

    // Raw WPM: (Total Characters / 5) / Minutes
    const rawWpm = Math.round(totalChars / 5 / timeInMinutes);

    // Net WPM: (Total Chars / 5 - Errors) / Minutes
    // Alternatively: (Correct Words) / Minutes (Simplest approximation for now)
    // Let's use the standard Formula: Net WPM = Gross WPM - (Uncorrected Errors / Time)
    // For simplicity here, let's use: (CorrectChars / 5) / Time
    const correctChars =
      typedWords.reduce(
        (sum, item) => (item.isCorrect ? sum + item.word.length : sum),
        0
      ) + correctWords; // approx spaces for correct words
    const wpm = Math.round(correctChars / 5 / timeInMinutes);

    const accuracy =
      Math.round((correctWords / (correctWords + incorrectWords)) * 100) || 0;

    const resultData = {
      wpm: Math.max(0, wpm), // Prevent negative numbers
      rawWpm: Math.max(0, rawWpm),
      accuracy,
      testType: `words_${selectedCount || 25}`, // Default to 25 if null
    };

    // 3. Send to Backend
    try {
      await axiosInstance.post("/results", resultData);
      console.log("Result saved successfully:", resultData);
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  },

  resetGame: () => {
    const { selectedCount, setCountAndGetWords } = useWordStore.getState();

    // Reset typing store states
    set({
      inputValue: "",
      currentWordIndex: 0,
      correctWords: 0,
      incorrectWords: 0,
      startTime: null,
      endTime: null,
      isFinished: false,
      typedWords: [],
    });

    if (selectedCount) {
      setCountAndGetWords(selectedCount);
    } else {
      setCountAndGetWords(25);
    }
  },
}));

export default useTypingStore;
