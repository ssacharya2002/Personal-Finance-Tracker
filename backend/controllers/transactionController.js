import Expense from "../models/Expense.js";
import Income from "../models/income.js";


export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId });
    const incomes = await Income.find({ userId });


    const formattedExpenses = expenses.map((exp) => ({
      _id: exp._id,
      type: "expense",
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      date: exp.date,
      createdAt: exp.createdAt,
    }));

    const formattedIncomes = incomes.map((inc) => ({
      _id: inc._id,
      type: "income",
      amount: inc.amount,
      category: inc.category,
      description: inc.source || inc.description,
      date: inc.date,
      createdAt: inc.createdAt,
    }));


    const transactions = [...formattedExpenses, ...formattedIncomes].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};