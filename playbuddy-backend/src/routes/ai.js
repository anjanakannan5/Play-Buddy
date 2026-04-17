const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ 
        message: 'AI API Key is missing. Please configure GEMINI_API_KEY in the backend .env file.',
        reply: "I am not fully set up yet! Please ask the admin to add my API key to the backend. 💜"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are PlayBuddy AI, a friendly and helpful parenting assistant. You help parents with:
- Planning playdates and activities for children
- Learning tips and educational games
- Child development advice
- Community events and social activities
Keep responses warm, encouraging, concise (2-3 sentences max), and family-friendly. Use occasional emojis. Always be positive and supportive.

User: ${message}
PlayBuddy AI:`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ 
      message: 'Error communicating with AI', 
      reply: "I'm having a little trouble connecting right now! Please try again in a moment. 💜" 
    });
  }
});

module.exports = router;
