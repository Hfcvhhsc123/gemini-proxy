const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors()); 

// تأكد من وضع المفتاح كما نسخته من جوجل تماماً بين القوسين
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6LiW0C5wa95eN5jbikmDbu74rvw9-ndn87PJ-3OuxFabw");

app.get('/', (req, res) => {
    res.send("Proxy Server is Running!");
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "الرسالة فارغة" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        
        // نرسل الرد في كائن JSON واضح
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "فشل الاتصال بجوجل", details: error.message });
    }
});

module.exports = app;
