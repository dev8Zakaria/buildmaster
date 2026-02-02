import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const hf = new HfInference(process.env.HF_TOKEN);

export const generateText = async (prompt) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            // CORRECTION ICI : Utilise ce modèle supporté
            model: "llama-3.3-70b-versatile", 
            temperature: 0.5,
        });
        return completion.choices[0]?.message?.content || "Désolé, je n'ai pas de réponse.";
    } catch (error) {
        console.error("❌ Groq Error:", error.message);
        return "Je rencontre un problème technique avec mon modèle de langage.";
    }
};

export const generateEmbedding = async (text) => {
    try {
        const response = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: text,
        });
        if (Array.isArray(response) && Array.isArray(response[0])) {
            return response[0];
        }
        return response;
    } catch (error) {
        console.error("❌ HF Embedding Error:", error.message);
        throw new Error("Erreur de vectorisation");
    }
};