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
import AddIncomeDialog from "./AddIncomeDialog";
import { Switch } from "./ui/switch";


interface IncomeType {
  _id: string;
  userId: string;
  amount: number;
  source: string;
  category: string;
  date: string;
  frequency: "one-time" | "weekly" | "monthly";
  isRecurring: boolean;
  isActive: boolean;
  description: string;
  lastProcessedDate: string | null;
}

interface IncomeResponse {
  success: boolean;
  incomes: IncomeType[];
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

function Income() {
  const [incomes, setIncomes] = useState<IncomeType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");


  const fetchData = async () => {
    try {
      const incomeRes = await axios.get<IncomeResponse>(
        `${BACKEND_URL}/api/income`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIncomes(incomeRes.data.incomes);

      const categoryRes = await axios.get<CategoryResponse>(
        `${BACKEND_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(categoryRes.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((cat) => cat._id === categoryId)?.name || "Unknown"
    );
  };


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/income/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncomes((prev) => prev.filter((inc) => inc._id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  const handleToggle = async (id: string) => {
    try {
      setLoadingId(id);

      const res = await axios.patch(
        `${BACKEND_URL}/api/income/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = res.data.income;

      setIncomes((prev) =>
        prev.map((inc) =>
          inc._id === id ? { ...inc, isActive: updated.isActive } : inc
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-muted-foreground">
            View and manage all your income
          </p>
        </div>

        <AddIncomeDialog categories={categories} onAdd={fetchData} />
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Income</CardTitle>
          <CardDescription>
            All your recorded income
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">

              {/* Head */}
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-3 font-medium">Source</th>
                  <th className="py-3 font-medium">Category</th>
                  <th className="py-3 font-medium">Frequency</th>
                  <th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium">Active</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {incomes.length > 0 ? (
                  incomes.map((income) => (
                    <tr
                      key={income._id}
                      className={`border-b`}
                    >
                      <td className="py-4">{income.source}</td>

                      <td>{getCategoryName(income.category)}</td>

                      <td>
                        <Badge variant="outline">
                          {income.frequency}
                        </Badge>
                      </td>

                      <td className="text-green-500 font-medium">
                        +₹{income.amount}
                      </td>

                      <td>
                        {new Date(income.date).toLocaleDateString()}
                      </td>

                      {/* Toggle */}
                      <td>
                        <Switch
                          checked={income.isActive}
                          disabled={loadingId === income._id}
                          onCheckedChange={() =>
                            handleToggle(income._id)
                          }
                        />
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <button
                          onClick={() => handleDelete(income._id)}
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
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No income found
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

export default Income;