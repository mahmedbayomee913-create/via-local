import React, { useMemo, useState } from 'react';
import {
  MapPin, Compass, Users, Accessibility, Search, Globe2, Menu, X,
  Star, Clock3, Heart, ArrowUpLeft, ChevronLeft, ShieldCheck,
  Languages, Volume2, MessageCircle, CalendarDays, LocateFixed,
  SlidersHorizontal, Sparkles, CheckCircle2, Footprints, Baby,
  Utensils, Map, Headphones
} from 'lucide-react';

const places = [
  { id: 1, name: 'جامع السلطان قابوس الأكبر', city: 'مسقط', category: 'ثقافي', tags: ['عمارة', 'ثقافة'], rating: '—', distance: 'مسقط', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=85', description: 'معلم معماري بارز في مسقط، يتميز بتفاصيله الهادئة وفنونه الإسلامية. تحقّق من أوقات الزيارة وتعليمات الدخول قبل الذهاب.' },
  { id: 2, name: 'سوق مطرح', city: 'مسقط', category: 'تراثي', tags: ['تسوق', 'تراث'], rating: '—', distance: 'مطرح', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1000&q=85', description: 'أزقة سوق تقليدي مليئة بالمحلات والمنتجات المحلية، وتجربة قريبة من ذاكرة مسقط البحرية.' },
  { id: 3, name: 'قلعة نزوى', city: 'نزوى', category: 'تاريخي', tags: ['تاريخ', 'عمارة'], rating: '—', distance: 'الداخلية', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1000&q=85', description: 'قلعة تاريخية شهيرة في قلب نزوى، تعكس جانبًا مهمًا من العمارة الدفاعية والتراث العُماني.' },
  { id: 4, name: 'وادي شاب', city: 'صور', category: 'طبيعة', tags: ['مياه', 'مغامرة'], rating: '—', distance: 'جنوب الشرقية', family: false, nature: true, accessible: false, image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85', description: 'وادي طبيعي معروف بمياهه ومناظره الجبلية. يتطلب الوصول إليه مشيًا، لذلك راجع حالة الطقس وإرشادات السلامة قبل الزيارة.' },
  { id: 5, name: 'وادي دربات', city: 'صلالة', category: 'طبيعة', tags: ['طبيعة', 'عائلات'], rating: '—', distance: 'ظفار', family: true, nature: true, accessible: false, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=85', description: 'مناظر طبيعية خضراء وشلالات موسمية في محافظة ظفار، وتختلف الأجواء والمشهد حسب الموسم.' },
  { id: 6, name: 'قلعة خصب', city: 'خصب', category: 'تراثي', tags: ['تاريخ', 'ثقافة'], rating: '—', distance: 'مسندم', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1000&q=85', description: 'قلعة عُمانية تاريخية تطل على مشهد ساحلي في محافظة مسندم، وتقدم لمحة عن تاريخ المنطقة.' },
  { id: 7, name: 'رمال الشرقية', city: 'بدية', category: 'طبيعة', tags: ['صحراء', 'تجارب محلية'], rating: '—', distance: 'شمال الشرقية', family: true, nature: true, accessible: false, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85', description: 'كثبان رملية واسعة وتجربة صحراوية مميزة. اختر مزود خدمة مرخصًا واتبع إرشادات السلامة المحلية.' },
  { id: 8, name: 'شاطئ المغسيل', city: 'صلالة', category: 'طبيعة', tags: ['شاطئ', 'طبيعة'], rating: '—', distance: 'ظفار', family: true, nature: true, accessible: false, image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85', description: 'شاطئ معروف غرب صلالة بتكويناته الساحلية ونوافيره الطبيعية التي تظهر مع حركة البحر.' },
  { id: 9, name: 'غوبكلي تبه (Göbekli Tepe)', city: 'تركيا', category: 'أثري', tags: ['آثار', 'تاريخ قديم'], rating: '—', distance: 'شانلي أورفا', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1000&q=85', description: 'مجمع أثري يعود إلى نحو 11,500 عام ويضم أعمدة حجرية ضخمة منحوتة، ويُعد من أقدم المواقع المعروفة ذات الطابع الطقسي.' },
  { id: 10, name: 'مدينة ديرينكويو تحت الأرض', city: 'تركيا', category: 'أثري', tags: ['مدينة تحت الأرض', 'تاريخ'], rating: '—', distance: 'كابادوكيا', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=85', description: 'مدينة محفورة تحت الأرض في عدة مستويات، تضم ممرات وغرفًا ومرافق كانت تُستخدم للحماية والإقامة عبر فترات تاريخية.' },
  { id: 11, name: 'هايبوجيوم هال سافليني', city: 'مالطا', category: 'أثري', tags: ['معبد', 'تحت الأرض'], rating: '—', distance: 'باولا', family: false, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=85', description: 'مقبرة ومجمع تحت الأرض يعود إلى عصور ما قبل التاريخ، يتميز بممرات وغرف منحوتة في الصخر وخصائص صوتية لافتة. الزيارة تحتاج حجزًا مسبقًا.' },
  { id: 12, name: 'سكارا بري (Skara Brae)', city: 'اسكتلندا', category: 'أثري', tags: ['العصر الحجري', 'قرية قديمة'], rating: '—', distance: 'أوركني', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85', description: 'قرية من العصر الحجري الحديث بقيت فيها مساكن وأثاث حجري محفوظ بصورة استثنائية، وتمنح تصورًا عن الحياة اليومية قبل آلاف السنين.' },
  { id: 13, name: 'جميلة (Djémila)', city: 'الجزائر', category: 'أثري', tags: ['روماني', 'مدينة أثرية'], rating: '—', distance: 'سطيف', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1000&q=85', description: 'مدينة رومانية أثرية محفوظة في منطقة جبلية، تضم معابد وساحات وأقواسًا وآثارًا معمارية تعكس تخطيط المدن الرومانية.' },
  { id: 14, name: 'زيمبابوي العظمى (Great Zimbabwe)', city: 'زيمبابوي', category: 'أثري', tags: ['حضارة أفريقية', 'آثار حجرية'], rating: '—', distance: 'ماسينغو', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=85', description: 'أطلال مدينة حجرية كانت مركزًا لمملكة أفريقية مزدهرة، وتشتهر بجدرانها الحجرية الكبيرة المشيدة دون ملاط.' },
  { id: 15, name: 'تيواناكو (Tiwanaku)', city: 'بوليفيا', category: 'أثري', tags: ['ما قبل الإنكا', 'معابد'], rating: '—', distance: 'قرب بحيرة تيتيكاكا', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=85', description: 'موقع حضاري قديم على هضبة مرتفعة قرب بحيرة تيتيكاكا، يضم مباني ومعابد وأعمالًا حجرية دقيقة تعود إلى حضارة ما قبل الإنكا.' },
  { id: 16, name: 'سوخوثاي (Sukhothai)', city: 'تايلاند', category: 'أثري', tags: ['تاريخ', 'معابد بوذية'], rating: '—', distance: 'شمال وسط تايلاند', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1000&q=85', description: 'حديقة تاريخية تضم بقايا معابد وتماثيل بوذية وآثار مملكة سوخوثاي، وتشتهر بمساحاتها الواسعة وبركها وممراتها.' },
];

const guides = [
  { id: 1, name: 'مرشد محلي تجريبي 01', specialty: 'جولات ثقافية في الوجهات', languages: 'العربية • الإنجليزية', rating: '—', price: 'السعر عند تأكيد مقدم الخدمة', initials: 'عُ' },
  { id: 2, name: 'مرشد محلي تجريبي 02', specialty: 'جولات تراثية وتاريخية', languages: 'العربية • الإنجليزية', rating: '—', price: 'السعر عند تأكيد مقدم الخدمة', initials: 'ن' },
  { id: 3, name: 'مرشد محلي تجريبي 03', specialty: 'تجارب طبيعة ومناطق محلية', languages: 'العربية • الإنجليزية', rating: '—', price: 'السعر عند تأكيد مقدم الخدمة', initials: 'ظ' }
];

const copy = {
ar:{explore:'لا تزُر المكان... انتمِ إليه',guides:'عِش المكان بعيون أهله',access:'السفر للجميع... بلا حواجز',home:'الرئيسية',discover:'اكتشف العالم',localGuides:'المرشدون المحليون',inclusive:'الوصول الشامل',tagline:'العالم أقرب مما تتخيّل',heroLine1:'سفر آمن وشامل...',heroLine2:'انتمِ إلى المكان',sub:'فيا لوكال يجمع استكشاف الوجهات، والتعرّف على المرشدين المحليين، ومعلومات الوصول الشامل — في تجربة واحدة.',heroLabel:'منصة سياحية ذكية · تجربة سفر للجميع',announcement:'منصة فيا لوكال — استكشف العالم بأمان، واكتشف المكان مع أهله',search:'ابحث عن دولة أو مدينة أو وجهة...',start:'ابدأ الاستكشاف',exploreTitle:'وجهات حول العالم تستحق التجربة',exploreSub:'اكتشف حكايات المواقع التاريخية والثقافات والطبيعة.',all:'كل الوجهات',family:'مناسب للعائلات',halal:'خيارات الطعام الحلال',nature:'طبيعة ومغامرات',accessible:'إمكانية الوصول',guidesTitle:'تعرّف على المرشدين المحليين',guidesSub:'ملفات مرشدين افتراضية للعرض فقط؛ ليست أشخاصًا حقيقيين ولا حجوزات متاحة.',guidesFeatureSub:'تعرّف على نماذج توضيحية لخدمة الإرشاد المحلي.',accessSub:'معلومات وصول توضيحية وأدوات تواصل أولية.',viewProfile:'عرض الملف',book:'طلب تجريبي',accessTitle:'تجربة سفر أكثر شمولًا',mapTitle:'خريطة الوصول — نموذج توضيحي',mapSub:'الرسم الحالي ليس خريطة فعلية ولا يعرض بيانات أماكن مباشرة.',communication:'تحويل النص إلى صوت',communicationSub:'اكتب عبارة وسيحاول المتصفح قراءتها بصوت مسموع.',typeHere:'اكتب ما تريد قوله...',speak:'استمع إلى العبارة',stop:'إيقاف الصوت',location:'استخدم موقعي',locationHelp:'الموقع اختياري ولا يُستخدم حاليًا لجلب أماكن حقيقية.',featured:'وجهات مختارة',categories:'اكتشف تجارب جديدة',history:'تاريخ وثقافة',familyCat:'عائلات وأطفال',food:'مطاعم ومقاهٍ',accessibleCat:'وصول ميسّر',rating:'التقييم',distance:'المنطقة',details:'التفاصيل',demo:'نسخة تجريبية',footer:'رحلتك تبدأ بفهم المكان.',requestSent:'هذا إجراء تجريبي فقط — لم يتم إنشاء حجز أو طلب حقيقي.',close:'إغلاق',searchResults:'نتائج الاستكشاف',noResults:'لا توجد نتائج مطابقة. جرّب تغيير البحث أو الفلاتر.',filter:'تصفية',language:'English',verifiedNote:'معلومات تعريفية أولية. تحقق من تفاصيل الزيارة من المصادر الرسمية. الصور قد تكون توضيحية، ولا توجد تقييمات أو توافر مباشر.',saved:'تمت إضافة المكان إلى المفضلة.',unsaved:'تمت إزالة المكان من المفضلة.',save:'أضف للمفضلة',savedLabel:'في المفضلة',homeAria:'العودة للرئيسية',menuAria:'فتح القائمة',saveAria:'حفظ المكان في المفضلة'},
en:{explore:'Don’t just visit. Belong.',guides:'Experience places through local eyes',access:'Travel without barriers',home:'Home',discover:'Explore the world',localGuides:'Local guides',inclusive:'Accessibility',tagline:'The world is closer than you imagine',heroLine1:'Travel safely and inclusively...',heroLine2:'Belong to the place',sub:'VIA LOCAL brings destination discovery, local guide introductions, and accessibility information together in one experience.',heroLabel:'Smart travel platform · Travel for everyone',announcement:'VIA LOCAL — Explore the world safely and discover places with local people',search:'Search a country, city, or destination...',start:'Start exploring',exploreTitle:'Destinations around the world worth experiencing',exploreSub:'Discover stories, historic sites, cultures, and nature.',all:'All destinations',family:'Family-friendly',halal:'Halal food options',nature:'Nature & outdoors',accessible:'Accessibility',guidesTitle:'Meet local guides',guidesSub:'Sample profiles for demonstration only; these are not real people or available bookings.',guidesFeatureSub:'Preview an illustrative local-guide service.',accessSub:'Illustrative accessibility information and basic communication tools.',viewProfile:'View profile',book:'Demo request',accessTitle:'A more inclusive travel experience',mapTitle:'Accessibility map — demo',mapSub:'This illustration is not a real map and does not show live place data.',communication:'Text-to-speech',communicationSub:'Type a phrase and your browser may read it aloud.',typeHere:'Type what you want to say...',speak:'Speak phrase',stop:'Stop speech',location:'Use my location',locationHelp:'Location is optional and is not used to fetch real places yet.',featured:'Featured destinations',categories:'Discover new experiences',history:'History & culture',familyCat:'Families & kids',food:'Restaurants & cafes',accessibleCat:'Accessible travel',rating:'Rating',distance:'Area',details:'Details',demo:'Prototype',footer:'Your journey starts with understanding the place.',requestSent:'Demo only — no real booking or request was created.',close:'Close',searchResults:'Discovery results',noResults:'No matches. Try changing your search or filters.',filter:'Filters',language:'العربية',verifiedNote:'Introductory information. Verify visitor details with official sources. Images may be illustrative; ratings and availability are not live.',saved:'Added to favorites.',unsaved:'Removed from favorites.',save:'Save to favorites',savedLabel:'Saved',homeAria:'Go to home',menuAria:'Open menu',saveAria:'Save place to favorites'}
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
9:{name:'Göbekli Tepe',city:'Türkiye',category:'Archaeological',distance:'Şanlıurfa',tags:['Archaeology','Prehistory'],description:'A Neolithic site with monumental T-shaped stone pillars and carved animal imagery, dating to roughly 11,500 years ago.'},
10:{name:'Derinkuyu Underground City',city:'Türkiye',category:'Archaeological',distance:'Cappadocia',tags:['Underground city','History'],description:'A multi-level underground settlement with rooms and passages. Check visitor access and restrictions before travel.'},
11:{name:'Ħal Saflieni Hypogeum',city:'Malta',category:'Archaeological',distance:'Paola',tags:['Prehistoric','Underground'],description:'A prehistoric underground complex used as a burial site, with chambers cut into limestone. Visits are limited and advance booking is required.'},
12:{name:'Skara Brae',city:'Scotland',category:'Archaeological',distance:'Orkney',tags:['Neolithic','Ancient village'],description:'A remarkably preserved Neolithic settlement with stone-built homes and furnishings.'},
13:{name:'Djémila',city:'Algeria',category:'Archaeological',distance:'Sétif',tags:['Roman','Ancient city'],description:'A Roman town in a mountain setting, with a forum, temples, basilicas, arches, and houses.'},
14:{name:'Great Zimbabwe',city:'Zimbabwe',category:'Archaeological',distance:'Masvingo',tags:['African heritage','Stone ruins'],description:'Ruins of a major Shona city and trading centre, built with dry-stone masonry between the 11th and 15th centuries.'},
15:{name:'Tiwanaku',city:'Bolivia',category:'Archaeological',distance:'La Paz region',tags:['Pre-Inca','Monuments'],description:'A major pre-Hispanic ceremonial and political centre on the Andean Altiplano, known for monumental stone architecture.'},
16:{name:'Sukhothai Historical Park',city:'Thailand',category:'Archaeological',distance:'Sukhothai',tags:['History','Buddhist monuments'],description:'A historic park preserving temples, Buddhist images, and remains of the Sukhothai kingdom.'}
};
function localizedPlace(p,lang){return lang==='en'?{...p,...(placeEN[p.id]||{})}:p;}

function App() {
  const [lang, setLang] = useState('ar');
  const [tab, setTab] = useState('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [speechText, setSpeechText] = useState('');
  const [notice, setNotice] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const t = copy[lang];
  const rtl = lang === 'ar';

  const filteredPlaces = useMemo(() => places.filter(p => {
    const lp = localizedPlace(p, lang); const matchesQuery = `${p.name} ${p.city} ${p.category} ${p.tags.join(' ')} ${lp.name} ${lp.city} ${lp.category} ${lp.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'family' && p.family) || (filter === 'nature' && p.nature) || (filter === 'history' && ['أثري','تاريخي','تراثي'].includes(p.category));
    return matchesQuery && matchesFilter;
  }), [query, filter, lang]);

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

  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const navItems = [
    ['home', t.home, Compass], ['explore', t.discover, MapPin],
    ['guides', t.localGuides, Users], ['access', t.inclusive, Accessibility]
  ];

  return (
    <div className={rtl ? 'app' : 'app ltr'} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="announcement-bar"><Sparkles size={13}/><span>{t.announcement}</span><Sparkles size={13}/></div>
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => setTab('home')} aria-label={t.homeAria}>
            <span className="brand-mark"><MapPin size={25} strokeWidth={2.5}/></span>
            <span className="brand-name arabic-brand">فيا لوكال<small>VIA LOCAL</small></span>
          </button>
          <nav className="desktop-nav">
            {navItems.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'nav-link active' : 'nav-link'} onClick={() => setTab(id)}><Icon size={17}/>{label}</button>)}
          </nav>
          <div className="header-actions">
            <button className="language-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}><Globe2 size={17}/>{t.language}</button>
            <button className="menu-btn" onClick={() => setMobileMenu(!mobileMenu)} aria-label={t.menuAria}>{mobileMenu ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {mobileMenu && <div className="mobile-nav">{navItems.map(([id, label, Icon]) => <button key={id} onClick={() => {setTab(id);setMobileMenu(false)}}><Icon size={18}/>{label}</button>)}</div>}
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
                <input value={query} onChange={e => {setQuery(e.target.value);setTab('explore')}} placeholder={t.search}/>
                <button onClick={() => setTab('explore')}>{t.start}<ArrowUpLeft size={17}/></button>
              </div>
              <div className="location-row"><button onClick={requestLocation}><LocateFixed size={16}/>{t.location}</button><span>{locationText || t.locationHelp}</span></div>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.categories}</span><h2>{t.explore}</h2></div><button className="text-link" onClick={() => setTab('explore')}>{t.discover}<ChevronLeft size={17}/></button></div>
            <div className="feature-grid">
              <button className="feature-card feature-burgundy" onClick={() => setTab('explore')}><span className="feature-icon"><Compass/></span><strong>{t.explore}</strong><small>{t.exploreSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-gold" onClick={() => setTab('guides')}><span className="feature-icon"><Users/></span><strong>{t.guides}</strong><small>{t.guidesFeatureSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-light" onClick={() => setTab('access')}><span className="feature-icon"><Accessibility/></span><strong>{t.access}</strong><small>{t.accessSub}</small><ArrowUpLeft className="feature-arrow"/></button>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.featured}</span><h2>{t.exploreTitle}</h2></div><button className="text-link" onClick={() => setTab('explore')}>{t.details}<ChevronLeft size={17}/></button></div>
            <PlaceGrid items={places.slice(8,11)} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} onSelect={setSelectedPlace}/>
          </section>
        </>}

        {tab === 'explore' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.explore}</span><h1>{t.exploreTitle}</h1><p>{t.exploreSub}</p></div>
          <div className="filter-panel">
            <div className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/></div>
            <div className="filter-chips">
              {[['all',t.all],['family',t.family],['nature',t.nature],['history',t.history]].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'chip selected' : 'chip'}>{label}</button>)}
            </div>
          </div>
          <div className="results-caption"><span><SlidersHorizontal size={16}/>{t.searchResults}</span><small>{filteredPlaces.length} {rtl ? 'أماكن' : 'places'}</small></div>
          {filteredPlaces.length ? <PlaceGrid items={filteredPlaces} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} onSelect={setSelectedPlace}/> : <div className="empty-state"><Search size={30}/><p>{t.noResults}</p></div>}
        </section>}

        {tab === 'guides' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.guides}</span><h1>{t.guidesTitle}</h1><p>{t.guidesSub}</p></div>
          <div className="guide-intro"><div className="guide-intro-icon"><Headphones size={30}/></div><div><h3>{rtl ? 'تجربة محلية أقرب إليك' : 'A more local experience'}</h3><p>{rtl ? 'اختر مرشدًا يناسب اهتماماتك ولغتك واطلب جولة تجريبية.' : 'Choose a guide based on your interests and language, then request a demo tour.'}</p></div></div>
          <div className="guide-grid">{guides.map(g => <article className="guide-card" key={g.id}><div className="guide-top"><div className="avatar">{g.initials}</div><span className="rating"><Star size={15} fill="currentColor"/>{g.rating}</span></div><h3>{rtl ? g.name : ['Sample local guide 01','Sample local guide 02','Sample local guide 03'][g.id-1]}</h3><p className="muted">{rtl ? g.specialty : ['Cultural city tours','Heritage walks and history','Nature and regional experiences'][g.id-1]}</p><div className="guide-language"><Languages size={16}/>{rtl ? g.languages : 'Arabic · English'}</div><div className="guide-bottom"><strong>{rtl ? g.price : 'Demo profile · No real service'}</strong><button className="btn-primary small" onClick={() => notify(t.requestSent)}>{t.book}</button></div></article>)}</div>
          <p className="disclaimer"><ShieldCheck size={16}/>{t.verifiedNote}</p>
        </section>}

        {tab === 'access' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.access}</span><h1>{t.accessTitle}</h1><p>{t.accessSub}</p></div>
          <div className="access-grid">
            <article className="access-card map-card"><div className="access-icon"><Map size={25}/></div><h2>{t.mapTitle}</h2><p>{t.mapSub}</p><div className="map-placeholder"><div className="map-lines"></div><span className="map-pin pin-one"><MapPin/></span><span className="map-pin pin-two"><MapPin/></span><span className="map-pin pin-three"><MapPin/></span><div className="map-label"><Accessibility size={16}/>{rtl ? 'أماكن مهيأة (بيانات تجريبية)' : 'Accessible places (demo data)'}</div></div><small className="muted">{t.verifiedNote}</small></article>
            <article className="access-card speech-card"><div className="access-icon"><MessageCircle size={25}/></div><h2>{t.communication}</h2><p>{t.communicationSub}</p><textarea value={speechText} onChange={e => setSpeechText(e.target.value)} placeholder={t.typeHere} rows="4"/><div className="speech-actions"><button className="btn-primary" onClick={speak}><Volume2 size={17}/>{t.speak}</button><button className="btn-outline" onClick={() => window.speechSynthesis?.cancel()}>{t.stop}</button></div><div className="speech-note"><CheckCircle2 size={16}/>{rtl ? 'تعتمد الميزة على دعم المتصفح للأصوات المتاحة.' : 'This feature depends on browser speech voice support.'}</div></article>
          </div>
          <div className="access-note"><Accessibility size={22}/><div><strong>{rtl ? 'التصميم الشامل يتجاوز ميزة واحدة' : 'Accessibility is more than one feature'}</strong><p>{rtl ? 'النسخة القادمة ستضيف معلومات موثقة عن المنحدرات والمصاعد ودورات المياه المهيأة، ودعم تحويل الكلام إلى نص وأدوات تواصل إضافية.' : 'The next version can add verified ramp, elevator and restroom details, speech-to-text and more communication tools.'}</p></div></div>
        </section>}
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark"><MapPin size={20}/></span><div><strong>VIA LOCAL</strong><small>{t.footer}</small></div></div><span className="footer-copy">© 2026 VIA LOCAL · {t.demo}</span></div></footer>

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      {selectedPlace && <div className="modal-backdrop" onClick={() => setSelectedPlace(null)}><div className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedPlace(null)}><X/></button><img src={selectedPlace.image} alt={localizedPlace(selectedPlace,lang).name}/><div className="modal-body"><span className="eyebrow gold-text">{localizedPlace(selectedPlace,lang).city} · {localizedPlace(selectedPlace,lang).category}</span><h2>{localizedPlace(selectedPlace,lang).name}</h2><p>{localizedPlace(selectedPlace,lang).description}</p><div className="modal-facts"><span><Star size={16}/>{selectedPlace.rating}</span><span><MapPin size={16}/>{localizedPlace(selectedPlace,lang).distance}</span><span><Accessibility size={16}/>{selectedPlace.accessible ? t.accessible : (rtl ? 'لم يتم تأكيد التجهيزات' : 'Not verified')}</span></div><button className="btn-primary" onClick={() => {const placeId=selectedPlace.id;const wasSaved=favorites.includes(placeId);toggleFavorite(placeId);setSelectedPlace(null);notify(wasSaved?t.unsaved:t.saved)}}>{favorites.includes(selectedPlace.id) ? t.savedLabel : t.save}<Heart size={17}/></button></div></div></div>}
    </div>
  );
}

function PlaceGrid({items, t, lang, favorites, toggleFavorite, onSelect}) {
  return <div className="place-grid">{items.map(p => { const lp = localizedPlace(p, lang); return <article className="place-card" key={p.id}><div className="place-image-wrap"><img src={p.image} alt={lp.name}/><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => toggleFavorite(p.id)} aria-label={favorites.includes(p.id) ? t.savedLabel : t.saveAria}><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="place-category">{lp.category}</span></div><div className="place-info"><div className="place-title-row"><h3>{lp.name}</h3><span className="rating"><Star size={14} fill="currentColor"/>{p.rating}</span></div><p>{lp.description}</p><div className="place-meta"><span><MapPin size={14}/>{lp.city}</span><span><Clock3 size={14}/>{lp.distance}</span></div><div className="tag-row">{p.nature && <span><Map size={12}/>{t.nature}</span>}{p.family && <span><Baby size={12}/>{t.family}</span>}{p.accessible && <span><Accessibility size={12}/>{t.accessible}</span>}</div><button className="place-details" onClick={() => onSelect(p)}>{t.details}<ChevronLeft size={16}/></button></div></article>})}</div>;
}

export default App;