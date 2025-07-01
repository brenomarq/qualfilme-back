const admin = require("firebase-admin");

async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Token de autorização ausente ou mal formatado." });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Erro ao verificar Firebase ID Token:", error.message);

    if (error.code === "auth/id-token-expired") {
      return res
        .status(401)
        .json({ message: "Token expirado. Por favor, faça login novamente." });
    } else if (
      error.code === "auth/argument-error" ||
      error.code === "auth/invalid-id-token"
    ) {
      return res.status(401).json({ message: "Token inválido ou malformado." });
    } else {
      return res
        .status(401)
        .json({ message: "Falha na autenticação. Tente novamente." });
    }
  }
}

module.exports = { authenticateFirebaseToken };
