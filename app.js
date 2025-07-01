require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Firebase Admin SDK inicializado com sucesso!");
});
