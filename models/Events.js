const mongoose = require("mongoose");

const registeredEventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  ticketsPurchased: { type: Number, default: 1 }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String, required: true, trim: true },
  isOnline: { type: Boolean, default: false },
  onlineLink: { 
    type: String, 
    required: function() { return this.isOnline; } 
  },
  organizerName: { type: String, required: true },
  capacity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

const attendeeSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  mobileno: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
  registeredEvents: [registeredEventSchema]
});

module.exports = {
  Event: mongoose.model("Event", eventSchema),
  Attendee: mongoose.model("Attendee", attendeeSchema)
};
