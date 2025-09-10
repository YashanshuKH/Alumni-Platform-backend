const { check, validationResult } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const user = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.json({ isLoggedIn: false });
};
exports.postSignup = [
  check("firstname")
    .trim()
    .isLength({ min: 5 })
    .withMessage("First Name should be atleast 5 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contian only alphabets"),

  check("middlename")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Middle Name should contian only alphabets"),
  check("lastname")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Middle Name should contian only alphabets"),

    check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

    

    check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 5 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should be atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should be atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should be atleast one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password should be atleast one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
];
