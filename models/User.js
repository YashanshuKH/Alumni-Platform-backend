const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  mobileno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  resetToken:String,
  resetTokenExpiry :Date
});

module.exports = mongoose.model("User", userSchema);
