const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // <-- adjust path

exports.getLogin = (req, res, next) => {
  res.json({ isLoggedIn: false, success: true });
};
exports.postLogin = async (req, res, next) => {
  const { firstname , mobileno, password } = req.body;

  const user = await User.findOne({ mobileno });
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
  // req.session.user = user;
  // req.session.isLoggedIn = true;
  // await req.session.save();
  res.json({ isLoggedIn: true, success: true });``
};

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

  check("dob")
    .notEmpty()
    .withMessage("Date of Birth is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format")
    .custom((value) => {
      const today = new Date();
      const dob = new Date(value);

      let age = today.getFullYear() - dob.getFullYear();
      const monthdiff = today.getMonth() - dob.getMonth();
      if (
        monthdiff < 0 ||
        (monthdiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        throw new Error("You must be at least 18 years old to sign up");
      }
      return true;
    }),

  check("pannumber")
    .isLength({ min: 10, max: 10 })
    .withMessage("PAN number must be exactly 10 characters")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("Invalid PAN format"),

  check("aadhaarnumber")
    .isLength({ min: 12, max: 12 })
    .withMessage("Aadhaar number must be exactly 12 digits")
    .matches(/^[0-9]{12}$/)
    .withMessage("Aadhaar number should contain only digits"),

    check("address")
  .notEmpty()
  .withMessage("Address is required"),

check("pincode")
  .isLength({ min: 6, max: 6 })
  .withMessage("Pincode must be exactly 6 digits")
  .matches(/^[0-9]{6}$/)
  .withMessage("Pincode should contain only digits"),

check("city")
  .notEmpty()
  .withMessage("City is required")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("City should contain only alphabets"),

check("state")
  .notEmpty()
  .withMessage("State is required")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("State should contain only alphabets"),

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
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  async (req, res, next) => {
    const {
      firstname,
      middlename,
      lastname,
      mobileno,
      email,
      dob,
      pannumber,
      aadhaarnumber,
      address,
      pincode,
      city,
      state,
      password,
    } = req.body;

    const errors = validationResult(req);

    // Validation failed
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(), // send all field errors
      });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({
          success: false,
          message: "Email already exists, please use another one.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("arrived");
      // Save user
      const user = new User({
        firstname,
        middlename,
        lastname,
        mobileno,
        email,
        dob,
        pannumber,
        aadhaarnumber,
        address,
        pincode,
        city,
        state,
        password: hashedPassword,
      });
      await user.save();

      // Success response
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  },
];
