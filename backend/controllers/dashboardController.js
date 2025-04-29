const Transaction = require("../models/Transaction");

// @desc    Get dashboard data (e.g., balance)
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    // Find all transactions for the logged-in user
    const transactions = await Transaction.find({ user: req.user.id });

    // Calculate balance
    const balance = transactions.reduce((acc, item) => acc + item.amount, 0);

    // Calculate total income
    const income = transactions
      .filter(item => item.type === 'receita')
      .reduce((acc, item) => acc + item.amount, 0);

    // Calculate total expense
    const expense = transactions
      .filter(item => item.type === 'despesa')
      .reduce((acc, item) => acc + item.amount, 0);

    // Prepare dashboard data object
    const dashboardData = {
      balance: balance.toFixed(2),
      income: income.toFixed(2),
      expense: Math.abs(expense).toFixed(2), // Expenses are stored as negative, show as positive
      transactionCount: transactions.length
      // Add more data points as needed (e.g., recent transactions, category breakdown)
    };

    res.json(dashboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor ao buscar dados do dashboard");
  }
};

