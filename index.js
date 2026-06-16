const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// وضعنا مفتاح الميسترال الخاص بك هنا مباشرة
const MISTRAL_API_KEY = "DdzHj2AVzN5DFmLloRpGIQ2galczsKkH";

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                "model": "mistral-small-latest", // موديل سريع وممتاز ومجاني للتجارب
                "messages": [
                    { "role": "system", "content": "أنت مساعد ذكي متخصص في مجالات تقنية المعلومات والبرمجة لطلاب الهندسة." },
                    { "role": "user", "content": message }
                ]
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices.length > 0) {
            res.json({ text: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "فشل السيرفر في جلب رد من Mistral" });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
