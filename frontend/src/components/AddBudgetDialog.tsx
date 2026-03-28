import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

function AddBudgetDialog({ categories, onAdd }: any) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    category: "",
    amount: "",
  });

  const expenseCategories = categories.filter(
    (c: any) => c.type === "expense"
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/budget`,
      {
        category: form.category,
        amount: Number(form.amount),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setOpen(false);
    onAdd();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Budget
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Budget</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Select
            onValueChange={(val) =>
              setForm((p) => ({ ...p, category: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((c: any) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Budget Amount"
            type="number"
            onChange={(e) =>
              setForm((p) => ({ ...p, amount: e.target.value }))
            }
          />

          <Button type="submit" className="w-full">
            Save Budget
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddBudgetDialog;