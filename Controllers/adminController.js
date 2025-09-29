const { Admin } = require('../models/adminModel'); // adjust path to your Admin model

// --- Utility Helpers ---
const sendError = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

const serverError = (res, err, msg = 'Server Error') => {
  console.error(err);
  sendError(res, 500, msg);
};

// ========== Admin Controllers ==========

// 1️⃣ Get all Admin data
exports.getAdminData = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({ success: true, count: admins.length, data: admins });
  } catch (err) {
    serverError(res, err, 'Failed to fetch admin data');
  }
};

// 2️⃣ Create new Admin  (your router calls it POST /create)
exports.createEvent = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ success: true, message: 'Admin created', data: admin });
  } catch (err) {
    err.name === 'ValidationError'
      ? sendError(res, 400, err.message)
      : serverError(res, err, 'Failed to create admin');
  }
};

// 3️⃣ Update Admin details by ID
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.adminId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!admin) return sendError(res, 404, 'Admin not found');
    res.json({ success: true, message: 'Admin updated', data: admin });
  } catch (err) {
    err.name === 'CastError'
      ? sendError(res, 400, 'Invalid Admin ID')
      : err.name === 'ValidationError'
      ? sendError(res, 400, err.message)
      : serverError(res, err, 'Failed to update admin');
  }
};

// 4️⃣ Delete Admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.adminId);
    if (!admin) return sendError(res, 404, 'Admin not found');
    res.json({ success: true, message: 'Admin deleted' });
  } catch (err) {
    err.name === 'CastError'
      ? sendError(res, 400, 'Invalid Admin ID')
      : serverError(res, err, 'Failed to delete admin');
  }
};

// 5️⃣ Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) // replace with bcrypt in real app
      return sendError(res, 401, 'Invalid email or password');
    res.json({ success: true, message: 'Login successful', data: admin });
  } catch (err) {
    serverError(res, err, 'Failed to login');
  }
};
