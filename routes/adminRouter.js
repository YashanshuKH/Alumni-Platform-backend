const path = require('path');
const express = require('express');
const adminRouter = express.Router();

// Import the Admin Controller
const adminController = require("../Controllers/adminController");

// ========== Admin Routes ==========

// Get all admin data
adminRouter.get("/admindata", adminController.getAdminData);

// Create a new admin
adminRouter.post("/create", adminController.createEvent);

// Update admin details by ID
adminRouter.put("/update/:adminId", adminController.updateAdmin);

// Delete admin by ID
adminRouter.delete("/delete/:adminId", adminController.deleteAdmin);

// Example: Admin login
adminRouter.post("/login", adminController.loginAdmin);

module.exports = adminRouter;
