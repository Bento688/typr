import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isVerifying: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      if (res.data.requiresVerification) {
        return {
          success: true,
          requiresVerification: true,
          userId: res.data.userId,
        };
      }

      set({ authUser: res.data.user });
      return true; // Success
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (data) => {
    set({ isVerifying: true });
    try {
      const res = await axiosInstance.post("/auth/verify-email", data);
      set({ authUser: res.data.user }); // Now we are logged in!
      return true;
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Verification failed");
      return false;
    } finally {
      set({ isVerifying: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      return true; // Success
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  updateUsername: async (newUsername) => {
    try {
      const res = await axiosInstance.put("/auth/update-username", {
        username: newUsername,
      });
      // Update local state with the new user object
      set({ authUser: res.data.user });
      return true;
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update username");
      return false;
    }
  },
}));
