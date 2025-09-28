const express = require("express");
const adminRouter = express.Router();

const adminController = require("../Controllers/adminController");
const userController = require("../controllers/userController");

// ===================================================
// ADMIN MANAGEMENT ROUTES
// ===================================================

// Users Management

// GET all users
adminRouter.get("/:adminId/users", userController.getAllUsers);

// GET a specific user by ID
adminRouter.get("/:adminId/users/:userId", userController.getUserById);

// UPDATE a user's role or status
adminRouter.put("/:adminId/users/:userId", userController.updateUserRoleOrStatus);

// DELETE a user account
adminRouter.delete("/:adminId/users/:userId", userController.deleteUser);

// ---------------------------------------------------

// Content/Job Management

// Create a new job post
adminRouter.post("/:adminId/post-job", adminController.createJob);

// Approve a pending job post
adminRouter.put("/:adminId/jobs/:jobId/approve", adminController.approveJob);

// Delete any job post
adminRouter.delete("/:adminId/jobs/:jobId", adminController.deleteAnyJob);

// ---------------------------------------------------

// Analytics/Dashboard

// GET general dashboard statistics
adminRouter.get("/:adminId/dashboard-stats", adminController.getDashboardStats);

// ---------------------------------------------------

module.exports = adminRouter;