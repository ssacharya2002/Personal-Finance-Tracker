import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { useEffect, useState } from "react";
import axios from "axios";


import IncomeExpenseChart from "./IncomeExpenseChart";
import ExpensePieChart from "./ExpensePieChart";


interface OverviewType {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

interface TrendType {
  day: number;
  income: number;
  expense: number;
}

interface CategoryType {
  name: string;
  value: number;
}

function Overview() {
  const [overview, setOverview] = useState<OverviewType | null>(null);
  const [trend, setTrend] = useState<TrendType[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryType[]>([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [overviewRes, trendRes, categoryRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BACKEND_URL}/api/analytics/trend`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BACKEND_URL}/api/analytics/category`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setOverview(overviewRes.data.overview);
      setTrend(trendRes.data.data);
      setCategoryData(categoryRes.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!overview) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">
          Here's your financial overview for this month
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Income */}
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              ₹{overview.totalIncome}
            </p>
          </CardContent>
        </Card>

        {/* Expense */}
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              ₹{overview.totalExpense}
            </p>
          </CardContent>
        </Card>

        {/* Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Net Balance</CardTitle>
            <CardDescription>Current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500">
              ₹{overview.netBalance}
            </p>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Used this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">
              {overview.totalIncome > 0
                ? Math.round(
                    (overview.totalExpense / overview.totalIncome) * 100
                  )
                : 0}
              %
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Income vs Expense */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly trends</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={trend} />
          </CardContent>
        </Card>

        {/* Expense by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={categoryData} />
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

export default Overview;