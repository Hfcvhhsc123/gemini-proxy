const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// إعدادات لضمان قبول الطلبات من المتصفح ومن التطبيق
app.use(express.json());
app.use(cors()); 

// مفتاح الـ API الخاص بك الذي استخرجناه بنجاح
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6L5msSywhMpX7iDuVYVSe7tH_PKWrS3XAAYL6CAaSXlfg");
// رابط للاختبار: افتح الرابط في المتصفح لتتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
    res.send("Proxy Server is Running!");
});

app.get('/test', (req, res) => {
    res.json({ message: "أنا السيرفر وأسمعك بوضوح! الربط سليم." });
});

// المسار الرئيسي للمحادثة
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "الرسالة فارغة" });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            systemInstruction: "أنت مساعد ذكي خبير في تقنية المعلومات والإلكترونيات لمنصة الوطنية لتعلم البرمجة."
        });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });
 } catch (error) {
    console.error("Gemini Error Details:", error); // هذا سيظهر في سجلات Vercel السوداء
    res.status(500).json({ 
        error: "حدث خطأ في السيرفر الوسيط", 
        details: error.message 
    });
}
});

// التعديل الأهم لـ Vercel:
// بدلاً من app.listen، نستخدم module.exports
module.exports = app;

// إذا كنت تريد التجربة محلياً على جهازك، اترك هذا الجزء
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
