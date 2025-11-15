import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import Seat from "./models/Seat.js"; // import your Seat model

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/seats", seatRoutes);

// MongoDB connection
const uri = `${process.env.MONGO_URI}libbooking`; // local DB
mongoose.connect(uri)
    .then(() => {
        console.log("MongoDB connected");

        // ✅ Auto-release expired seats every minute
        const AUTO_RELEASE_INTERVAL = 60 * 1000; // 1 minute

        setInterval(async () => {
            try {
                const now = new Date();
                const result = await Seat.updateMany(
                    { status: "booked", endAtTime: { $lte: now } },
                    {
                        $set: {
                            status: "free",
                            studentName: "",
                            rollNo: "",
                            checkinTime: null,
                            endAtTime: null,
                        },
                    }
                );

                if (result.modifiedCount > 0) {
                    console.log(`Auto-released ${result.modifiedCount} expired seats`);
                }
            } catch (err) {
                console.error("Error auto-releasing seats:", err);
            }
        }, AUTO_RELEASE_INTERVAL);

    })
    .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
