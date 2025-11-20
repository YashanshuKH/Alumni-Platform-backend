const { validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const SendVerificationCode = require("../middleware/email");
const crypto = require("crypto");
const SendResendMail = require("../middleware/Reset");

// Constants
const JWT_SECRET = process.env.JWT_SECRET;
const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Helper Functions
const generateVerificationCode = () =>
  crypto.randomInt(100000, 999999).toString();

const createSession = async (req, user, res) => {
  try {
    // Update in DB
    user.lastseen = new Date();
    await user.save();

    // Save into session also
    req.session.isLoggedIn = true;
    req.session.user = {
      id: user._id,
      firstname: user.firstname,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      lastseen: user.lastseen,
    };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session save failed",
        });
      }

      return res.status(200).json({
        success: true,
        isLoggedIn: true,
        user: req.session.user,
        message: "Login successful",
      });
    });
  } catch (error) {
    console.error("Session Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Check Session
exports.checking = async (req, res) => {
  if (req.session.isLoggedIn && req.session.user) {
    const user = await User.findById(req.session.user._id);

    if (user) {
      user.lastseen = new Date();
      await user.save();

      // update session user also (so frontend gets latest values)
      req.session.user = user;
    }
  }

  return res.json({
    success: true,
    isLoggedIn: req.session.isLoggedIn || false,
    role: req.session.role,
    user: req.session.user || null,
  });
};

// Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // If not verified, handle verification
    if (!user.isVerified) {
      const code = generateVerificationCode();
      user.verificationCode = code;
      user.verificationCodeExpiry = Date.now() + VERIFICATION_CODE_EXPIRY;
      await user.save();
      await SendVerificationCode(user.email, code, user.firstname);

      return res.status(200).json({
        success: true,
        requiresVerification: true,
        user: { id: user._id, email: user.email },
        message: "Verification code sent",
      });
    }

    // ⭐ FIX: update lastSeen on login
    user.lastseen = new Date();
    await user.save();

    // Create session
    return createSession(req, user, res);

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Signup Validation
const signupValidationRules = [
  check("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should contain alphabets only"),

  check("middlename")
    .optional()
    .trim()
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Middle name should contain alphabets only"),

  check("lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last name should contain alphabets only"),

  check("mobileno")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be exactly 10 digits")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile number must contain digits only"),

  check("role").notEmpty().withMessage("Role cannot be empty"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),

  check("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Signup
exports.postSignup = [
  ...signupValidationRules,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    try {
      const {
        firstname,
        middlename,
        lastname,
        mobileno,
        email,
        password,
        role,
      } = req.body;

      if (await User.findOne({ email }))
        return res
          .status(422)
          .json({ success: false, message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const code = generateVerificationCode();

      const user = await User.create({
        firstname,
        middlename,
        lastname,
        mobileno,
        email,
        role,
        password: hashedPassword,
        verificationCode: code,
        verificationCodeExpiry: Date.now() + VERIFICATION_CODE_EXPIRY,
      });

      await SendVerificationCode(email, code, firstname);

      return res.status(201).json({
        success: true,
        message: "Account created. Check your email for verification code.",
      });
    } catch (error) {
      console.error("Signup Error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
];

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      verificationCode: code,
      verificationCodeExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return createSession(req, user, res);
  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const code = generateVerificationCode();
    user.verificationCode = code;
    user.verificationCodeExpiry = Date.now() + VERIFICATION_CODE_EXPIRY;
    await user.save();

    await SendVerificationCode(user.email, code, user.firstname);

    return res.json({ success: true, message: "Code resent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Logout failed" });

    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "none",
      secure: false, // set to true if using https
    });

    return res.json({ success: true, message: "Logged out successfully" });
  });
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // ✅ Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "✅ Password reset successful! Please log in.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await SendResendMail(user.email, user.firstname, resetLink);

    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
