const {  validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const SendVerificationCode = require("../middleware/email");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.getLogin = (req, res, next) => {
  res.json({ isLoggedIn: false, success: true });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({
        isLoggedIn: false,
        errors: ["User does not exist"],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({
        isLoggedIn: false,
        message: "Invalid Password",
        errors: ["Invalid Password"],
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send verification code if user not verified
    if (!user.isVerified) {
      const verificationCode = Math.floor(100000 + Math.random() * 90000).toString();
      SendVerificationCode(user.email, verificationCode, user.firstname);
      user.verificationCode = verificationCode;
      await user.save();
    }

    res.status(200).json({
      isLoggedIn: true,
      success: true,
      token,
      user: { id: user._id, firstname: user.firstname, email: user.email, isVerified: user.isVerified },
      message: "User login successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ====================== SIGNUP ======================
exports.postSignup = [
  check("firstname")
    .trim()
    .isLength({ min: 5 })
    .withMessage("First Name should be at least 5 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets"),

  check("middlename")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Middle Name should contain only alphabets"),

  check("lastname")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("mobileno")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be exactly 10 digits")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile number should contain only digits"),

  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  check("confirmpassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { firstname, middlename, lastname, mobileno, email, password } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 90000).toString();

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({
          success: false,
          message: "Email already exists, please use another one.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        firstname,
        middlename,
        lastname,
        mobileno,
        email,
        password: hashedPassword,
        verificationCode,
      });

      await user.save();
      SendVerificationCode(user.email, verificationCode, user.firstname);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message || "Something went wrong" });
    }
  },
];

// ====================== LOGOUT ======================
exports.postLogout = async (req, res) => {
  // For JWT: just let client remove the token
  // Optionally, you can blacklist token here if needed
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ====================== EMAIL VERIFICATION, FORGOT, RESET PASSWORD ======================
// Keep your existing functions (forgotpassword, resetpassword, verifyemail)


exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yashanshukhandelwal272011@gmail.com",
        pass: "gvll culz gtkc rpab",
      },
    });
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
    res.json({ message: "Password reset link sent!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetpassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyemail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({
      // _id:req.session.user.id,
      verificationCode: code,
    });
    console.log("This is the user", user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired Code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User verified successfully" });
  } catch (error) {
    console.log("error occured", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

