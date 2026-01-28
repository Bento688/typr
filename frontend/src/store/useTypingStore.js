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
  typedWords: [], // {word: "foo", isCorrect}
  startTime: null,
  endTime: null,

  // the function called whenever a user type anything
  setInputValue: (value, words) => {
    const { currentWordIndex, typedWords, startTime } = get();

    // 1. if !startTime => game is not started (so start time set to now)
    if (!startTime) {
      set({ startTime: Date.now() });
    }

    // 2. Update input value
    set({ inputValue: value });

    // 3. if user typed "space" => user finished typing a word
    if (value.endsWith(" ")) {
      const typedWord = value.trim(); // get the word without backspace at the end "Hello " into "Hello"
      // get the target word from the words array and compare to the word the user typed
      const targetWord = words[currentWordIndex];
      const isCorrect = typedWord === targetWord;

      const newIndex = currentWordIndex + 1;
      const finished = newIndex >= words.length;
      const endTime = finished ? Date.now() : null; // Capture end time

      // reset the user's input box once they finished typing a word
      set({
        typedWords: [...typedWords, { word: typedWord, isCorrect }],
        currentWordIndex: newIndex,
        inputValue: "",
        correctWords: get().correctWords + (isCorrect ? 1 : 0),
        incorrectWords: get().incorrectWords + (!isCorrect ? 1 : 0),
        isFinished: finished,
        endTime: endTime,
      });

      // if finished => immediately save the result
      if (finished) {
        get().saveResult();
      }
    }
  },

  saveResult: async () => {
    // get the data to calculate wpm
    const { startTime, endTime, correctWords, incorrectWords, typedWords } =
      get();
    const { authUser } = useAuthStore.getState();
    const { selectedCount } = useWordStore.getState();

    // 1. Check if user is logged in & game had a valid time
    if (!authUser || !startTime || !endTime) return;

    // 2. Calculate Stats

    // 2.1 get the total time of the test
    const timeInMinutes = (endTime - startTime) / 60000;

    // 2.2 Total characters typed (including spaces)
    // We sum the length of every typed word + 1 space per word
    const totalChars =
      typedWords.reduce((sum, item) => sum + item.word.length, 0) +
      typedWords.length;

    // 2.3 Raw WPM: (Total Characters / 5) / Minutes
    const rawWpm = Math.round(totalChars / 5 / timeInMinutes);

    // 2.4 Net WPM: (Total Chars / 5 - Errors) / Minutes
    // get the total number of correct characters
    const correctChars =
      typedWords.reduce(
        (sum, item) => (item.isCorrect ? sum + item.word.length : sum),
        0,
      ) + correctWords; // approx spaces for correct words
    const wpm = Math.round(correctChars / 5 / timeInMinutes);

    // 2.5 calculate accuracy (correct / (total))
    const accuracy =
      Math.round((correctWords / (correctWords + incorrectWords)) * 100) || 0;

    // 2.6 format the json data to send to the backend
    const resultData = {
      wpm: Math.max(0, wpm), // Prevent negative numbers
      rawWpm: Math.max(0, rawWpm),
      accuracy,
      testType: `words_${selectedCount || 25}`, // Default to 25 if null
    };

    // 3. Send to Backend
    try {
      // 3.1 send to backend with the result json
      await axiosInstance.post("/results", resultData);
      console.log("Result saved successfully:", resultData);
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  },

  resetGame: () => {
    // get the selected count front wordStore
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

    // if user has selected word count, use user's option,
    // else, use the default behavior
    if (selectedCount) {
      setCountAndGetWords(selectedCount);
    } else {
      setCountAndGetWords(25);
    }
  },
}));

export default useTypingStore;
