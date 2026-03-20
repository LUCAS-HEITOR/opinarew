const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Cloud Function para adicionar opinião com validação de delay
exports.addOpinion = functions.https.onCall(async (data, context) => {
  try {
    const { texto, autor, clientId } = data;

    // Validações básicas
    if (!texto || typeof texto !== "string") {
      throw new functions.https.HttpsError("invalid-argument", "Texto inválido");
    }

    if (texto.trim().length < 10) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Opinião muito curta! Mínimo 10 caracteres."
      );
    }

    if (texto.length > 1000) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Opinião muito longa! Máximo 1000 caracteres."
      );
    }

    if (!clientId) {
      throw new functions.https.HttpsError("invalid-argument", "ClientId obrigatório");
    }

    // Buscar último envio do usuário
    const ultimoEnvioRef = db.collection("lastSubmissions").doc(clientId);
    const ultimoEnvioDoc = await ultimoEnvioRef.get();

    const DELAY_MINUTOS = 1.75; // 1 minuto e 45 segundos
    const DELAY_MS = DELAY_MINUTOS * 60 * 1000;
    const agora = Date.now();

    if (ultimoEnvioDoc.exists) {
      const ultimoTimestamp = ultimoEnvioDoc.data().timestamp;
      const diferenca = agora - ultimoTimestamp;

      if (diferenca < DELAY_MS) {
        const tempoRestante = Math.ceil((DELAY_MS - diferenca) / 1000);
        throw new functions.https.HttpsError(
          "failed-precondition",
          `Aguarde ${tempoRestante}s antes de enviar outra opinião`
        );
      }
    }

    // Adicionar opinião ao Firestore
    const novaOpiniao = {
      texto: texto.trim(),
      autor: (autor && autor.trim()) || "Anônimo",
      categoria: "pendente",
      dataEnvio: admin.firestore.Timestamp.now(),
      lida: false,
      clientId: clientId, // Identificador do cliente (não é IP público)
    };

    const docRef = await db.collection("opinioes").add(novaOpiniao);

    // Atualizar último envio do usuário
    await ultimoEnvioRef.set({
      timestamp: agora,
      opiniaoId: docRef.id,
    });

    return {
      success: true,
      message: "✨ Opinião enviada com sucesso! Obrigado! 🔥",
      opiniaoId: docRef.id,
    };
  } catch (erro) {
    console.error("Erro ao adicionar opinião:", erro);
    throw erro;
  }
});

// Cloud Function para obter estatísticas
exports.getStats = functions.https.onCall(async (data, context) => {
  try {
    const snapshot = await db.collection("opinioes").get();
    const opinioes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const total = opinioes.length;
    const pendentes = opinioes.filter((op) => op.categoria === "pendente").length;
    const normais = opinioes.filter((op) => op.categoria === "normal").length;
    const criminosas = opinioes.filter((op) => op.categoria === "criminosa").length;
    const lucidas = opinioes.filter((op) => op.categoria === "lucida").length;
    const chatDecide = opinioes.filter((op) => op.categoria === "chat-decide").length;

    return {
      total,
      pendentes,
      normais,
      criminosas,
      lucidas,
      chatDecide,
    };
  } catch (erro) {
    console.error("Erro ao obter estatísticas:", erro);
    throw erro;
  }
});
