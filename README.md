# VIA LOCAL — MVP Prototype

واجهة أولية لمنصة VIA LOCAL لاكتشاف الوجهات، التعرف على المرشدين المحليين، وتجربة أدوات الوصول الشامل.

## تشغيل محلي
- Node.js 18 أو أحدث
- npm

```bash
npm install
npm run dev
```

لإنشاء نسخة إنتاج:
```bash
npm run build
npm run preview
```

## ما يعمل في النموذج
- واجهة عربية RTL وإنجليزية LTR مع ترجمة لعناصر التنقل والواجهة والوجهات.
- تصميم متجاوب للهواتف والكمبيوتر.
- البحث بأسماء الوجهات بالعربية والإنجليزية.
- فلاتر: جميع الوجهات، مناسب للعائلات، الطبيعة، التاريخ والآثار.
- المفضلة تعمل خلال جلسة الصفحة (لا تُحفظ بعد إعادة تحميلها).
- صفحات/بطاقات توضيحية لمرشدين افتراضيين، دون تواصل أو حجز حقيقي.
- قسم وصول شامل يحتوي على رسم خريطة تجريبي وأداة تحويل النص إلى صوت.
- طلب إذن تحديد الموقع، لكن لا تُستخدم الإحداثيات لجلب أو ترتيب أماكن حقيقية.

## حدود النسخة
- الوجهات والمحتوى معلومات أولية، يجب التحقق من التفاصيل من المصادر الرسمية قبل الزيارة.
- صور الأماكن في البطاقات تم استبدالها بصور حقيقية من Wikimedia Commons. الصور تظل مستضافة خارجيًا وقد تتغير/تتوقف؛ يُرجى مراجعة صفحة كل ملف وشروط الترخيص قبل إعادة الاستخدام التجاري.
- لا توجد قاعدة بيانات، حسابات، حجوزات، دفع، تقييمات فعلية أو توافر مباشر.
- المرشدون ملفات تجريبية وليست أشخاصًا حقيقيين.
- تحويل النص إلى صوت يعتمد على دعم المتصفح والأصوات المتاحة. لا توجد ترجمة للغة الإشارة أو تحويل الكلام إلى نص حاليًا.
- المفضلة محفوظة في حالة React فقط، وتختفي بعد إعادة تحميل الصفحة.

## الخطوات القادمة
1. API وخادم خلفي مشترك للموقع والتطبيق.
2. قاعدة بيانات ومصادر موثقة للوجهات والمرشدين.
3. خرائط مباشرة ومعلومات وصول تم التحقق منها.
4. تسجيل دخول ولوحة إدارة.
5. حجوزات حقيقية وإشعارات واختبارات أمان وإتاحة.
6. تطبيق Android وiOS يستهلك نفس الـ API.


## مصادر الصور (Wikimedia Commons)
تم استخدام ملفات صور للمواقع نفسها بدل الصور العامة. راجع صفحة كل ملف للمؤلف والترخيص:

| المكان | صفحة الصورة |
|---|---|
| جامع السلطان قابوس الأكبر | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sultan_Qaboos_Grand_Mosque_(1).jpg) |
| سوق مطرح | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Muttrah%2C_Suoq-_PiC.1-_OMAN.jpg) |
| قلعة نزوى | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nizwa_Fort%2C_Oman_2024_3.jpg) |
| وادي شاب | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Wadi_Shab_(11).jpg) |
| وادي دربات | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Wadi_Darbat_2025.jpg) |
| قلعة خصب | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Khasab_Fort.jpg) |
| رمال الشرقية | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dunes_in_Wahiba_Sands%2C_Oman.jpg) |
| شاطئ المغسيل | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mughsayl_Beach_2.jpg) |
| Göbekli Tepe | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gobeklitepe.jpg) |
| Derinkuyu | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Derinkuyu_Underground_City_T%C3%BCrkiye.jpg) |
| Ħal-Saflieni Hypogeum | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hypog%C3%A9e_Hal_Saflieni.jpg) |
| Skara Brae | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Skara_Brae_2000-7.jpg) |
| Djémila | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Djemila%2C_Algeria.jpg) |
| Great Zimbabwe | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Great-Zimbabwe.jpg) |
| Tiwanaku | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tiwanaku_Bolivia.jpg) |
| Sukhothai | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sukhothai_historical_park.jpg) |
