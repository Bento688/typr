import { create } from "zustand";

export const useThemeStore = create((set) => ({
  selectedTheme: localStorage.getItem("selectedTheme") || "default",
  setTheme: (theme) => {
    localStorage.setItem("selectedTheme", theme);
    set({ selectedTheme: theme });
  },
}));

export default useThemeStore;
