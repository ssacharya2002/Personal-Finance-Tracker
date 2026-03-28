import Income from "../models/income.js";
import Expense from "../models/Expense.js";
import mongoose from "mongoose";

export const getIncomeExpenseTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);


    const income = await Income.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth },
          isActive: true,
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);


    const expense = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);


    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const result = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const inc = income.find((d) => d._id === i)?.total || 0;
      const exp = expense.find((d) => d._id === i)?.total || 0;

      result.push({
        day: i,
        income: inc,
        expense: exp,
      });
    }

    res.json({ success: true, data: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


import Category from "../models/Category.js";

export const getExpenseByCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const data = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          name: "$category.name",
          value: "$total",
        },
      },
    ]);

    res.json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};