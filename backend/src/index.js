import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import cors from "cors";
import morgan from "morgan";
import session from "express-session"; // [!code ++]
import passport from "passport"; // [!code ++]j
import { connectDB } from "./middleware/db.middleware.js";

// Import config to run it
import "./config/passport.js"; // [!code ++]

import wordsRoutes from "./routes/words.route.js";
import authRoutes from "./routes/auth.route.js";
import resultsRoutes from "./routes/results.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development" ? "http://localhost:5173" : true,
    credentials: true,
  })
);
app.use(morgan("dev"));

// Session Config // [!code ++]
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod // [!code ++]
      httpOnly: true, // [!code ++]
    },
  })
);

// Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/words", wordsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/results", resultsRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // React routing fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.json({
    status: "backend is running!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
  connectDB();
});
