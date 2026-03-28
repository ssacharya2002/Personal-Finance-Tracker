import express from "express";
import {
  getAllIncome,
  addIncome,
  deleteIncome,
  toggleIncomeActive,
} from "../controllers/incomeController.js"
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllIncome);
router.post("/", protect, addIncome);
router.delete("/:id", protect, deleteIncome);
router.patch("/:id/toggle", protect, toggleIncomeActive);

export default router;