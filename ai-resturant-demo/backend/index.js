import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const MENU = [
  { name: "Margherita Pizza", price: 149 },
  { name: "Pepperoni Pizza", price: 169 },
  { name: "Taco Bowl", price: 159 },
  { name: "Kyllingburger", price: 179 }
];

app.post("/chat", async (req, res) => {
  const { message, restaurant_id } = req.body;

  const prompt = `
Du er en restaurant-assistent. Bruk denne menyen: ${JSON.stringify(MENU)}.
Svar vennlig. Hvis brukeren bestiller, skriv:
BESTILLING:
- Rett
- Pris
Ikke skriv annet.
`;

  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    })
  });

  const data = await aiResponse.json();
  const reply = data.choices[0].message.content;

  if (reply.includes("BESTILLING")) console.log("🚀 NY BESTILLING:", reply);

  res.json({ reply });
});

app.listen(PORT, () => console.log(`Backend kjører på port ${PORT}`));
