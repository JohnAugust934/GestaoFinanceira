const express = require("express");
const router = express.Router();
const { register, login, getLoggedInUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", login);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", authMiddleware, getLoggedInUser);

module.exports = router;

