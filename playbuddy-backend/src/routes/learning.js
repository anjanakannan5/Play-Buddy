const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Learning = require('../models/Learning');
const User = require('../models/User');

const learningContent = {
  vocab: {
    title: 'Vocabulary Builder 📖',
    questions: [
      { q: 'What does "Happy" mean?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], answer: 1 },
      { q: 'What is the opposite of "Big"?', options: ['Large', 'Huge', 'Small', 'Wide'], answer: 2 },
      { q: 'Which word means "to run fast"?', options: ['Walk', 'Crawl', 'Sprint', 'Skip'], answer: 2 },
      { q: 'What does "Brave" mean?', options: ['Scared', 'Courageous', 'Weak', 'Lazy'], answer: 1 },
      { q: 'Which word means "very funny"?', options: ['Boring', 'Hilarious', 'Dull', 'Quiet'], answer: 1 },
    ]
  },
  math: {
    title: 'Math Adventures 🔢',
    questions: [
      { q: 'What is 5 + 7?', options: ['10', '11', '12', '13'], answer: 2 },
      { q: 'What is 15 - 8?', options: ['5', '6', '7', '8'], answer: 2 },
      { q: 'What is 4 × 3?', options: ['10', '11', '12', '13'], answer: 2 },
      { q: 'What is 20 ÷ 4?', options: ['3', '4', '5', '6'], answer: 2 },
      { q: 'What is 9 + 6?', options: ['13', '14', '15', '16'], answer: 2 },
    ]
  },
  story: {
    title: 'Story Time 📚',
    questions: [
      { q: 'In a story, what is the "setting"?', options: ['The main character', 'Where and when it happens', 'The ending', 'The problem'], answer: 1 },
      { q: 'What is the "hero" of a story called?', options: ['Antagonist', 'Narrator', 'Protagonist', 'Author'], answer: 2 },
      { q: 'What comes LAST in a story?', options: ['Beginning', 'Middle', 'Climax', 'End'], answer: 3 },
      { q: 'What is a "moral" of a story?', options: ['A scary part', 'A lesson learned', 'The title', 'A character name'], answer: 1 },
      { q: 'What makes a story "fictional"?', options: ['It is true', 'It really happened', 'It is made up', 'It is boring'], answer: 2 },
    ]
  },
  science: {
    title: 'Science Lab 🔬',
    questions: [
      { q: 'What do plants need to make food?', options: ['Darkness & water', 'Sunlight & CO2', 'Moonlight & sugar', 'Rain & dirt'], answer: 1 },
      { q: 'Which planet is closest to the Sun?', options: ['Earth', 'Venus', 'Mercury', 'Mars'], answer: 2 },
      { q: 'What state of matter is ice?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], answer: 2 },
      { q: 'What do butterflies do to flowers?', options: ['Eat them', 'Pollinate them', 'Destroy them', 'Paint them'], answer: 1 },
      { q: 'How many bones are in the human body?', options: ['106', '206', '306', '406'], answer: 1 },
    ]
  }
};

// GET /api/learning/:type - get learning content
router.get('/:type', protect, async (req, res) => {
  if (req.params.type === 'stats') {
    // Return aggregate progress stats
    try {
      const history = await Learning.find({ user: req.user._id });
      const stats = {
        vocab: 0,
        math: 0,
        story: 0,
        science: 0
      };
      
      // Calculate max score per type as "progress"
      history.forEach(h => {
        if (h.score > stats[h.type]) stats[h.type] = Math.round(h.score);
      });
      
      return res.json(stats);
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching stats' });
    }
  }

  const content = learningContent[req.params.type];
  if (!content) return res.status(404).json({ message: 'Learning type not found' });
  res.json(content);
});

// POST /api/learning/:type/submit - submit answers
router.post('/:type/submit', protect, async (req, res) => {
  try {
    const content = learningContent[req.params.type];
    if (!content) return res.status(404).json({ message: 'Learning type not found' });

    const { answers } = req.body; // array of selected option indices
    let score = 0;
    const results = content.questions.map((q, i) => {
      const correct = answers[i] === q.answer;
      if (correct) score++;
      return { question: q.q, correct, correctAnswer: q.options[q.answer] };
    });

    await Learning.create({
      user: req.user._id,
      type: req.params.type,
      score: (score / content.questions.length) * 100,
      completed: true,
      answers: results.map(r => ({ question: r.question, correct: r.correct })),
    });

    // Add 10 points for finishing a quiz
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10 } });

    res.json({ score, total: content.questions.length, results, percentage: Math.round((score / content.questions.length) * 100) });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting answers' });
  }
});

// GET /api/learning/history/me - get user's learning history
router.get('/history/me', protect, async (req, res) => {
  try {
    const history = await Learning.find({ user: req.user._id }).sort('-createdAt').limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;
