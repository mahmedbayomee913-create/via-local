import React, { useMemo, useState, useEffect } from 'react';
import {
  MapPin, Compass, Users, Accessibility, Search, Globe2, Menu, X,
  Star, Clock3, Heart, ArrowUpLeft, ChevronLeft, ShieldCheck,
  Languages, Volume2, MessageCircle, CalendarDays, LocateFixed,
  SlidersHorizontal, Sparkles, CheckCircle2, Footprints, Baby,
  Utensils, Map, Headphones
} from 'lucide-react';

const places = [
  { id: 1, name: 'جامع السلطان قابوس الأكبر', city: 'مسقط', category: 'ثقافي', tags: ['عمارة', 'ثقافة'], rating: '—', distance: 'مسقط', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sultan%20Qaboos%20Grand%20Mosque%20(1).jpg?width=1200', description: 'معلم معماري بارز في مسقط، يتميز بتفاصيله الهادئة وفنونه الإسلامية. تحقّق من أوقات الزيارة وتعليمات الدخول قبل الذهاب.' },
  { id: 2, name: 'سوق مطرح', city: 'مسقط', category: 'تراثي', tags: ['تسوق', 'تراث'], rating: '—', distance: 'مطرح', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Muttrah%2C%20Suoq-%20PiC.1-%20OMAN.jpg?width=1200', description: 'أزقة سوق تقليدي مليئة بالمحلات والمنتجات المحلية، وتجربة قريبة من ذاكرة مسقط البحرية.' },
  { id: 3, name: 'قلعة نزوى', city: 'نزوى', category: 'تاريخي', tags: ['تاريخ', 'عمارة'], rating: '—', distance: 'الداخلية', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nizwa%20Fort%2C%20Oman%202024%203.jpg?width=1200', description: 'قلعة تاريخية شهيرة في قلب نزوى، تعكس جانبًا مهمًا من العمارة الدفاعية والتراث العُماني.' },
  { id: 4, name: 'وادي شاب', city: 'صور', category: 'طبيعة', tags: ['مياه', 'مغامرة'], rating: '—', distance: 'جنوب الشرقية', family: false, nature: true, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wadi%20Shab%20(11).jpg?width=1200', description: 'وادي طبيعي معروف بمياهه ومناظره الجبلية. يتطلب الوصول إليه مشيًا، لذلك راجع حالة الطقس وإرشادات السلامة قبل الزيارة.' },
  { id: 5, name: 'وادي دربات', city: 'صلالة', category: 'طبيعة', tags: ['طبيعة', 'عائلات'], rating: '—', distance: 'ظفار', family: true, nature: true, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wadi%20Darbat%202025.jpg?width=1200', description: 'مناظر طبيعية خضراء وشلالات موسمية في محافظة ظفار، وتختلف الأجواء والمشهد حسب الموسم.' },
  { id: 6, name: 'قلعة خصب', city: 'خصب', category: 'تراثي', tags: ['تاريخ', 'ثقافة'], rating: '—', distance: 'مسندم', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khasab%20Fort.jpg?width=1200', description: 'قلعة عُمانية تاريخية تطل على مشهد ساحلي في محافظة مسندم، وتقدم لمحة عن تاريخ المنطقة.' },
  { id: 7, name: 'رمال الشرقية', city: 'بدية', category: 'طبيعة', tags: ['صحراء', 'تجارب محلية'], rating: '—', distance: 'شمال الشرقية', family: true, nature: true, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dunes%20in%20Wahiba%20Sands%2C%20Oman.jpg?width=1200', description: 'كثبان رملية واسعة وتجربة صحراوية مميزة. اختر مزود خدمة مرخصًا واتبع إرشادات السلامة المحلية.' },
  { id: 8, name: 'شاطئ المغسيل', city: 'صلالة', category: 'طبيعة', tags: ['شاطئ', 'طبيعة'], rating: '—', distance: 'ظفار', family: true, nature: true, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mughsayl%20Beach%202.jpg?width=1200', description: 'شاطئ معروف غرب صلالة بتكويناته الساحلية ونوافيره الطبيعية التي تظهر مع حركة البحر.' },
  { id: 9, name: 'غوبكلي تبه (Göbekli Tepe)', city: 'شانلي أورفا', category: 'أثري', tags: ['آثار', 'تاريخ قديم', 'تركيا'], rating: '—', distance: 'تركيا', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gobeklitepe.jpg?width=1200', description: 'مجمع أثري يعود إلى نحو 11,500 عام ويضم أعمدة حجرية ضخمة منحوتة، ويُعد من أقدم المواقع المعروفة ذات الطابع الطقسي.' },
  { id: 10, name: 'مدينة ديرينكويو تحت الأرض', city: 'ديرينكويو', category: 'أثري', tags: ['مدينة تحت الأرض', 'تاريخ', 'تركيا'], rating: '—', distance: 'كابادوكيا · تركيا', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Derinkuyu%20Underground%20City%20T%C3%BCrkiye.jpg?width=1200', description: 'مدينة تحت الأرض متعددة المستويات، تضم ممرات وغرفًا ومرافق، واستُخدمت كمكان للجوء والحماية في أوقات الخطر.' },
  { id: 11, name: 'هايبوجيوم هال سافليني', city: 'باولا', category: 'أثري', tags: ['معبد', 'تحت الأرض', 'مالطا'], rating: '—', distance: 'مالطا', family: false, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hypog%C3%A9e%20Hal%20Saflieni.jpg?width=1200', description: 'مقبرة ومجمع تحت الأرض يعود إلى عصور ما قبل التاريخ، يتميز بممرات وغرف منحوتة في الصخر وخصائص صوتية لافتة. الزيارة تحتاج حجزًا مسبقًا.' },
  { id: 12, name: 'سكارا بري (Skara Brae)', city: 'أوركني', category: 'أثري', tags: ['العصر الحجري', 'قرية قديمة', 'اسكتلندا'], rating: '—', distance: 'اسكتلندا', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Skara%20Brae%202000-7.jpg?width=1200', description: 'قرية من العصر الحجري الحديث بقيت فيها مساكن وأثاث حجري محفوظ بصورة استثنائية، وتمنح تصورًا عن الحياة اليومية قبل آلاف السنين.' },
  { id: 13, name: 'جميلة (Djémila)', city: 'جميلة', category: 'أثري', tags: ['روماني', 'مدينة أثرية', 'الجزائر'], rating: '—', distance: 'سطيف · الجزائر', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Djemila%2C%20Algeria.jpg?width=1200', description: 'مدينة رومانية أثرية محفوظة في منطقة جبلية، تضم معابد وساحات وأقواسًا وآثارًا معمارية تعكس تخطيط المدن الرومانية.' },
  { id: 14, name: 'زيمبابوي العظمى (Great Zimbabwe)', city: 'ماسينغو', category: 'أثري', tags: ['حضارة أفريقية', 'آثار حجرية', 'زيمبابوي'], rating: '—', distance: 'زيمبابوي', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Great-Zimbabwe.jpg?width=1200', description: 'أطلال مدينة حجرية كانت مركزًا لمملكة أفريقية مزدهرة، وتشتهر بجدرانها الحجرية الكبيرة المشيدة دون ملاط.' },
  { id: 15, name: 'تيواناكو (Tiwanaku)', city: 'تيواناكو', category: 'أثري', tags: ['ما قبل الإنكا', 'معابد', 'بوليفيا'], rating: '—', distance: 'قرب بحيرة تيتيكاكا · بوليفيا', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tiwanaku%20Bolivia.jpg?width=1200', description: 'موقع حضاري قديم على هضبة مرتفعة قرب بحيرة تيتيكاكا، يضم مباني ومعابد وأعمالًا حجرية دقيقة تعود إلى حضارة ما قبل الإنكا.' },
  { id: 16, name: 'سوخوثاي (Sukhothai)', city: 'سوخوثاي', category: 'أثري', tags: ['تاريخ', 'معابد بوذية', 'تايلاند'], rating: '—', distance: 'تايلاند', family: true, nature: false, accessible: false, image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sukhothai%20historical%20park.jpg?width=1200', description: 'حديقة تاريخية تضم بقايا معابد وتماثيل بوذية وآثار مملكة سوخوثاي، وتشتهر بمساحاتها الواسعة وبركها وممراتها.' },
];

const guides = [
  { id: 1, name: 'مرشد محلي تجريبي 01', specialty: 'جولات ثقافية في الوجهات', languages: 'العربية • الإنجليزية', rating: '—', price: 'ملف تجريبي · لا توجد خدمة فعلية', initials: 'عُ' },
  { id: 2, name: 'مرشد محلي تجريبي 02', specialty: 'جولات تراثية وتاريخية', languages: 'العربية • الإنجليزية', rating: '—', price: 'ملف تجريبي · لا توجد خدمة فعلية', initials: 'ن' },
  { id: 3, name: 'مرشد محلي تجريبي 03', specialty: 'تجارب طبيعة ومناطق محلية', languages: 'العربية • الإنجليزية', rating: '—', price: 'ملف تجريبي · لا توجد خدمة فعلية', initials: 'ظ' }
];

const copy = {
ar:{explore:'لا تزُر المكان... انتمِ إليه',guides:'عِش المكان بعيون أهله',access:'السفر للجميع... بلا حواجز',home:'الرئيسية',discover:'اكتشف العالم',localGuides:'المرشدون المحليون',inclusive:'الوصول الشامل',tagline:'العالم أقرب مما تتخيّل',heroLine1:'سفر آمن وشامل...',heroLine2:'انتمِ إلى المكان',sub:'فيا لوكال يجمع استكشاف الوجهات، والتعرّف على المرشدين المحليين، ومعلومات الوصول الشامل — في تجربة واحدة.',heroLabel:'منصة سياحية ذكية · تجربة سفر للجميع',announcement:'منصة فيا لوكال — استكشف العالم بأمان، واكتشف المكان مع أهله',search:'ابحث عن دولة أو مدينة أو وجهة...',start:'ابدأ الاستكشاف',exploreTitle:'وجهات حول العالم تستحق التجربة',exploreSub:'اكتشف حكايات المواقع التاريخية والثقافات والطبيعة.',all:'كل الوجهات',family:'مناسب للعائلات',halal:'خيارات الطعام الحلال',nature:'طبيعة ومغامرات',accessible:'إمكانية الوصول',guidesTitle:'تعرّف على المرشدين المحليين',guidesSub:'ملفات مرشدين افتراضية للعرض فقط؛ ليست أشخاصًا حقيقيين ولا حجوزات متاحة.',guidesFeatureSub:'تعرّف على نماذج توضيحية لخدمة الإرشاد المحلي.',noRating:'لا يوجد تقييم',accessSub:'معلومات وصول توضيحية وأدوات تواصل أولية.',viewProfile:'عرض الملف',book:'طلب تجريبي',accessTitle:'تجربة سفر أكثر شمولًا',mapTitle:'خريطة الوصول — نموذج توضيحي',mapSub:'الرسم الحالي ليس خريطة فعلية ولا يعرض بيانات أماكن مباشرة.',communication:'تحويل النص إلى صوت',communicationSub:'اكتب عبارة وسيحاول المتصفح قراءتها بصوت مسموع.',typeHere:'اكتب ما تريد قوله...',speak:'استمع إلى العبارة',stop:'إيقاف الصوت',location:'استخدم موقعي',locationHelp:'الموقع اختياري ولا يُستخدم حاليًا لجلب أماكن حقيقية.',featured:'وجهات مختارة',categories:'اكتشف تجارب جديدة',history:'تاريخ وثقافة',familyCat:'عائلات وأطفال',food:'مطاعم ومقاهٍ',accessibleCat:'وصول ميسّر',rating:'التقييم',distance:'المنطقة',details:'التفاصيل',demo:'نسخة تجريبية',footer:'رحلتك تبدأ بفهم المكان.',requestSent:'هذا إجراء تجريبي فقط — لم يتم إنشاء حجز أو طلب حقيقي.',close:'إغلاق',searchResults:'نتائج الاستكشاف',noResults:'لا توجد نتائج مطابقة. جرّب تغيير البحث أو الفلاتر.',filter:'تصفية',favoritesFilter:'المفضلة',clearFilters:'مسح البحث والفلاتر',language:'English',verifiedNote:'معلومات تعريفية أولية. تحقق من تفاصيل الزيارة من المصادر الرسمية. الصور قد تكون توضيحية، ولا توجد تقييمات أو توافر مباشر.',saved:'تمت إضافة المكان إلى المفضلة.',unsaved:'تمت إزالة المكان من المفضلة.',save:'أضف للمفضلة',savedLabel:'في المفضلة',homeAria:'العودة للرئيسية',menuAria:'فتح القائمة',saveAria:'حفظ المكان في المفضلة'},
en:{explore:'Don’t just visit. Belong.',guides:'Experience places through local eyes',access:'Travel without barriers',home:'Home',discover:'Explore the world',localGuides:'Local guides',inclusive:'Accessibility',tagline:'The world is closer than you imagine',heroLine1:'Travel safely and inclusively...',heroLine2:'Belong to the place',sub:'VIA LOCAL brings destination discovery, local guide introductions, and accessibility information together in one experience.',heroLabel:'Smart travel platform · Travel for everyone',announcement:'VIA LOCAL — Explore the world safely and discover places with local people',search:'Search a country, city, or destination...',start:'Start exploring',exploreTitle:'Destinations around the world worth experiencing',exploreSub:'Discover stories, historic sites, cultures, and nature.',all:'All destinations',family:'Family-friendly',halal:'Halal food options',nature:'Nature & outdoors',accessible:'Accessibility',guidesTitle:'Meet local guides',guidesSub:'Sample profiles for demonstration only; these are not real people or available bookings.',guidesFeatureSub:'Preview an illustrative local-guide service.',noRating:'No rating',accessSub:'Illustrative accessibility information and basic communication tools.',viewProfile:'View profile',book:'Demo request',accessTitle:'A more inclusive travel experience',mapTitle:'Accessibility map — demo',mapSub:'This illustration is not a real map and does not show live place data.',communication:'Text-to-speech',communicationSub:'Type a phrase and your browser may read it aloud.',typeHere:'Type what you want to say...',speak:'Speak phrase',stop:'Stop speech',location:'Use my location',locationHelp:'Location is optional and is not used to fetch real places yet.',featured:'Featured destinations',categories:'Discover new experiences',history:'History & culture',familyCat:'Families & kids',food:'Restaurants & cafes',accessibleCat:'Accessible travel',rating:'Rating',distance:'Area',details:'Details',demo:'Prototype',footer:'Your journey starts with understanding the place.',requestSent:'Demo only — no real booking or request was created.',close:'Close',searchResults:'Discovery results',noResults:'No matches. Try changing your search or filters.',filter:'Filters',favoritesFilter:'Favorites',clearFilters:'Clear search and filters',language:'العربية',verifiedNote:'Introductory information. Verify visitor details with official sources. Images may be illustrative; ratings and availability are not live.',saved:'Added to favorites.',unsaved:'Removed from favorites.',save:'Save to favorites',savedLabel:'Saved',homeAria:'Go to home',menuAria:'Open menu',saveAria:'Save place to favorites'}
};

const placeEN = {
1:{name:'Sultan Qaboos Grand Mosque',city:'Muscat',category:'Cultural',distance:'Muscat',tags:['Architecture','Culture'],description:'A prominent architectural landmark in Muscat. Check visitor hours and entry guidance before your visit.'},
2:{name:'Mutrah Souq',city:'Muscat',category:'Heritage',distance:'Mutrah',tags:['Shopping','Heritage'],description:'A traditional market reflecting Muscat’s historic maritime character.'},
3:{name:'Nizwa Fort',city:'Nizwa',category:'Historic',distance:'Al Dakhiliyah',tags:['History','Architecture'],description:'A historic fort showcasing Omani defensive architecture and heritage.'},
4:{name:'Wadi Shab',city:'Sur area',category:'Nature',distance:'South Al Sharqiyah',tags:['Water','Outdoor'],description:'A natural valley known for water and mountain scenery. Access involves walking; check weather and local safety guidance.'},
5:{name:'Wadi Darbat',city:'Salalah',category:'Nature',distance:'Dhofar',tags:['Nature','Family'],description:'A scenic area with seasonal greenery and waterfalls; conditions vary by season.'},
6:{name:'Khasab Fort',city:'Khasab',category:'Heritage',distance:'Musandam',tags:['History','Culture'],description:'A historic Omani fort in Musandam, offering a glimpse into the region’s heritage.'},
7:{name:'Sharqiyah Sands',city:'Bidiyah',category:'Nature',distance:'North Al Sharqiyah',tags:['Desert','Local experiences'],description:'A broad desert landscape. Use licensed providers and follow local safety advice.'},
8:{name:'Al Mughsail Beach',city:'Salalah',category:'Nature',distance:'Dhofar',tags:['Beach','Nature'],description:'A coastal area west of Salalah known for scenery and blowholes in suitable sea conditions.'},
9:{name:'Göbekli Tepe',city:'Şanlıurfa',category:'Archaeological',distance:'Türkiye',tags:['Archaeology','Prehistory','Türkiye'],description:'A Neolithic site with monumental T-shaped stone pillars and carved animal imagery, dating to roughly 11,500 years ago.'},
10:{name:'Derinkuyu Underground City',city:'Derinkuyu',category:'Archaeological',distance:'Cappadocia · Türkiye',tags:['Underground city','History','Türkiye'],description:'A multi-level underground settlement with rooms and passages that served as a refuge. Check visitor access and restrictions before travel.'},
11:{name:'Ħal Saflieni Hypogeum',city:'Paola',category:'Archaeological',distance:'Malta',tags:['Prehistoric','Underground','Malta'],description:'A prehistoric underground complex used as a burial site, with chambers cut into limestone. Visits are limited and advance booking is required.'},
12:{name:'Skara Brae',city:'Orkney',category:'Archaeological',distance:'Scotland',tags:['Neolithic','Ancient village','Scotland'],description:'A remarkably preserved Neolithic settlement with stone-built homes and furnishings.'},
13:{name:'Djémila',city:'Djémila',category:'Archaeological',distance:'Sétif · Algeria',tags:['Roman','Ancient city','Algeria'],description:'A Roman town in a mountain setting, with a forum, temples, basilicas, arches, and houses.'},
14:{name:'Great Zimbabwe',city:'Masvingo',category:'Archaeological',distance:'Zimbabwe',tags:['African heritage','Stone ruins','Zimbabwe'],description:'Ruins of a major Shona city and trading centre, built with dry-stone masonry between the 11th and 15th centuries.'},
15:{name:'Tiwanaku',city:'Tiwanaku',category:'Archaeological',distance:'La Paz region · Bolivia',tags:['Pre-Inca','Monuments','Bolivia'],description:'A major pre-Hispanic ceremonial and political centre on the Andean Altiplano, known for monumental stone architecture.'},
16:{name:'Sukhothai Historical Park',city:'Sukhothai',category:'Archaeological',distance:'Thailand',tags:['History','Buddhist monuments','Thailand'],description:'A historic park preserving temples, Buddhist images, and remains of the Sukhothai kingdom.'}
};
function localizedPlace(p,lang){return lang==='en'?{...p,...(placeEN[p.id]||{})}:p;}

function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('via-local:lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } });
  const [tab, setTab] = useState('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem('via-local:favorites') || '[]'); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem('via-local:favorites', JSON.stringify(favorites)); } catch {} }, [favorites]);
  const [speechText, setSpeechText] = useState('');
  const [notice, setNotice] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);\n  useEffect(() => { try { localStorage.setItem('via-local:lang', lang); } catch {} }, [lang]);
  const t = copy[lang];
  const rtl = lang === 'ar';

  const filteredPlaces = useMemo(() => places.filter(p => {
    const lp = localizedPlace(p, lang); const matchesQuery = `${p.name} ${p.city} ${p.category} ${p.tags.join(' ')} ${lp.name} ${lp.city} ${lp.category} ${lp.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'family' && p.family) || (filter === 'nature' && p.nature) || (filter === 'history' && ['أثري','تاريخي','تراثي','Archaeological','Historic','Heritage','Cultural'].includes(lp.category)) || (filter === 'accessible' && p.accessible) || (filter === 'favorites' && favorites.includes(p.id));
    return matchesQuery && matchesFilter;
  }), [query, filter, lang, favorites]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return notify(rtl ? 'المتصفح لا يدعم تحديد الموقع.' : 'Geolocation is not supported by this browser.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocationText(`${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`),
      () => notify(rtl ? 'تعذر الوصول إلى موقعك. يمكنك الاستمرار دون تحديد الموقع.' : 'Could not access your location. You can continue without it.')
    );
  };

  const speak = () => {
    if (!speechText.trim()) return notify(rtl ? 'اكتب عبارة أولًا.' : 'Please type a phrase first.');
    if (!('speechSynthesis' in window)) return notify(rtl ? 'ميزة الصوت غير مدعومة في هذا المتصفح.' : 'Speech is not supported in this browser.');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = rtl ? 'ar' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);\n  const navigate = (nextTab) => { setTab(nextTab); setMobileMenu(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const sharePlace = async (place) => { const lp = localizedPlace(place, lang); const shareText = `${lp.name} — ${lp.city}\n${lp.description}`; try { if (navigator.share) await navigator.share({title:lp.name,text:shareText}); else {await navigator.clipboard.writeText(shareText);notify(rtl?'تم نسخ تفاصيل الوجهة.':'Destination details copied.');} } catch (err) { if (err?.name !== 'AbortError') notify(rtl?'تعذر مشاركة الوجهة.':'Could not share destination.'); } };

  const navItems = [
    ['home', t.home, Compass], ['explore', t.discover, MapPin],
    ['guides', t.localGuides, Users], ['access', t.inclusive, Accessibility]
  ];

  return (
    <div className={rtl ? 'app' : 'app ltr'} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="announcement-bar"><Sparkles size={13}/><span>{t.announcement}</span><Sparkles size={13}/></div>
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label={t.homeAria}>
            <span className="brand-mark"><MapPin size={25} strokeWidth={2.5}/></span>
            <span className="brand-name arabic-brand">فيا لوكال<small>VIA LOCAL</small></span>
          </button>
          <nav className="desktop-nav">
            {navItems.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'nav-link active' : 'nav-link'} onClick={() => navigate(id)}><Icon size={17}/>{label}</button>)}
          </nav>
          <div className="header-actions">
            <button className="language-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}><Globe2 size={17}/>{t.language}</button>
            <button className="menu-btn" onClick={() => setMobileMenu(!mobileMenu)} aria-label={t.menuAria}>{mobileMenu ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {mobileMenu && <div className="mobile-nav">{navItems.map(([id, label, Icon]) => <button key={id} onClick={() => navigate(id)}><Icon size={18}/>{label}</button>)}</div>}
      </header>

      <main>
        {tab === 'home' && <>
          <section className="hero">
            <div className="hero-image"></div>
            <div className="container hero-content">
              <span className="eyebrow hero-label"><Sparkles size={15}/>{t.heroLabel}</span>
              <h1>{t.heroLine1}<br/><em>{t.heroLine2}</em></h1>
              <p className="hero-description">{t.sub}</p>
              <div className="hero-search">
                <Search size={20}/>
                <input value={query} onChange={e => {setQuery(e.target.value);navigate('explore')}} placeholder={t.search}/>
                <button onClick={() => navigate('explore')}>{t.start}<ArrowUpLeft size={17}/></button>
              </div>
              <div className="location-row"><button onClick={requestLocation}><LocateFixed size={16}/>{t.location}</button><span>{locationText || t.locationHelp}</span></div>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.categories}</span><h2>{t.explore}</h2></div><button className="text-link" onClick={() => navigate('explore')}>{t.discover}<ChevronLeft size={17}/></button></div>
            <div className="feature-grid">
              <button className="feature-card feature-burgundy" onClick={() => navigate('explore')}><span className="feature-icon"><Compass/></span><strong>{t.explore}</strong><small>{t.exploreSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-gold" onClick={() => navigate('guides')}><span className="feature-icon"><Users/></span><strong>{t.guides}</strong><small>{t.guidesFeatureSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-light" onClick={() => navigate('access')}><span className="feature-icon"><Accessibility/></span><strong>{t.access}</strong><small>{t.accessSub}</small><ArrowUpLeft className="feature-arrow"/></button>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.featured}</span><h2>{t.exploreTitle}</h2></div><button className="text-link" onClick={() => setTab('explore')}>{t.details}<ChevronLeft size={17}/></button></div>
            <PlaceGrid items={places.slice(8,11)} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} notify={notify} onSelect={setSelectedPlace}/>
          </section>
        </>}

        {tab === 'explore' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.explore}</span><h1>{t.exploreTitle}</h1><p>{t.exploreSub}</p></div>
          <div className="filter-panel">
            <div className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/></div>
            <div className="filter-chips">
              {[['all',t.all],['family',t.family],['nature',t.nature],['history',t.history],['accessible',t.accessible],['favorites',t.favoritesFilter]].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'chip selected' : 'chip'}>{label}</button>)}
            </div>
          </div>
          <div className="results-caption"><span><SlidersHorizontal size={16}/>{t.searchResults}</span><small>{filteredPlaces.length} {rtl ? 'أماكن' : 'places'}</small></div>
          {filteredPlaces.length ? <PlaceGrid items={filteredPlaces} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} notify={notify} onSelect={setSelectedPlace}/> : <div className="empty-state"><Search size={30}/><p>{t.noResults}</p><button className="btn-outline" onClick={() => {setQuery('');setFilter('all');notify(rtl ? 'تم مسح البحث والفلاتر.' : 'Search and filters cleared.')}}>{t.clearFilters}</button></div>}
        </section>}

        {tab === 'guides' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.guides}</span><h1>{t.guidesTitle}</h1><p>{t.guidesSub}</p></div>
          <div className="guide-intro"><div className="guide-intro-icon"><Headphones size={30}/></div><div><h3>{rtl ? 'تجربة محلية أقرب إليك' : 'A more local experience'}</h3><p>{rtl ? 'اختر مرشدًا يناسب اهتماماتك ولغتك واطلب جولة تجريبية.' : 'Choose a guide based on your interests and language, then request a demo tour.'}</p></div></div>
          <div className="guide-grid">{guides.map(g => <article className="guide-card" key={g.id}><div className="guide-top"><div className="avatar">{g.initials}</div><span className="rating">{t.demo}</span></div><h3>{rtl ? g.name : ['Sample local guide 01','Sample local guide 02','Sample local guide 03'][g.id-1]}</h3><p className="muted">{rtl ? g.specialty : ['Cultural city tours','Heritage walks and history','Nature and regional experiences'][g.id-1]}</p><div className="guide-language"><Languages size={16}/>{rtl ? g.languages : 'Arabic · English'}</div><div className="guide-bottom"><strong>{rtl ? g.price : 'Demo profile · No real service'}</strong><button className="btn-primary small" onClick={() => notify(t.requestSent)}>{t.book}</button></div></article>)}</div>
          <p className="disclaimer"><ShieldCheck size={16}/>{t.verifiedNote}</p>
        </section>}

        {tab === 'access' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.access}</span><h1>{t.accessTitle}</h1><p>{t.accessSub}</p></div>
          <div className="access-grid">
            <article className="access-card map-card"><div className="access-icon"><Map size={25}/></div><h2>{t.mapTitle}</h2><p>{t.mapSub}</p><div className="map-placeholder"><div className="map-lines"></div><span className="map-pin pin-one"><MapPin/></span><span className="map-pin pin-two"><MapPin/></span><span className="map-pin pin-three"><MapPin/></span><div className="map-label"><Accessibility size={16}/>{rtl ? 'أماكن مهيأة (بيانات تجريبية)' : 'Accessible places (demo data)'}</div></div><small className="muted">{t.verifiedNote}</small></article>
            <article className="access-card speech-card"><div className="access-icon"><MessageCircle size={25}/></div><h2>{t.communication}</h2><p>{t.communicationSub}</p><textarea value={speechText} onChange={e => setSpeechText(e.target.value)} placeholder={t.typeHere} rows="4"/><div className="speech-actions"><button className="btn-primary" onClick={speak}><Volume2 size={17}/>{t.speak}</button><button className="btn-outline" onClick={() => {window.speechSynthesis?.cancel();notify(rtl?'تم إيقاف الصوت.':'Speech stopped.')}}>{t.stop}</button></div><div className="speech-note"><CheckCircle2 size={16}/>{rtl ? 'تعتمد الميزة على دعم المتصفح للأصوات المتاحة.' : 'This feature depends on browser speech voice support.'}</div></article>
          </div>
          <div className="access-note"><Accessibility size={22}/><div><strong>{rtl ? 'التصميم الشامل يتجاوز ميزة واحدة' : 'Accessibility is more than one feature'}</strong><p>{rtl ? 'النسخة القادمة ستضيف معلومات موثقة عن المنحدرات والمصاعد ودورات المياه المهيأة، ودعم تحويل الكلام إلى نص وأدوات تواصل إضافية.' : 'The next version can add verified ramp, elevator and restroom details, speech-to-text and more communication tools.'}</p></div></div>
        </section>}
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark"><MapPin size={20}/></span><div><strong>VIA LOCAL</strong><small>{t.footer}</small></div></div><span className="footer-copy">© 2026 VIA LOCAL · {t.demo}</span></div></footer>

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      {selectedPlace && <div className="modal-backdrop" onClick={() => setSelectedPlace(null)}><div className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedPlace(null)} aria-label={t.close}><X/></button><img src={selectedPlace.image} alt={localizedPlace(selectedPlace,lang).name}/><div className="modal-body"><span className="eyebrow gold-text">{localizedPlace(selectedPlace,lang).city} · {localizedPlace(selectedPlace,lang).category}</span><h2>{localizedPlace(selectedPlace,lang).name}</h2><p>{localizedPlace(selectedPlace,lang).description}</p><div className="modal-facts"><span>{t.noRating}</span><span><MapPin size={16}/>{localizedPlace(selectedPlace,lang).distance}</span><span><Accessibility size={16}/>{selectedPlace.accessible ? t.accessible : (rtl ? 'لم يتم تأكيد التجهيزات' : 'Not verified')}</span></div><div className="modal-actions"><button className="btn-primary" onClick={() => {const placeId=selectedPlace.id;const wasSaved=favorites.includes(placeId);toggleFavorite(placeId);setSelectedPlace(null);notify(wasSaved?t.unsaved:t.saved)}}>{favorites.includes(selectedPlace.id) ? t.savedLabel : t.save}<Heart size={17}/></button><button className="btn-outline" onClick={() => sharePlace(selectedPlace)}>{rtl?'مشاركة':'Share'}<Globe2 size={17}/></button></div></div></div></div>}
    </div>
  );
}

function PlaceGrid({items, t, lang, favorites, toggleFavorite, notify, onSelect}) {
  return <div className="place-grid">{items.map(p => { const lp = localizedPlace(p, lang); return <article className="place-card" key={p.id}><div className="place-image-wrap"><img src={p.image} alt={lp.name}/><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => {toggleFavorite(p.id);notify(favorites.includes(p.id)?t.unsaved:t.saved)}} aria-label={favorites.includes(p.id) ? t.savedLabel : t.saveAria}><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="place-category">{lp.category}</span></div><div className="place-info"><div className="place-title-row"><h3>{lp.name}</h3><span className="rating">{t.noRating}</span></div><p>{lp.description}</p><div className="place-meta"><span><MapPin size={14}/>{lp.city}</span><span><Clock3 size={14}/>{lp.distance}</span></div><div className="tag-row">{p.nature && <span><Map size={12}/>{t.nature}</span>}{p.family && <span><Baby size={12}/>{t.family}</span>}{p.accessible && <span><Accessibility size={12}/>{t.accessible}</span>}</div><button className="place-details" onClick={() => onSelect(p)}>{t.details}<ChevronLeft size={16}/></button></div></article>})}</div>;
}

export default App;