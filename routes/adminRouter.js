const express = require("express");
const adminRouter = express.Router();

const adminController = require("../Controllers/adminController");

// ===================================================
// ADMIN MANAGEMENT ROUTES
// ===================================================

// Users Management

// GET all users
// adminRouter.get("/:adminId/users", adminController.getAllUsers);

// GET a specific user by ID
// adminRouter.get("/:adminId/users/:userId", adminController.getUserById);

// UPDATE a user's role or status
// adminRouter.put("/:adminId/users/:userId", adminController.updateUserRoleOrStatus);

// DELETE a user account
// adminRouter.delete("/:adminId/users/:userId", adminController.deleteUser);

// ---------------------------------------------------

// Content/Job Management

// Create a new job post
// adminRouter.post("/:adminId/post-job", adminController.createJob);

// Approve a pending job post
// adminRouter.put("/:adminId/jobs/:jobId/approve", adminController.approveJob);

// Delete any job post
// adminRouter.delete("/:adminId/jobs/:jobId", adminController.deleteAnyJob);

// ---------------------------------------------------

// Analytics/Dashboard

// GET general dashboard statistics
// adminRouter.get("/:adminId/dashboard-stats", adminController.getDashboardStats);

// ---------------------------------------------------

adminRouter.get("/userscount", adminController.getUserCount);

module.exports = adminRouter;