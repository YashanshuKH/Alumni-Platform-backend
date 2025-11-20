const { default: mongoose } = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: String,
  role: String,
  location: String,
  startDate: Date,
  endDate: Date,
  description: String
}, { timestamps: true });


const alumniSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

    batch: Number,
    about: String,

    jobs: [jobSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Alumni", alumniSchema);
