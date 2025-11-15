import dotenv from "dotenv";
dotenv.config()

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";

const app = express();
const PORT = 5000;
 
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/seats", seatRoutes);

// MongoDB connection (local)
const uri = `${process.env.MONGO_URI}libbooking`; // local DB
mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
