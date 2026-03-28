import mongoose from "mongoose";
import Category from "../models/Category.js";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGO_URI;

const categories = [

  { name: "Groceries", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Utilities", type: "expense" },
  { name: "Transport", type: "expense" },
  { name: "Food", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Health", type: "expense" },
  { name: "Clothing", type: "expense" },
  { name: "Education", type: "expense" },
  { name: "Travel", type: "expense" },
  { name: "Insurance", type: "expense" },
  { name: "Subscriptions", type: "expense" },
  { name: "Gifts", type: "expense" },
  { name: "Bills", type: "expense" },
  { name: "Other Expense", type: "expense" },

  { name: "Salary", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Bonus", type: "income" },
  { name: "Investment", type: "income" },
  { name: "Business", type: "income" },
  { name: "Rental Income", type: "income" },
  { name: "Interest", type: "income" },
  { name: "Dividends", type: "income" },
  { name: "Refund", type: "income" },
  { name: "Other Income", type: "income" },
];

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await Category.insertMany(categories);

    console.log("Global categories seeded ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// seedCategories();  