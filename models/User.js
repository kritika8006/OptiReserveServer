import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  branch: {
    type: String,
    required: true,
    enum: ["ICE","ECE","CSE","DSE","CHE","CE","BE","TE","IT","VLSI"]
  }
});

export default mongoose.model("User", userSchema);
