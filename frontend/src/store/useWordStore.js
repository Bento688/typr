import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useWordStore = create((set, get) => ({
  words: [],
  selectedCount: 25,
  isLoadingWords: false,
  selectedLanguage: "english",

  setSelectedLanguage: (language) => set({ selectedLanguage: language }),

  getWords: async () => {
    set({ isLoadingWords: true });
    try {
      const res = await axiosInstance.get("/words");
      set({ words: res.data.words, count: res.data.count });
    } catch (error) {
      console.log("Error in getWords:", error);
    } finally {
      set({
        isLoadingWords: false,
      });
    }
  },

  setCountAndGetWords: async (wordCount) => {
    set({ isLoadingWords: true, selectedCount: wordCount });
    try {
      const res = await axiosInstance.get("/words", {
        params: { count: wordCount, language: get().selectedLanguage },
      });
      set({ words: res.data.words, wordCount: res.data.count });
    } catch (error) {
      console.log("Error in setCountAndGetWords:", error);
    }
  },
}));

export default useWordStore;
