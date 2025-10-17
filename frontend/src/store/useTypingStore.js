import { create } from "zustand";
import { useWordStore } from "./useWordStore";

export const useTypingStore = create((set, get) => ({
  inputValue: "",
  currentWordIndex: 0,
  correctWords: 0,
  incorrectWords: 0,
  isFinished: false,
  typedWords: [],

  setInputValue: (value, words) => {
    const { currentWordIndex, typedWords } = get();

    // Update input value
    set({ inputValue: value });

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const targetWord = words[currentWordIndex];

      const isCorrect = typedWord === targetWord;

      set({
        typedWords: [...typedWords, { word: typedWord, isCorrect }],
        currentWordIndex: currentWordIndex + 1,
        inputValue: "",
        isFinished: currentWordIndex + 1 >= words.length,
      });
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
