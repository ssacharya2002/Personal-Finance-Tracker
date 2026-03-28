import cron from "node-cron";
import Income from "../models/income.js";

const isAlreadyProcessed = (lastDate, frequency) => {
  if (!lastDate) return false;

  const now = new Date();

  if (frequency === "monthly") {
    return (
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getFullYear() === now.getFullYear()
    );
  }

  if (frequency === "weekly") {
    const diff = (now - lastDate) / (1000 * 60 * 60 * 24);
    return diff < 7;
  }

  return false;
};

export const startCronJobs = () => {

  // Monthly Cron 1st of every month
  cron.schedule(
    "0 0 1 * *",
    async () => {
      console.log("Running Monthly Cron");

      const incomes = await Income.find({
        isRecurring: true,
        isActive: true,
        frequency: "monthly",
      });

      for (const inc of incomes) {
        if (isAlreadyProcessed(inc.lastProcessedDate, "monthly")) continue;

        await Income.create({
          userId: inc.userId,
          amount: inc.amount,
          source: inc.source,
          category: inc.category,
          date: new Date(),
          isRecurring: false,
          description: "Auto-generated (monthly)",
        });

        inc.lastProcessedDate = new Date();
        await inc.save();
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  // Weekly Cron every Monday
  cron.schedule(
    "0 0 * * 1",
    async () => {
      console.log("Running Weekly Cron");

      const incomes = await Income.find({
        isRecurring: true,
        isActive: true,
        frequency: "weekly",
      });

      for (const inc of incomes) {
        if (isAlreadyProcessed(inc.lastProcessedDate, "weekly")) continue;

        await Income.create({
          userId: inc.userId,
          amount: inc.amount,
          source: inc.source,
          category: inc.category,
          date: new Date(),
          isRecurring: false,
          description: "Auto-generated (weekly)",
        });

        inc.lastProcessedDate = new Date();
        await inc.save();
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("Cron Jobs Started 🚀");
};