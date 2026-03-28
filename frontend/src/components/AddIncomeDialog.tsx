import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import axios from "axios";


interface CategoryType {
  _id: string;
  name: string;
  type: "expense" | "income";
}

interface Props {
  categories: CategoryType[];
  onAdd?: () => void;
}

function AddIncomeDialog({ categories, onAdd }: Props) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    source: "",
    category: "",
    amount: "",
    date: "",
    frequency: "one-time" as "one-time" | "weekly" | "monthly",
    description: "",
  });

  const [loading, setLoading] = useState(false);


  const incomeCategories = categories.filter(
    (cat) => cat.type === "income"
  );

  console.log(incomeCategories);
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.source || !formData.category || !formData.amount) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${BACKEND_URL}/api/income`,
        {
          source: formData.source,
          category: formData.category,
          amount: Number(formData.amount),
          date: formData.date,
          frequency: formData.frequency,
          isRecurring: formData.frequency !== "one-time",
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setFormData({
        source: "",
        category: "",
        amount: "",
        date: "",
        frequency: "one-time",
        description: "",
      });


      setOpen(false);

      onAdd?.();

    } catch (err) {
      console.error(err);
      alert("Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Income
        </Button>
      </DialogTrigger>

      {/* Modal */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Record your income
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Source</label>
            <Input
              placeholder="e.g. Salary, Freelance"
              value={formData.source}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  source: e.target.value,
                }))
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select
              value={formData.frequency}
              onValueChange={(value: "one-time" | "weekly" | "monthly") =>
                setFormData((prev) => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Optional"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Income"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddIncomeDialog;