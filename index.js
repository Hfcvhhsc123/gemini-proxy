const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // نستخدم خدمة API مجانية ومباشرة
        const response = await fetch("https://api.pawan.krd/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "pai-001",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        res.json({ text: data.choices[0].message.content });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
