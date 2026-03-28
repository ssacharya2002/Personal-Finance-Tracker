import express from "express";
import { getOverview } from "../controllers/overviewController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getOverview);

export default router;