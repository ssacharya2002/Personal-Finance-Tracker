import Income from "../models/income.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Total Income (this month)
    const incomeResult = await Income.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Total Expense (this month)
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;


    const user = await User.findById(userId).select("balance");

    const netBalance = user?.balance || 0;

    res.status(200).json({
      success: true,
      overview: {
        totalIncome,
        totalExpense,
        netBalance,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview",
    });
  }
};