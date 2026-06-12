const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// تأكد من وضع المفتاح هنا مباشرة داخل علامات التنصيص
const OPENROUTER_API_KEY = "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";

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://alwatania-academy.web.app", // رابط موقعك
                "X-Title": "IT Assistant"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3-8b-instruct:free",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        
        // إذا كان هناك خطأ من OpenRouter، فسيظهر لنا هنا بوضوح
        if (!response.ok) {
            console.error("OpenRouter Error:", data);
            return res.status(response.status).json({ error: data.error.message || "خطأ غير معروف" });
        }

        res.json({ text: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
