require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permite que o Express entenda JSON no corpo da requisição

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1); // Sai do processo se não conseguir conectar ao DB
  });

// Rota de teste
app.get("/", (req, res) => {
  res.send("API de Gestão Financeira está rodando!");
});

// Definir Rotas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes")); // Adiciona as rotas de transação
app.use("/api/dashboard", require("./routes/dashboardRoutes")); // Adiciona as rotas do dashboard
// Adicionar outras rotas aqui (ex: orçamentos) conforme forem criadas

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

