const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await fetch("https://api.pawan.krd/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "model": "pai-001",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        
        // التحقق مما إذا كان الرد يحتوي على الإجابة المتوقعة
        if (data && data.choices && data.choices.length > 0) {
            res.json({ text: data.choices[0].message.content });
        } else {
            // إذا كان الرد غير مفهوم أو فارغ
            console.error("رد غير متوقع من السيرفر:", data);
            res.status(500).json({ error: "السيرفر الخارجي لم يرسل إجابة صحيحة" });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
