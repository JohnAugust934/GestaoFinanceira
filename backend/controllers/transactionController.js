const Transaction = require("../models/Transaction");

// @desc    Get all transactions for logged in user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    // Find transactions for the logged-in user (req.user.id comes from authMiddleware)
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }); // Sort by date descending
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
  const { description, amount, category, type, date } = req.body;

  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      description,
      amount,
      category,
      type,
      date: date ? new Date(date) : Date.now() // Use provided date or default to now
    });

    const transaction = await newTransaction.save();
    res.status(201).json(transaction); // 201 Created
  } catch (err) {
    console.error(err.message);
    // Handle potential validation errors from Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages });
    }
    res.status(500).send("Erro no servidor");
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  const { description, amount, category, type, date } = req.body;

  // Build transaction object based on fields submitted
  const transactionFields = {};
  if (description) transactionFields.description = description;
  if (amount) transactionFields.amount = amount;
  if (category) transactionFields.category = category;
  if (type) transactionFields.type = type;
  if (date) transactionFields.date = new Date(date);

  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transação não encontrada" });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Não autorizado" });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages });
    }
    res.status(500).send("Erro no servidor");
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transação não encontrada" });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Não autorizado" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ msg: "Transação removida" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

