const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// إعدادات لضمان قبول الطلبات من المتصفح ومن تطبيق فلاتر (CORS)
app.use(express.json());
app.use(cors()); 

// 🔐 مفتاح الـ API الخاص بك بعد تهيئته بالبادئة الرسمية لتفادي قيود الصلاحيات
const genAI = new GoogleGenerativeAI("AIzaSyAQ.Ab8RN6LiW0C5wa95eN5jbikmDbu74rvw9-ndn87PJ-3OuxFabw");

// رابط للاختبار الأساسي: افتح الرابط في المتصفح لتتأكد أن السيرفر يعمل أونلاين
app.get('/', (req, res) => {
    res.send("Proxy Server is Running!");
});

// رابط فرعي للتأكد من استجابة السيرفر وتوصيل البيانات
app.get('/test', (req, res) => {
    res.json({ message: "أنا السيرفر وأسمعك بوضوح! الربط سليم." });
});

// 🔄 المسار الرئيسي لاستقبال المحادثات من تطبيق فلاتر
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "الرسالة فارغة" });
        }

        // تهيئة موديل جيميناي السريع والمجاني (gemini-1.5-flash)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });
        
        // إرسال نص المحادثة إلى خوادم جوجل جيميناي
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // إعادة الإجابة بصيغة JSON نظيفة يستقبلها الفلاتر عبر متغير "text"
        res.json({ text: text });

    } catch (error) {
        console.error("Gemini Error Details:", error);
        res.status(500).json({ 
            error: "حدث خطأ في السيرفر الوسيط", 
            details: error.message 
        });
    }
});

// التعديل الأهم لمنصة Vercel لتعمل الـ Serverless Functions بشكل سليم
module.exports = app;

// في حال رغبتك بتشغيل وتجربة السيرفر محلياً على جهازك (Localhost)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
