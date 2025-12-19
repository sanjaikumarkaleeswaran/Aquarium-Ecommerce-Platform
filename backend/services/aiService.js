import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Analyze a message using Groq AI (Llama 3)
 * @param {string} message - The user's message
 * @param {Array} history - Chat history for context
 * @returns {Promise<string>} - AI response
 */
export const analyzeMessage = async (message, history = []) => {
    try {
        console.log("AI Service: Analyzing message with Groq...");

        const apiKey = process.env.GROQ_API_KEY;
        console.log("AI Service: API Key present:", !!apiKey, apiKey ? `(Length: ${apiKey.length})` : "");

        if (!apiKey) {
            console.error("AI Service Error: GROQ_API_KEY is missing in .env");
            return "I'm currently in offline mode. Please configure my Groq API key to enable my full intelligence!";
        }

        // Instantiate Groq inside the function to prevent crash if key is missing at startup
        const groq = new Groq({ apiKey });

        // System prompt to give Dr. Fish its personality and knowledge base
        const systemPrompt = `
            You are "Dr. Fish", an expert aquarium specialist and AI assistant for an aquarium e-commerce platform.
            Your goal is to help users with:
            1. Fish compatibility (which fish can live together).
            2. Disease diagnosis and treatment (Ich, Fin rot, etc.).
            3. Water quality management (pH, Nitrogen cycle, Ammonia/Nitrite/Nitrate).
            4. Product recommendations from an aquarium shop.
            5. General aquarium maintenance tips.

            Personality: Friendly, professional, slightly aquatic-themed (use occasional fish puns), and very helpful.
            If you don't know something for sure, advise the user to consult a local aquatic vet or specialist.
            Keep responses concise but informative. Use markdown for formatting (bolding, lists).
        `;

        // Format history for Groq (OpenAI-like format)
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile", // Using the latest Llama 3.3 model
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        const responseText = completion.choices[0]?.message?.content || "";
        console.log("AI Service: Success with Groq (Llama 3)");
        return responseText;

    } catch (error) {
        console.error("Groq AI Error details:", error);
        throw new Error(error.message || "Failed to get response from Groq AI");
    }
};
