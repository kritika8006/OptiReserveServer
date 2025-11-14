import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { name, rollNo, branch } = req.body;

    if (!name || !rollNo || !branch) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedBranches = ["ICE","ECE","CSE","DSE","CHE","CE","BE","TE","IT","VLSI"];
    if (!allowedBranches.includes(branch)) {
      return res.status(400).json({ message: "Invalid branch" });
    }

    if (!/^\d{8}$/.test(rollNo)) {
      return res.status(400).json({ message: "Roll No must be exactly 8 digits" });
    }

    let user = await User.findOne({ rollNo });
    if (!user) {
      user = new User({ name, rollNo, branch });
      await user.save();
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
