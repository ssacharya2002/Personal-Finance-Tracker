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
import { useNavigate } from "react-router-dom";

interface CategoryType {
  _id: string;
  name: string;
  type: "expense" | "income";
}

interface Props {
  categories: CategoryType[];
}

function AddExpenseDialog({ categories }: Props) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
  });

    const [open, setOpen] = useState(false);


  const navigate = useNavigate();

  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");

      await axios.post(
        `${BACKEND_URL}/api/expense`,
        {
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Expense added");

      // reset form
      setFormData({
        category: "",
        description: "",
        amount: "",
        date: "",
      });
   
      navigate("/dashboard/expenses");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </DialogTrigger>

      {/* Modal */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Record a new Expense</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="e.g. Coffee, Rent"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
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

          {/* Submit */}
          <Button type="submit" className="w-full mt-2">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseDialog;
