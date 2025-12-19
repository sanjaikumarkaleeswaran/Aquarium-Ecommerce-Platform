import Groq from "groq-sdk";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGroq() {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("API Key present:", !!apiKey);
    if (apiKey) console.log("Key length:", apiKey.length);

    if (!apiKey) {
        console.log("No API key found in .env");
        return;
    }

    try {
        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say hello" }],
            model: "llama3-8b-8192",
        });
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testGroq();
