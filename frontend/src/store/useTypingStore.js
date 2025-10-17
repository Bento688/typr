import { create } from "zustand";
import { useWordStore } from "./useWordStore";

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

      set({
        typedWords: [...typedWords, { word: typedWord, isCorrect }],
        currentWordIndex: newIndex,
        inputValue: "",
        correctWords: get().correctWords + (isCorrect ? 1 : 0),
        incorrectWords: get().incorrectWords + (!isCorrect ? 1 : 0),
        isFinished: finished,
        endTime: finished ? Date.now() : null,
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
