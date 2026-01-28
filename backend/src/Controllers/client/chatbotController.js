import { generateText } from "../../Services/GoogleAIService.js";
import prisma from "../../Config/prisma.js";

// In-memory session store (Map<userId, SessionData>)
// SessionData: { mode: 'GUIDED' | 'FREE', step: 'START' | 'BUDGET' | 'USAGE', data: { budget: null, usage: null } }
const sessions = new Map();

const getSession = (userId) => {
    if (!sessions.has(userId)) {
        sessions.set(userId, {
            mode: 'FREE', // Default to free chat until keywords trigger guided
            step: 'START',
            data: {}
        });
    }
    return sessions.get(userId);
};

const resetSession = (userId) => {
    sessions.set(userId, {
        mode: 'FREE',
        step: 'START',
        data: {}
    });
};

const detectIntent = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes("build") || lower.includes("recommend") || lower.includes("pc for") || lower.includes("suggest")) {
        return 'GUIDED';
    }
    return 'FREE';
};

export const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user ? req.user.id : 'guest-' + req.ip; // Fallback for guests

        const session = getSession(userId);
        let responseText = "";

        // 1. Check for global reset or mode switch
        if (detectIntent(message) === 'GUIDED' && session.mode !== 'GUIDED') {
            resetSession(userId);
            session.mode = 'GUIDED';
            session.step = 'ASK_BUDGET'; // Skip start, go straight to business
            return res.json({
                response: "I can help you build a PC! First, what is your budget? (e.g., $1000)"
            });
        }

        // 2. State Machine for GUIDED Mode
        if (session.mode === 'GUIDED') {
            switch (session.step) {
                case 'ASK_BUDGET':
                    // Try extract number
                    const budgetMatch = message.match(/\d+/);
                    if (budgetMatch) {
                        session.data.budget = parseInt(budgetMatch[0]);
                        session.step = 'ASK_USAGE';
                        responseText = `Got it, $${session.data.budget}. What will you use this PC for? (Gaming, Office, Editing) and do you have brand preferences?`;
                    } else {
                        responseText = "I didn't catch a budget amount. Please tell me a number (e.g. 1500).";
                    }
                    break;

                case 'ASK_USAGE':
                    session.data.usage = message;
                    session.step = 'RECOMMENDING';

                    // --- GENERATE RECOMMENDATION ---
                    responseText = await generateRecommendation(session.data);

                    // Reset to free mode after recommendation so user can ask follow-ups
                    session.mode = 'FREE';
                    session.step = 'START';
                    break;

                default:
                    session.mode = 'FREE';
                    responseText = "Let's start over. How can I help?";
            }
        }
        // 3. Fallback to Free Chat (LLM)
        else {
            // Context injection using DB stats? Maybe later.
            // Direct LLM call
            const prompt = `You are a helpful PC Building assistant for a store called 'Build Master'.
            User asked: "${message}"
            Answer concisely and helpfully about PC hardware.`;

            responseText = await generateText(prompt);
        }

        res.json({ response: responseText });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ response: "Sorry, my brain is offline right now. Try again later." });
    }
};

// Helper to generate recommendation
async function generateRecommendation(data) {
    const { budget, usage } = data;

    // Simple Logic Rule
    // 1. Budget split (rough heuristic): GPU 40%, CPU 20%, etc.
    const maxGpuPrice = budget * 0.45;
    const maxCpuPrice = budget * 0.25;

    // fetch database components
    // We fetch a few options to let LLM pick
    const cpus = await prisma.component.findMany({
        where: { category: { name: { contains: 'Processeur', mode: 'insensitive' } }, price: { lte: maxCpuPrice } },
        take: 3, orderBy: { price: 'desc' }, select: { name: true, price: true, brand: true }
    });

    const gpus = await prisma.component.findMany({
        where: { category: { name: { contains: 'Carte Graphique', mode: 'insensitive' } }, price: { lte: maxGpuPrice } },
        take: 3, orderBy: { price: 'desc' }, select: { name: true, price: true }
    });

    // Fallback if stock empty
    if (cpus.length === 0 || gpus.length === 0) {
        return `I looked for components under $${budget} for ${usage}, but our stock is currently limited for that price range. I'd suggest checking our "Build PC" page manually!`;
    }

    // Pass data to LLM to compose the message
    const context = `
    User Budget: ${budget}
    User Usage: ${usage}
    Available CPUs: ${JSON.stringify(cpus)}
    Available GPUs: ${JSON.stringify(gpus)}
    `;

    const prompt = `Act as a PC sales expert. Based on the user's budget and usage, recommend ONE CPU and ONE GPU from the available list below.
    Explain why they fit the usage.
    ${context}
    
    Structure the answer as:
    "For your budget of $${budget} and usage '${usage}', I recommend:
    - **CPU**: [Name] ($[Price])
    - **GPU**: [Name] ($[Price])
    
    [Explanation why]"`;

    return await generateText(prompt);
}
