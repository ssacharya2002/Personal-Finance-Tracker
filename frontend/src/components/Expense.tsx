import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import AddExpenseDialog from "./AddExpenseDialog";

interface ExpenseType {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

interface ExpenseResponse {
  success: boolean;
  expenses: ExpenseType[];
}

interface CategoryType {
  _id: string;
  name: string;
  type: "expense" | "income";
}

interface CategoryResponse {
  success: boolean;
  categories: CategoryType[];
}

function Expense() {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token");

    const fetchExpense = async () => {
      const res = await axios.get<ExpenseResponse>(
        `${BACKEND_URL}/api/expense`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses(res.data.expenses);

      const categoryRes = await axios.get<CategoryResponse>(
        `${BACKEND_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(categoryRes.data.categories);
    };

    fetchExpense();
  }, []);

  useEffect(() => {
    console.log(expenses);
    console.log(categories);
  }, [expenses, categories]);

  const handleDelete = async (id: string) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${BACKEND_URL}/api/expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense</h1>
          <p className="text-muted-foreground">
            View and manage all your Expense
          </p>
        </div>
        <AddExpenseDialog categories={categories} />{" "}
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expense</CardTitle>
          <CardDescription>All your recorded Expense</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table Head */}
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-3 font-medium">Description</th>
                  <th className="py-3 font-medium">Type</th>
                  <th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense._id} className="border-b">
                      <td className="py-4">
                        {expense.description ||
                          categories.find(
                            (category) => category._id === expense.category
                          )?.name}
                      </td>

                      <td>
                        <Badge variant="destructive">Expense</Badge>
                      </td>

                      <td className="text-red-500 font-medium">
                        -₹{expense.amount}
                      </td>

                      <td>{new Date(expense.date).toLocaleDateString()}</td>

                      <td className="text-right">
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Expense;
