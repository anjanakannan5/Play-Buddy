const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      // Fallback responses when no API key
      const fallbacks = [
        "That's a great question! 🌟 As a parenting assistant, I recommend trying activities that match your child's interests and energy level.",
        "Great idea! 💜 Building healthy routines around play and learning helps children thrive socially and academically.",
        "PlayBuddy tip: Consistent playdates with trusted families help kids develop social skills and emotional intelligence! 🎈",
        "I'd suggest organizing a small group playdate first — 2-3 kids is ideal for younger children to build confidence! 🌈",
      ];
      return res.json({ reply: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
    }

    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      system: `You are PlayBuddy AI, a friendly and helpful parenting assistant. You help parents with:
- Planning playdates and activities for children
- Learning tips and educational games
- Child development advice
- Community events and social activities
Keep responses warm, encouraging, concise (2-3 sentences max), and family-friendly. Use occasional emojis. Always be positive and supportive.`,
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.content[0]?.text || "I'm here to help! 💜";
    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ message: 'Error communicating with AI', reply: "I'm having a little trouble right now! Please try again in a moment. 💜" });
  }
});

module.exports = router;
