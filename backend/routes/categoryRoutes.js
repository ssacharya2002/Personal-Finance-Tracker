import express from "express";
import Category from "../models/Category.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().select("_id name type");

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;