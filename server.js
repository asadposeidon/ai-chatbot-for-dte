const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(cors()); // ✅ allow frontend requests
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", async (req, res) => {

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ai-chatbot-for-dte-1.onrender.com", // ✅ change this
          "X-Title": "AI Chatbot Demo"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {

    console.error("OpenRouter error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Provider error",
      details: error.response?.data || error.message
    });

  }

});

const PORT = process.env.PORT || 10000; // ✅ Render usually uses 10000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
