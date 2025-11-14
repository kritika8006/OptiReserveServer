import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    floor: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["free", "booked", "soon_to_be_free"],
      default: "free",
    },

    studentName: {
      type: String,
      default: "",
    },

    rollNo: {
      type: String,
      default: "",
    },

    // When user booked the seat
    bookingTime: {
      type: Date,
      default: null,
    },

    // Saved check-in time (for MySeatsPage)
    checkinTime: {
      type: Date,
      default: null,
    },

    // End time if booking ends early
    endAtTime: {
      type: Date,
      default: null,
    },

    // Notification sent when 30 min remain
    notified: {
      type: Boolean,
      default: false,
    },

    // Stores the exact notification time → used to check “10-min rebook window”
    notificationTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Seat", SeatSchema);
