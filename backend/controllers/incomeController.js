import User from "../models/User.js";
import Income  from "./../models/income.js";


export const getAllIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomes = await Income.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      incomes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch income",
    });
  }
};

export const addIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      amount,
      source,
      category,
      date,
      frequency,
      isRecurring,
      description,
    } = req.body;

    const income = await Income.create({
      userId,
      amount,
      source,
      category,
      date,
      frequency,
      isRecurring,
      description,
    });

    const incomeDate = new Date(date);
    const today = new Date();


    incomeDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let shouldAddToBalance = false;


    if (!isRecurring) {
      shouldAddToBalance = true;
    }

    else {
      const sameMonth =
        incomeDate.getMonth() === today.getMonth() &&
        incomeDate.getFullYear() === today.getFullYear();

      const isPastOrToday = incomeDate <= today;

      if (sameMonth && isPastOrToday) {
        shouldAddToBalance = true;
      }
    }

    if (shouldAddToBalance) {
      const user = await User.findById(userId);
      user.balance += amount;
      await user.save();
    }

    res.status(201).json({
      success: true,
      income,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to add income",
    });
  }
};


export const deleteIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const income = await Income.findOneAndDelete({
      _id: id,
      userId,
    });

    // if not recurring then reduce the balance 
    if (!income.isRecurring) {
      const user = await User.findById(userId);
      user.balance -= income.amount;
      await user.save();
    }

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    

    res.status(200).json({
      success: true,
      message: "Income deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete income",
    });
  }
};


export const toggleIncomeActive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const income = await Income.findOne({ _id: id, userId });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    income.isActive = !income.isActive;
    await income.save();

    res.status(200).json({
      success: true,
      income,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle income",
    });
  }
};