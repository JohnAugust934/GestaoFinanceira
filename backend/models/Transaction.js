const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referência ao modelo User
    required: true,
  },
  description: {
    type: String,
    required: [true, "Por favor, adicione uma descrição"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Por favor, adicione um valor (positivo para receita, negativo para despesa)"],
  },
  category: {
    type: String,
    required: [true, "Por favor, adicione uma categoria"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["receita", "despesa"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);

