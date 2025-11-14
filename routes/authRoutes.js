import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) return res.json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, password: hashed });

  res.json({ message: "User registered" });
});

// Login User
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "7d" });

  res.json({ message: "Login success", token });
});

export default router;
