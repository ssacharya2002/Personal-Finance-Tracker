import express from "express";
import protect from "../middleware/auth.js";
import { addExpense, deleteExpense, getAllExpenses } from "../controllers/expenseController.js";

const router = express.Router();

router.get("/",protect,getAllExpenses);


router.post("/", protect, addExpense);
router.delete("/:id",protect, deleteExpense);

export default router;
