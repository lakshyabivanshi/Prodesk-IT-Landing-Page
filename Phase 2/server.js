import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/generate', async (req, res) => {
    const { name, role, company, skills } = req.body;

    if (!name || !role || !company || !skills) {
        return res.status(400).json({ error: "Missing required fields" })
    }

    try {
        const systemPrompt = "You are an elite coach. Write a highly tailored, professional, and compelling cover letter.";

        const userPrompt = `Write a cover letter for ${name}, who is applying for the ${role} position at ${company}. Their core skills are: ${skills}. Keep it under 300 words.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error Detail: ", JSON.stringify(errorData, null, 2));
            return res.status(500).json({ error: "Gemini API rejected the request" })
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0].text) {
            const aiText = data.candidates[0].content.parts[0].text;
            res.json({ text: aiText });
        }
        else {
            res.status(500).json({ error: "Invalid response structure from Gemini API" })
        }

    } catch (error) {
        console.error("Backend Error: ", error);
        res.status(500).json({ error: "Internal Server Error " });
    }
});
app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));