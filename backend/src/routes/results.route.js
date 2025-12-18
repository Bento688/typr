import express from "express";
import { saveResult, getHistory } from "../controllers/result.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, saveResult);
router.get("/history", protectRoute, getHistory);

export default router;
