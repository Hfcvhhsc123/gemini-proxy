const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// مفتاح OpenRouter الجديد
const OPENROUTER_API_KEY = "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";

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // استخدام fetch للاتصال بـ OpenRouter مباشرة
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3-8b-instruct:free",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        
        // التحقق من وجود خطأ في رد OpenRouter
        if (!response.ok) {
            return res.status(response.status).json({ error: data.error || "خطأ من OpenRouter" });
        }

        res.json({ text: data.choices[0].message.content });
        
    } catch (error) {
        res.status(500).json({ error: "خطأ داخلي في السيرفر: " + error.message });
    }
});

module.exports = app;
