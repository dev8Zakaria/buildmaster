import { generateText, generateEmbedding } from "../../Services/AIService.js"; // Import nouveau service
import prisma from "../../Config/prisma.js";

export const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;

        // Intent detection (RAG trigger)
        if (message.toLowerCase().match(/(recommend|suggest|advice|build|pc|choose|which|best|storage|gpu|cpu|parts|stock)/)) {
            return await handleRecommendation(message, res);
        }

        // Simple Chat
        const response = await generateText(message);
        res.json({ response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Server error." });
    }
};

async function handleRecommendation(query, res) {
    try {
        const vector = await generateEmbedding(query);
        const vectorString = `[${vector.join(',')}]`;

        // SQL Search - Balanced Retrieval: Up to 3 per category, total 17.
        const products = await prisma.$queryRaw`
            WITH ScoredProducts AS (
                SELECT 
                    c.name, c.brand, c.price, c.specifications, cat.name as category,
                    c.embedding <=> ${vectorString}::vector as distance,
                    ROW_NUMBER() OVER (PARTITION BY c."categoryId" ORDER BY c.embedding <=> ${vectorString}::vector) as rank_in_cat
                FROM "components" c
                JOIN "component_categories" cat ON c."categoryId" = cat.id
                WHERE c.embedding IS NOT NULL
            )
            SELECT name, brand, price, specifications, category
            FROM ScoredProducts
            WHERE rank_in_cat <= 3
            ORDER BY distance ASC
            LIMIT 17;
        `;

        if (products.length === 0) {
            return res.json({ response: "I couldn't find any matching products in our stock." });
        }

        const context = products.map(p => {
            let specsText = "No specs";
            if (p.specifications) {
                specsText = Object.entries(p.specifications)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(', ');
            }
            return `- [${p.category}] ${p.brand} ${p.name} ($${p.price}) | ${specsText}`;
        }).join('\n');

        const prompt = `
        You are a specialized PC Hardware Expert for the "Build Master" store. 
        Your task is to provide expert advice using ONLY the real-time stock listed below.
        
        STOCK CONTEXT:
        ${context}
        
        USER QUESTION: ${query}
        
        INSTRUCTIONS:
        1. Be technically precise. I have provided a balanced selection of parts (up to 3 per category).
        2. If building a full PC, ensure you pick one from each necessary category found in the stock.
        3. If you don't find a specific category (like Cooling), clearly state that we are currently out of stock for that specific part.
        4. Explain your choices based on the specifications (e.g., speed, wattage).
        5. Keep the answer professional and in English.
        `;

        const aiResponse = await generateText(prompt);
        res.json({ response: aiResponse });

    } catch (err) {
        console.error("RAG Error:", err.message);
        res.json({ response: "I'm having trouble retrieving recommendations at the moment, but I can help with general hardware questions!" });
    }
}