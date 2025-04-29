const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

// All dashboard routes are private
router.use(authMiddleware);

// @route   GET api/dashboard
// @desc    Get dashboard data for logged in user
// @access  Private
router.get("/", getDashboardData);

module.exports = router;

