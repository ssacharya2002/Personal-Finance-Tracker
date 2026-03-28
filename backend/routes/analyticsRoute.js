import express from "express";

import protect from "../middleware/auth.js";
import { getExpenseByCategory, getIncomeExpenseTrend } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/trend", protect, getIncomeExpenseTrend);
router.get("/category", protect, getExpenseByCategory);

export default router;