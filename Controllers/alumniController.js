const User = require("../models/User");

exports.getAlumni = async (req, res, next) => {
  try {
    const alumni = await User.find();
    res.json(
     alumni
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching alumni" });
  }
};
