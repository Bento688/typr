import { create } from "zustand";

export const useAppStore = create((set) => ({
  isLoginOpen: false,
  setIsLoginOpen: (bool) => {
    set({ isLoginOpen: bool });
  },
}));

export default useAppStore;
