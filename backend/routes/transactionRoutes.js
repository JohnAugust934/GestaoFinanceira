const express = require("express");
const router = express.Router();
const { getTransactions, addTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

// All transaction routes are private, so apply authMiddleware to all
router.use(authMiddleware);

// @route   GET api/transactions
// @desc    Get all transactions for logged in user
// @access  Private
router.get("/", getTransactions);

// @route   POST api/transactions
// @desc    Add new transaction
// @access  Private
router.post("/", addTransaction);

// @route   PUT api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put("/:id", updateTransaction);

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete("/:id", deleteTransaction);

module.exports = router;

