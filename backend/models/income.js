import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  frequency: {
    type: String, // "monthly" or "weekly"
    default: "one-time",
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true, // user can toggle this
  },
  description: {
    type: String,
    default: "",
  },
  lastProcessedDate: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Income", incomeSchema);
