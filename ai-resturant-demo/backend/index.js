// index.js

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors()); // tillater alle domener
app.use(express.json());

// Root-endpoint for test
app.get("/", (req, res) => {
  res.send("AI restaurant backend kjører! Bruk /chat for POST requests.");
});

// /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, restaurant_id } = req.body;

    console.log(`🚀 NY BESTILLING fra ${restaurant_id}: ${message}`);

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Du er en AI som hjelper med restaurantbestillinger." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await aiResponse.json();

    // Sjekk at data.choices finnes
    if (!data.choices || data.choices.length === 0) {
      console.error("Ingen valg fra OpenAI:", data);
      return res.status(500).json({ reply: "Ingen svar fra AI, sjekk API-nøkkel eller modell" });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("Feil i /chat:", err);
    res.status(500).json({ reply: "Serverfeil" });
  }
});

// Start server på riktig port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend kjører på port ${PORT}`));


