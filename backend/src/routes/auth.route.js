import express from "express";
import passport from "passport";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  signup,
  verifyEmail,
  login,
  logout,
  checkAuth,
  updateUsername,
} from "../controllers/auth.controller.js";

const router = express.Router();

// --- Local Auth ---

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth);
router.put("/update-username", protectRoute, updateUsername);

// --- Google Auth ---

// GET /api/auth/google (when user logins using google)
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// GET /api/auth/google/callback (the redirect from google)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL || "/", // Redirect if failed
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(process.env.CLIENT_URL || "/");
  },
);

export default router;
