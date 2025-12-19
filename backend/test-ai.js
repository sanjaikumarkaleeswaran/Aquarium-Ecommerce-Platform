import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // The SDK doesn't have a direct listModels, we have to use the fetch API or just try a known one
        // Actually, let's try gemini-1.5-flash which is the most common now.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("SUCCESS: gemini-1.5-flash works!");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("FAILED: gemini-1.5-flash failed.");
        console.error("Error Message:", error.message);

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hi");
            console.log("SUCCESS: gemini-pro works!");
        } catch (e2) {
            console.error("FAILED: gemini-pro failed.");
            console.error("Error Message:", e2.message);
        }
    }
}

listModels();
