require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const { authenticateFirebaseToken } = require("./middlewares/authMiddleware");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor NodeJS com Firebase Admin SDK funcionando!");
});

app.get("/recommend-movie", authenticateFirebaseToken, (req, res) => {
  // Desenvolver a lógica de tratamento da requisição de recomendar filme
  // para o GeminiAPI
  res.status(200).json({
    message: "Você conseguiu acessar essa rota!",
  });
});

app.get("/remember-movie", authenticateFirebaseToken, (req, res) => {
  // Desenvolver a lógica de tratamento da requisição de lembrar o filme
  // para o GeminiAPI
  res.status(200).json({
    message: "Rota acessada com sucesso!",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Firebase Admin SDK inicializado com sucesso!");
});
