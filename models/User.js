// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   firstname: { type: String, required: true },
//   middlename: { type: String },
//   lastname: { type: String, required: true },
//   mobileno: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },

//   resetToken:String,
//   resetTokenExpiry :Date
// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  address: { type: String },
  details: { type: String },
  skillsRequired: [{ type: String }],
  responsibilities: [{ type: String }],
  deadline: { type: Date, required: true },
  updatedOn: { type: Date, default: Date.now }
});

// User Schema embedding jobSchema
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  mobileno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  resetToken: String,
  resetTokenExpiry: Date,

  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpiry: { type: Date },
  verifiedAt: { type: Date },

  // Jobs array
  jobs: [jobSchema]
});

module.exports = mongoose.model("User", userSchema);


