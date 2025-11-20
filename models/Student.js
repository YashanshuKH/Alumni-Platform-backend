import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

  rollNumber: String,
  branch: String,
  year: Number,

  projects: [
    {
      title: String,
      description: String,
      link: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
