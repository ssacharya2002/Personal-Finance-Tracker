import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routes
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js"
import categoryRoute from "./routes/categoryRoutes.js"
import incomeRoutes from "./routes/incomeRoute.js";
import transactionRoutes from "./routes/transactionRoutes.js"
import overviewRoutes from "./routes/overviewRoute.js";
import analyticsRoutes from "./routes/analyticsRoute.js";
import budgetRoutes from "./routes/BudgetRoute.js"

import connectDB from "./config/db.js";
import { startCronJobs } from "./cron/cronJobs.js";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();



app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/categories", categoryRoute);

app.use("/api/income", incomeRoutes);

app.use("/api/transaction", transactionRoutes);

app.use("/api/overview", overviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/budget", budgetRoutes);




app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

startCronJobs();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});