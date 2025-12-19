import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Checking models for API Key:", apiKey.substring(0, 5) + "...");

    const versions = ['v1', 'v1beta'];

    for (const v of versions) {
        console.log(`\n--- Testing API Version: ${v} ---`);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                console.error(`Error in ${v}:`, data.error.message);
            } else {
                console.log(`Available models in ${v}:`);
                data.models.forEach(m => console.log(` - ${m.name}`));
            }
        } catch (error) {
            console.error(`Fetch failed for ${v}:`, error.message);
        }
    }
}

checkModels();
