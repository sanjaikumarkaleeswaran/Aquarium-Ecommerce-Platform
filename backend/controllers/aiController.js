import * as aiService from '../services/aiService.js';

/**
 * @desc    Chat with Dr. Fish AI
 * @route   POST /api/ai/chat
 * @access  Public
 */
export const chatWithDrFish = async (req, res) => {
    try {
        const { message, history } = req.body;
        console.log("AI Controller: Received chat request:", message);

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const response = await aiService.analyzeMessage(message, history || []);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({
            success: false,
            message: `AI Error: ${error.message}`,
            details: error.stack
        });
    }
};
