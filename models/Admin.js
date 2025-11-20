import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

  designation: String,
  department: String,

  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
