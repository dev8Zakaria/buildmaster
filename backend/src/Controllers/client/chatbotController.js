import { generateText, generateEmbedding } from "../../Services/AIService.js"; // Import nouveau service
import prisma from "../../Config/prisma.js";

export const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;

        // Détection d'intention RAG
        if (message.toLowerCase().match(/(recommande|conseil|build|pc|choisir|quel|config)/)) {
            return await handleRecommendation(message, res);
        }

        // Chat simple
        const response = await generateText(message);
        res.json({ response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Erreur serveur." });
    }
};

async function handleRecommendation(query, res) {
    try {
        const vector = await generateEmbedding(query);
        const vectorString = `[${vector.join(',')}]`;

        // Recherche SQL
        const products = await prisma.$queryRaw`
            SELECT name, brand, price FROM "components"
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> ${vectorString}::vector
            LIMIT 3;
        `;

        if (products.length === 0) {
            return res.json({ response: "Aucun produit trouvé en stock." });
        }

        const context = products.map(p => `- ${p.brand} ${p.name} (${p.price}€)`).join('\n');
        
        // Prompt pour Llama 3
        const prompt = `
        Tu es un expert hardware. Utilise UNIQUEMENT ces produits pour répondre :
        ${context}
        
        Question utilisateur : ${query}
        
        Réponse (en français, courte et précise) :
        `;

        const aiResponse = await generateText(prompt);
        res.json({ response: aiResponse });

    } catch (err) {
        console.error("Erreur RAG:", err.message);
        // Fallback propre
        res.json({ response: "Je ne peux pas rédiger de conseil pour l'instant, mais j'ai trouvé des produits correspondants dans la base de données." });
    }
}