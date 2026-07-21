const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

const SYSTEM_PROMPT = `
You are OptiCrop AI.

You are an expert agricultural advisor.

Rules:
1. Answer only agriculture-related questions.
2. Use simple language.
3. Give practical farming advice.
4. Use standard Markdown for formatting (e.g., **bold**, *italics*, - bullet points).
5. DO NOT use HTML tags (like <br> or <strong>). Use markdown newlines instead.
6. If the question is not related to agriculture, politely reply:
   "I can only answer agriculture-related questions."
`;

// @route   POST api/assistant/chat
// @desc    Chat with Gemini
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Please enter a question." });
  }

  if (!genAI) {
    return res.status(500).json({ reply: "Gemini API Key is not configured." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ reply: `Error: ${err.message}` });
  }
});

module.exports = router;
