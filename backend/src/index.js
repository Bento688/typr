import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import cors from "cors";
import morgan from "morgan";

import wordsRoutes from "./routes/words.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// API Routes
app.use("/api/words", wordsRoutes);

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
});
