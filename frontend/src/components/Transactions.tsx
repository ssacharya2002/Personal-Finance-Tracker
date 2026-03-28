import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

interface TransactionType {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface CategoryType {
  _id: string;
  name: string;
  type: "expense" | "income";
}

function Transactions() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/transaction`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data.transactions);

      const catRes = await axios.get(`${BACKEND_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const getCategoryName = (id: string) => {
    return categories.find((c) => c._id === id)?.name || "Unknown";
  };


  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : t.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 p-3">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          Combined income and expense history
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Sorted by latest
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="border-b">
                <tr>
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-left">Type</th>
                  <th className="py-3 text-left">Amount</th>
                  <th className="py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <tr key={t._id} className="border-b">

                      <td className="py-4">{t.description}</td>

                      <td>{getCategoryName(t.category)}</td>

                      <td>
                        <Badge
                          variant={
                            t.type === "income"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {t.type}
                        </Badge>
                      </td>

                      <td
                        className={
                          t.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {t.type === "income" ? "+" : "-"}₹{t.amount}
                      </td>

                      <td>
                        {new Date(t.date).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6">
                      No transactions found
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

export default Transactions;