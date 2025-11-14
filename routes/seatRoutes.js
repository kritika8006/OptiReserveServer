import express from "express";
import Seat from "../models/Seat.js";

const router = express.Router();

// GET all seats
router.get("/", async (req, res) => {
  try {
    let seats = await Seat.find();

    if (!seats.length) {
      const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
      let id = 1;
      const allSeats = [];
      for (let floor of floors) {
        for (let i = 1; i <= 32; i++) {
          allSeats.push({ id: id++, floor, status: "free" });
        }
      }
      await Seat.insertMany(allSeats);
      seats = allSeats;
    }

    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// RESET all seats (make everything free again)
router.post("/reset", async (req, res) => {
  try {
    // delete all seats
    await Seat.deleteMany({});

    // recreate fresh seats
    const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
    let id = 1;
    const allSeats = [];

    for (let floor of floors) {
      for (let i = 1; i <= 32; i++) {
        allSeats.push({
          id: id++,
          floor,
          status: "free",
          studentName: "",
          rollNo: "",
          checkinTime: null,
          endAtTime: null
        });
      }
    }

    await Seat.insertMany(allSeats);

    res.json({
      message: "All seats reset successfully!",
      totalSeats: allSeats.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reset failed", error });
  }
});


// GET seats booked by a specific roll number
router.get("/my/:rollNo", async (req, res) => {
  try {
    const rollNo = req.params.rollNo;
    if (!rollNo) return res.status(400).json({ message: "Roll number is required" });

    const mySeats = await Seat.find({ rollNo });
    res.json(mySeats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// POST book seat(s)
router.post("/book", async (req, res) => {
  try {
    const { seatIds, studentName, rollNo, checkinTime } = req.body;

    if (!seatIds || seatIds.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const seatsToBook = await Seat.find({ id: { $in: seatIds } });
    const occupied = seatsToBook.filter((s) => s.status !== "free");

    if (occupied.length > 0) {
      return res
        .status(400)
        .json({ message: `Seats ${occupied.map((s) => s.id).join(", ")} are not free` });
    }



    // ----------------------------
    // FIX: AUTO CALCULATE END TIME
    // ----------------------------
    const checkin = new Date(checkinTime);

    // 3 hours = 180 minutes = 10800 sec = 10800000 ms
    const endAtTime = new Date(checkin.getTime() + 3 * 60 * 60 * 1000);

    await Seat.updateMany(
      { id: { $in: seatIds } },
      {
        $set: {
          status: "booked",
          studentName,
          rollNo,
          checkinTime: checkin,
          endAtTime: endAtTime,
        },
      }
    );

    res.json({ message: "Seat(s) booked successfully", endAtTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST release a seat
router.post("/:seatId/release", async (req, res) => {
  try {
    const seatId = parseInt(req.params.seatId);
    if (!seatId) return res.status(400).json({ message: "Seat ID is required" });

    const seat = await Seat.findOne({ id: seatId });
    if (!seat || seat.status === "free") {
      return res.status(400).json({ message: "Seat is already free" });
    }

    await Seat.updateOne({ id: seatId }, { $set: { status: "free", studentName: "", rollNo: "" } });

    res.json({ message: `Seat ${seatId} released successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
