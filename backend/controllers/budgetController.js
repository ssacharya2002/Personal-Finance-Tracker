import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import mongoose from "mongoose";


export const setBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, amount, month, year } = req.body;


    const budget = await Budget.findOneAndUpdate(
      { userId, category, month, year },
      { amount },
      { new: true, upsert: true }
    );

    res.json({ success: true, budget });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};



export const getBudgetStatus = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();


    const budgets = await Budget.find({ userId, month, year });


    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(year, month, 1),
            $lte: new Date(year, month + 1, 0),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
    ]);


    const result = budgets.map((b) => {
      const spent =
        expenses.find(
          (e) => e._id.toString() === b.category.toString()
        )?.spent || 0;

      return {
        category: b.category,
        budget: b.amount,
        spent,
        percentage: Math.min((spent / b.amount) * 100, 100),
      };
    });

    res.json({ success: true, data: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};