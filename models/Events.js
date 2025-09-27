const mongoose = require("mongoose");

// --- 1. Sub-Schema for Event Registration Details (Embedded in Attendee) ---

const registeredEventSchema = new mongoose.Schema({
    // Reference to the main Event Model
    eventTitle: {type: String, required: true}, 
    registrationDate: {type: Date, default: Date.now},
    ticketsPurchased: {type: Number, default: 1}
}, { _id: false }); // Set _id: false if you don't need a unique ID for each embedded document

// --- 2. Event Schema ---

const eventSchema = new mongoose.Schema({
    // Basic Details
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true },
    
    // Time and Date
    startDate: {type: Date, required: true },
    endDate: {type: Date },
    
    // Location
    location: {type: String, required: true, trim: true},
    isOnline: {type: Boolean, default: false},
    onlineLink: {type: String, required: function() { return this.isOnline; } 
    },

    // Organizer Information
    organizerName: {type: String, required: true},
    
    // Status and Pricing
    capacity: {type: Number, default: 0}, 
    price: {type: Number, default: 0}, 
    
    // Timestamps
    createdOn: {type: Date, default: Date.now},
    updatedOn: {type: Date, default: Date.now}
});

// --- 3. Attendee/User Schema ---

const attendeeSchema = new mongoose.Schema({
    // Personal Information (similar to your userSchema)
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    mobileno: {type: String},
    email: {type: String, required: true, unique: true,lowercase: true},
    password: {type: String, required: true}, 
    
    // Security Tokens
    resetToken: String,
    resetTokenExpiry: Date,

    // Events the attendee is registered for (Embedding the sub-schema)
    registeredEvents: [registeredEventSchema]
});


// --- 4. Exporting Both Models ---
// We use module.exports as an object to export multiple items

module.exports = {
    Event: mongoose.model("Event", eventSchema),
    Attendee: mongoose.model("Attendee", attendeeSchema)
};

// --- How to use this file in another file (e.g., in a controller) ---
/*
    const { Event, Attendee } = require('./path/to/this/file');

    // Example usage:
    // const newEvent = new Event({ title: "Tech Talk", startDate: new Date() });
    // await newEvent.save();
*/