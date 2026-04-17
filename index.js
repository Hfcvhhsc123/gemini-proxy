const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

// استبدل المفتاح بالخاص بك
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6KucTkLroyj8QHfq9f05lqYJWEThXG8d9y4KSBz1Uf5yg");

app.get('/test', (req, res) => {
    res.json({ message: "أنا السيرفر وأسمعك بوضوح!" });
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "أنت مساعد ذكي خبير في IT والإلكترونيات."
        });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ في السيرفر الوسيط" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
