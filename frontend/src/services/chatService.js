import api from './authService';

const API_URL = "/api/ai";

/**
 * Analyze a message using the backend AI service
 * @param {string} message - The user's message
 * @param {Array} history - Chat history for context
 * @returns {Promise<string>} - AI response
 */
export const analyzeMessage = async (message, history = []) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await api.post(`${API_URL}/chat`, { message, history }, config);

        if (res.data.success) {
            return res.data.data;
        } else {
            throw new Error(res.data.message || 'Failed to get AI response');
        }
    } catch (error) {
        console.error("Chat API Error:", error);

        // Fallback to a helpful message if the backend is down or API key is missing
        if (error.response && error.response.status === 500) {
            const backendMsg = error.response.data?.message || "Backend error or Gemini API key missing";
            return `🚑 **Dr. Fish is currently out on a house call.** (${backendMsg}). Please try again later!`;
        }

        return "⚠️ **Connection lost.** I couldn't reach my aquatic brain. Please check your internet connection and try again.";
    }
};
