import Expense from "../models/Expense.js";
import User from "../models/User.js";


export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId }).sort({ date: -1 }); 

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, category, description, date } = req.body;


    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Amount and category are required",
      });
    }

    const expense = await Expense.create({
      userId,
      amount,
      category,
      description,
      date,
    });


    const user = await User.findById(userId);
    user.balance -= amount;
    await user.save();

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId,
    });

    const user = await User.findById(userId);
    user.balance += expense.amount;
    await user.save();

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
