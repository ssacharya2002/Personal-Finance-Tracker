import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AddBudgetDialog from "./AddBudgetDialog";
import MiniBar from "./MiniBar";

interface Category {
  _id: string;
  name: string;
  type: "expense" | "income";
}

function Budget() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchData = async () => {
    const [budgetRes, catRes] = await Promise.all([
      axios.get(`${BACKEND_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${BACKEND_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    setData(budgetRes.data.data);
    setCategories(catRes.data.categories);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (id: string) =>
    categories.find((c: Category) => c._id === id)?.name || "Unknown";

  return (
    <div className="p-4 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <AddBudgetDialog categories={categories} onAdd={fetchData} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {data.map((item: any) => (
          <Card key={item.category}>
            <CardHeader>
              <CardTitle>
                {getCategoryName(item.category)}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              {/* Amount */}
              <div className="flex justify-between">
                <span>₹{item.spent}</span>
                <span>₹{item.budget}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className={`h-2 rounded ${
                    item.percentage > 80
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Mini Graph */}
              <MiniBar
                spent={item.spent}
                budget={item.budget}
              />

            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
}

export default Budget;