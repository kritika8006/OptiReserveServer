import express from "express";
import cors from "cors";
import mongoose from "mongoose";
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

// Test route
app.get("/", (req, res) => res.send("Server running"));

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/libbooking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
