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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Routes

app.use("/api/words", wordsRoutes);

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
});
