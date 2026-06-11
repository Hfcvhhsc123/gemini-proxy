const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// إعدادات لضمان قبول الطلبات من أي مكان وتفادي مشكلة CORS في المتصفح
app.use(express.json());
app.use(cors()); 

// 🔐 مفتاح الـ API الرسمي والمفعل الخاص بك مع البادئة السليمة
const genAI = new GoogleGenerativeAI("AIzaSyAQ.Ab8RN6LiW0C5wa95eN5jbikmDbu74rvw9-ndn87PJ-3OuxFabw");

// رابط الفحص الأساسي للسيرفر
app.get('/', (req, res) => {
    res.send("Proxy Server is Running!");
});

// 🔄 المسار الرئيسي لاستقبال الأسئلة من تطبيق فلاتر
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "الرسالة فارغة" });
        }

        // تهيئة موديل جيميناي بالطريقة القياسية والأكثر استقراراً
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // إرسال النص إلى جيميناي بانتظار الإجابة
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // إرجاع رد الذكاء الاصطناعي بصيغة JSON واضحة ومباشرة
        res.json({ text: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ 
            error: "حدث خطأ في السيرفر", 
            details: error.message 
        });
    }
});

// تصدير التطبيق ليعمل كـ Serverless Function على منصة Vercel
module.exports = app;

// التشغيل المحلي للتجربة (Localhost)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
