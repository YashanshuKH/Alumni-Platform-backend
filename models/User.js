const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String },
  lastname: { type: String, required: true },
  mobileno: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  pannumber: { type: String, required: true },
  aadhaarnumber: { type: String, required: true },
  address: { type: String },
  pincode: { type: String },
  city: { type: String },
  state: { type: String },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
