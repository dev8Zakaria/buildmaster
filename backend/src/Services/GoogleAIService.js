import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

export const initGoogleAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("Google AI Service: GEMINI_API_KEY is missing via process.env");
        return;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for speed and cost-effectiveness (free tier compatible)
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("Google AI Service: Initialized with gemini-1.5-flash");
};

export const generateText = async (prompt) => {
    if (!model) initGoogleAI();
    if (!model) throw new Error("Google AI Service not initialized (Missing Key)");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Google AI Generation Error:", error);
        throw new Error("Failed to generate response from AI.");
    }
};
