import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./middleware/db.middleware.js";
import limiter from "./middleware/ratelimit.middleware.js";

// Import config to run it
import "./config/passport.js";

import wordsRoutes from "./routes/words.route.js";
import authRoutes from "./routes/auth.route.js";
import resultsRoutes from "./routes/results.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

// Middleware
app.use(express.json());
const allowedOrigins = [process.env.DEV_CLIENT_URL, process.env.CLIENT_URL];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(limiter); // rate limiter
app.use(morgan("dev"));

// Session Config //
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    },
  }),
);

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/words", wordsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/results", resultsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "backend is running!",
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // React routing fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
  connectDB();
});
