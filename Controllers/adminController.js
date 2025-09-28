const User = require("../models/User");

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments(); // count all users
    res.status(200).json({ totalUsers: count }); // send count as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching user count" });
  }
};