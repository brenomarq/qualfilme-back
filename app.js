require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const axios = require("axios");

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

app.get("/test", authenticateFirebaseToken, async (req, res) => {
  res.status(200).json({
    message: "Token válido!",
  });
});

// Rota - Lembrar filme
app.post("/remember-movie", authenticateFirebaseToken, async (req, res) => {
  try {
    const { description } = req.body;

    console.log(req.body);

    if (!description) {
      return res.status(400).json({
        error: "Descrição requerida",
        message: 'Forneça uma descrição do filme no campo "description"',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Configuração inválida",
        message: "Chave da API do Gemini não configurada",
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const promptText = `
            Eu não lembro o nome do filme que já assisti. Me ajude a encontrar baseado na minha lembrança:

            O que eu lembro: ${description}

            Me dê por favor um retorno json de um filme apenas, com as informações referentes ao filme:

            "introduction": "Introdução à resposta (Exemplo: Com base na sua descrição, aqui estão algumas opções de filmes de animação com gatos que lutam contra lobos:), quero que estas mensagens de introdução sejam randômicas."
            "title": "Título do filme lembrado",
            "year": "Ano do filme",
            "description": "Descrição do filme",
            "conclusion": "Exemplo: É muito provável que seja esse! O filme que você descreveu..."
        `;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataResponse = response.data;

    res.json(dataResponse);
  } catch (error) {
    console.error("Erro na requisição:", error.message);

    if (error.response) {
      // Erro da API do Gemini
      return res.status(error.response.status).json({
        error: "Erro na API do Gemini",
        message: error.response.data?.error?.message || "Erro desconhecido",
        details: error.response.data,
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro inesperado no processamento da requisição",
    });
  }
});

// Rota - Sugerir filme
app.post("/suggest-movies", authenticateFirebaseToken, async (req, res) => {
  try {
    const { description } = req.body;

    console.log(req.body);

    if (!description) {
      return res.status(400).json({
        error: "Descrição requerida",
        message: 'Forneça uma descrição do filme no campo "description"',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Configuração inválida",
        message: "Chave da API do Gemini não configurada",
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const promptText = `
            Me dê no mínimo 2 e no máximo 4 sugestões de filmes baseados nessa ideia:
        
            ${description}
        
            Me dê por favor um retorno json, com uma introdução geral à resposta e as informações referentes aos filmes sugeridos:

            recommendations: [
                {
                    introduction: String,
                    movies: [
                        {
                            id: Int 
                            title: String
                            year: Int
                            description: String
                        }
                    ]
                }
            ]

            Introdução geral:
        
            "introduction": "Introdução à resposta (Exemplo: Você deseja assistir filmes românticos e musicais. Então aqui vai as recomendações mais quentes:), quero que estas mensagens de introdução sejam randômicas."
        
            Informação dos filmes:
            
            "id": 1 
            "title": "Título do filme sugerido",
            "year": "Ano do filme",
            "description": "Descrição do filme em relação à ideia do usuário"
        `;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dataResponse = response.data;

    res.json(dataResponse);
  } catch (error) {
    console.error("Erro na requisição:", error.message);

    if (error.response) {
      // Erro da API do Gemini
      return res.status(error.response.status).json({
        error: "Erro na API do Gemini",
        message: error.response.data?.error?.message || "Erro desconhecido",
        details: error.response.data,
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro inesperado no processamento da requisição",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Firebase Admin SDK inicializado com sucesso!");
});
