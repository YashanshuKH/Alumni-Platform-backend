const User = require("../models/User");

exports.getAllAlumni = async (req, res) => {
  try {
    const [ alumni] = await Promise.all([
      User.find({ role: "Alumni" }),
    ]);

    const [ alumniCount] = await Promise.all([
      User.countDocuments({ role: "Alumni" }),
    ]);

    res.status(200).json({
      alumni: {
        count: alumniCount,
        data: alumni,
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getAllStudents = async (req, res) => {
  try {
    const alumni = await User.find({ role: "Alumni" })
      .select("firstname lastname email mobileno lastSeen");
    const [ studentCount] = await Promise.all([
      User.countDocuments({ role: "Alumni" }),
    ]);
    res.status(200).json({
      students: {
        count: studentCount,
        data: students,
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.ActiveUsers = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "Student" });
    const alumniCount = await User.countDocuments({ role: "Alumni" });

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const inactiveAlumni = await User.countDocuments({
      role: "Alumni",
      lastSeen: { $lt: twoMonthsAgo }
    });

    const inactiveStudents = await User.countDocuments({
      role: "Student",
      lastSeen: { $lt: twoMonthsAgo }
    });

    const activeAlumni = alumniCount - inactiveAlumni;
    const activeStudents = studentCount - inactiveStudents;

    const AlumniactivePercentage = (activeAlumni / alumniCount) * 100 || 0;
    const StudentactivePercentage = (activeStudents / studentCount) * 100 || 0;

    // Send ONLY one response
    return res.status(200).json({
      AlumniactivePercentage,
      StudentactivePercentage,
      alumniCount,
      studentCount
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
