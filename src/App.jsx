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
  { id: 9, name: 'غوبكلي تبه (Göbekli Tepe)', city: 'تركيا', category: 'أثري', tags: ['آثار', 'تاريخ قديم'], rating: '—', distance: 'شانلي أورفا', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1000&q=85', description: 'مجمع أثري يعود إلى نحو 12,000 عام ويضم أعمدة حجرية ضخمة منحوتة، ويُعد من أقدم المواقع المعروفة ذات الطابع الطقسي.' },
  { id: 10, name: 'مدينة ديرينكويو تحت الأرض', city: 'تركيا', category: 'أثري', tags: ['مدينة تحت الأرض', 'تاريخ'], rating: '—', distance: 'كابادوكيا', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=85', description: 'مدينة محفورة تحت الأرض في عدة مستويات، تضم ممرات وغرفًا ومرافق كانت تُستخدم للحماية والإقامة عبر فترات تاريخية.' },
  { id: 11, name: 'هايبوجيوم هال سافليني', city: 'مالطا', category: 'أثري', tags: ['معبد', 'تحت الأرض'], rating: '—', distance: 'باولا', family: false, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=85', description: 'موقع ومعبد تحت الأرض يعود إلى عصور ما قبل التاريخ، يتميز بممرات وغرف منحوتة في الصخر وخصائص صوتية لافتة. الزيارة تحتاج حجزًا مسبقًا.' },
  { id: 12, name: 'سكارا بري (Skara Brae)', city: 'اسكتلندا', category: 'أثري', tags: ['العصر الحجري', 'قرية قديمة'], rating: '—', distance: 'أوركني', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85', description: 'قرية من العصر الحجري الحديث بقيت فيها مساكن وأثاث حجري محفوظ بصورة استثنائية، وتمنح تصورًا عن الحياة اليومية قبل آلاف السنين.' },
  { id: 13, name: 'جميلة (Djémila)', city: 'الجزائر', category: 'أثري', tags: ['روماني', 'مدينة أثرية'], rating: '—', distance: 'سطيف', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1000&q=85', description: 'مدينة رومانية أثرية محفوظة في منطقة جبلية، تضم معابد وساحات وأقواسًا وآثارًا معمارية تعكس تخطيط المدن الرومانية.' },
  { id: 14, name: 'زيمبابوي العظمى (Great Zimbabwe)', city: 'زيمبابوي', category: 'أثري', tags: ['حضارة أفريقية', 'آثار حجرية'], rating: '—', distance: 'ماسينغو', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=85', description: 'أطلال مدينة حجرية كانت مركزًا لمملكة أفريقية مزدهرة، وتشتهر بجدرانها الحجرية الكبيرة المشيدة دون ملاط.' },
  { id: 15, name: 'تيواناكو (Tiwanaku)', city: 'بوليفيا', category: 'أثري', tags: ['ما قبل الإنكا', 'معابد'], rating: '—', distance: 'قرب بحيرة تيتيكاكا', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=85', description: 'موقع حضاري قديم على هضبة مرتفعة قرب بحيرة تيتيكاكا، يضم مباني ومعابد وأعمالًا حجرية دقيقة تعود إلى حضارة ما قبل الإنكا.' },
  { id: 16, name: 'سوخوثاي (Sukhothai)', city: 'تايلاند', category: 'أثري', tags: ['تاريخ', 'معابد بوذية'], rating: '—', distance: 'شمال وسط تايلاند', family: true, nature: false, accessible: false, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1000&q=85', description: 'حديقة تاريخية تضم بقايا معابد وتماثيل بوذية وآثار مملكة سوخوثاي، وتشتهر بمساحاتها الواسعة وبركها وممراتها.' },
];

const guides = [
  { id: 1, name: 'مرشد محلي تجريبي 01', specialty: 'جولات ثقافية في مسقط', languages: 'العربية • الإنجليزية', rating: '—', price: 'السعر عند تأكيد مقدم الخدمة', initials: 'عُ' },
  { id: 2, name: 'مرشد محلي تجريبي 02', specialty: 'تراث نزوى والداخلية', languages: 'العربية • الإنجليزية', rating: '—', price: 'السعر عند تأكيد مقدم الخدمة', initials: 'ن' },
  { id: 3, name: 'مرشد محلي تجريبي 03', specialty: 'طبيعة ظفار وصلالة', languages: 'العربية • الإنجليزية', rating: '—', price: 'السعر عند تأكيد مقدم الخدمة', initials: 'ظ' }
];

const copy = {
  ar: {
    explore: 'لا تزُر المكان... انتمِ إليه', guides: 'عِش عُمان بعيون أهلها', access: 'السفر للجميع... بلا حواجز',
    home: 'الرئيسية', discover: 'اكتشف العالم', localGuides: 'المرشدون المحليون', inclusive: 'الوصول الشامل',
    tagline: 'العالم أقرب مما تتخيّل', sub: 'اكتشف وجهات استثنائية حول العالم؛ من المدن القديمة والمواقع الأثرية إلى الطبيعة والثقافات المختلفة، في تجربة سفر واحدة.',
    search: 'ابحث عن دولة أو مدينة أو وجهة...', start: 'ابدأ الاستكشاف', exploreTitle: 'وجهات حول العالم تستحق التجربة',
    exploreSub: 'اختار وجهتك واكتشف حكايات المواقع التاريخية والثقافات والطبيعة.', all: 'كل الوجهات', family: 'مناسب للعائلات',
    halal: 'خيارات الطعام الحلال', nature: 'طبيعة ومغامرات', accessible: 'معلومات الوصول', guidesTitle: 'اكتشف عُمان مع أهلها',
    guidesSub: 'تعرّف على نماذج تجريبية لخدمات الإرشاد المحلي. لا تمثل هذه الملفات أشخاصًا حقيقيين أو حجوزات متاحة.',
    viewProfile: 'عرض الملف', book: 'طلب تواصل تجريبي', accessTitle: 'تجربة سفر أكثر شمولًا',
    accessSub: 'نعمل على توضيح معلومات الوصول واحتياجات الزوار، مع أدوات تواصل أولية.',
    mapTitle: 'خريطة الوصول — نموذج توضيحي', mapSub: 'الخريطة الحالية رسم تجريبي وليست بيانات جغرافية مباشرة.',
    communication: 'مساعد تحويل النص إلى صوت', communicationSub: 'اكتب العبارة وسيحاول المتصفح قراءتها بصوت مسموع.',
    typeHere: 'اكتب ما تريد قوله...', speak: 'استمع إلى العبارة', stop: 'إيقاف الصوت',
    location: 'استخدم موقعي', locationHelp: 'يمكنك السماح بالموقع من جهازك؛ لا نستخدمه حاليًا لجلب أماكن حقيقية.',
    featured: 'ابدأ من هنا', categories: 'تجارب حول العالم', history: 'تاريخ وثقافة', familyCat: 'عائلات وأطفال',
    food: 'مطاعم ومقاهٍ', accessibleCat: 'وصول ميسّر', rating: 'التقييم', distance: 'المنطقة',
    details: 'التفاصيل', demo: 'نسخة تجريبية', footer: 'رحلتك تبدأ بفهم المكان.', requestSent: 'تم تسجيل طلبك التجريبي فقط — لا يوجد حجز فعلي.',
    close: 'إغلاق', searchResults: 'نتائج الاستكشاف', noResults: 'لا توجد نتائج مطابقة. جرّب تغيير البحث أو الفلاتر.',
    filter: 'تصفية', language: 'English', verifiedNote: 'المعلومات تعريفية أولية؛ تحقق من تفاصيل الزيارة والحجز من الجهات الرسمية. الصور قد تكون توضيحية، والتقييمات والتوافر غير متصلين.'
  },
  en: {
    explore: 'Don’t just visit. Belong.', guides: 'See Oman through local eyes', access: 'Travel without barriers',
    home: 'Home', discover: 'Explore the world', localGuides: 'Local guides', inclusive: 'Accessibility',
    tagline: 'The world is closer than you imagine', sub: 'Discover extraordinary destinations—from ancient cities and archaeological sites to landscapes and cultures—in one travel experience.',
    search: 'Search a country, city, or destination...', start: 'Start exploring', exploreTitle: 'Destinations around the world worth experiencing',
    exploreSub: 'Explore historic places, cultures, landscapes, and remarkable destinations.', all: 'All destinations', family: 'Family-friendly',
    halal: 'Halal food options', nature: 'Nature & outdoors', accessible: 'Accessibility info', guidesTitle: 'Discover Oman with locals',
    guidesSub: 'These are sample guide profiles for demonstration only, not real people or available bookings.',
    viewProfile: 'View profile', book: 'Send demo request', accessTitle: 'A more inclusive travel experience',
    accessSub: 'We aim to make accessibility information clearer and provide simple communication tools.',
    mapTitle: 'Accessibility map — demo', mapSub: 'This illustration is not live geographic data.',
    communication: 'Text-to-speech assistant', communicationSub: 'Type a phrase and your browser will try to read it aloud.',
    typeHere: 'Type what you want to say...', speak: 'Speak phrase', stop: 'Stop',
    location: 'Use my location', locationHelp: 'You can grant location permission; it is not yet used to fetch real places.',
    featured: 'Start here', categories: 'Experiences around the world', history: 'History & culture', familyCat: 'Families & kids',
    food: 'Restaurants & cafes', accessibleCat: 'Accessible travel', rating: 'Rating', distance: 'Region',
    details: 'Details', demo: 'Prototype', footer: 'Your journey starts with understanding the place.', requestSent: 'Demo request noted only — no real booking was made.',
    close: 'Close', searchResults: 'Discovery results', noResults: 'No matching destinations. Try changing your search or filters.',
    filter: 'Filters', language: 'العربية', verifiedNote: 'Introductory information; verify visitor details with official sources. Images may be illustrative; ratings and availability are not live.'
  }
};

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
    const matchesQuery = `${p.name} ${p.city} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'family' && p.family) || (filter === 'nature' && p.nature) || (filter === 'accessible' && p.accessible);
    return matchesQuery && matchesFilter;
  }), [query, filter]);

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
      <div className="announcement-bar"><Sparkles size={13}/><span>منصة فيا لوكال — سفر آمن وشامل، ومرشد محلي يفتح لك أبواب المكان</span><Sparkles size={13}/></div>
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => setTab('home')} aria-label="Via Local home">
            <span className="brand-mark"><MapPin size={25} strokeWidth={2.5}/></span>
            <span className="brand-name arabic-brand">فيا لوكال<small>VIA LOCAL</small></span>
          </button>
          <nav className="desktop-nav">
            {navItems.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'nav-link active' : 'nav-link'} onClick={() => setTab(id)}><Icon size={17}/>{label}</button>)}
          </nav>
          <div className="header-actions">
            <button className="language-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}><Globe2 size={17}/>{t.language}</button>
            <button className="menu-btn" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {mobileMenu && <div className="mobile-nav">{navItems.map(([id, label, Icon]) => <button key={id} onClick={() => {setTab(id);setMobileMenu(false)}}><Icon size={18}/>{label}</button>)}</div>}
      </header>

      <main>
        {tab === 'home' && <>
          <section className="hero">
            <div className="hero-image"></div>
            <div className="container hero-content">
              <span className="eyebrow hero-label"><Sparkles size={15}/>منصة سياحية ذكية · توثيق السعر المناسب</span>
              <h1>سفر آمن وشامل...<br/><em>انتم إلى المكان</em></h1>
              <p className="hero-description">فيا لوكال يجمع الاستكشاف الذكي للوجهات، وحجز المرشدين السياحيين المحليين، وخدمات الوصول الشامل لذوي الاحتياجات الخاصة — في تجربة واحدة مريحة وممتعة للجميع.</p>
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
              <button className="feature-card feature-gold" onClick={() => setTab('guides')}><span className="feature-icon"><Users/></span><strong>{t.guides}</strong><small>{t.guidesSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-light" onClick={() => setTab('access')}><span className="feature-icon"><Accessibility/></span><strong>{t.access}</strong><small>{t.accessSub}</small><ArrowUpLeft className="feature-arrow"/></button>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.featured}</span><h2>{t.exploreTitle}</h2></div><button className="text-link" onClick={() => setTab('explore')}>{t.details}<ChevronLeft size={17}/></button></div>
            <PlaceGrid items={places.slice(0,3)} t={t} favorites={favorites} toggleFavorite={toggleFavorite} onSelect={setSelectedPlace}/>
          </section>
        </>}

        {tab === 'explore' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.explore}</span><h1>{t.exploreTitle}</h1><p>{t.exploreSub}</p></div>
          <div className="filter-panel">
            <div className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/></div>
            <div className="filter-chips">
              {[['all',t.all],['family',t.family],['nature',t.nature],['accessible',t.accessible]].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'chip selected' : 'chip'}>{label}</button>)}
            </div>
          </div>
          <div className="results-caption"><span><SlidersHorizontal size={16}/>{t.searchResults}</span><small>{filteredPlaces.length} {rtl ? 'أماكن' : 'places'}</small></div>
          {filteredPlaces.length ? <PlaceGrid items={filteredPlaces} t={t} favorites={favorites} toggleFavorite={toggleFavorite} onSelect={setSelectedPlace}/> : <div className="empty-state"><Search size={30}/><p>{t.noResults}</p></div>}
        </section>}

        {tab === 'guides' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.guides}</span><h1>{t.guidesTitle}</h1><p>{t.guidesSub}</p></div>
          <div className="guide-intro"><div className="guide-intro-icon"><Headphones size={30}/></div><div><h3>{rtl ? 'تجربة محلية أقرب إليك' : 'A more local experience'}</h3><p>{rtl ? 'اختر مرشدًا يناسب اهتماماتك ولغتك واطلب جولة تجريبية.' : 'Choose a guide based on your interests and language, then request a demo tour.'}</p></div></div>
          <div className="guide-grid">{guides.map(g => <article className="guide-card" key={g.id}><div className="guide-top"><div className="avatar">{g.initials}</div><span className="rating"><Star size={15} fill="currentColor"/>{g.rating}</span></div><h3>{g.name}</h3><p className="muted">{g.specialty}</p><div className="guide-language"><Languages size={16}/>{g.languages}</div><div className="guide-bottom"><strong>{g.price}</strong><button className="btn-primary small" onClick={() => notify(t.requestSent)}>{t.book}</button></div></article>)}</div>
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

      <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark">V</span><div><strong>VIA LOCAL</strong><small>{t.footer}</small></div></div><span className="footer-copy">© 2026 VIA LOCAL · {t.demo}</span></div></footer>

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      {selectedPlace && <div className="modal-backdrop" onClick={() => setSelectedPlace(null)}><div className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedPlace(null)}><X/></button><img src={selectedPlace.image} alt={selectedPlace.name}/><div className="modal-body"><span className="eyebrow gold-text">{selectedPlace.city} · {selectedPlace.category}</span><h2>{selectedPlace.name}</h2><p>{selectedPlace.description}</p><div className="modal-facts"><span><Star size={16}/>{selectedPlace.rating}</span><span><MapPin size={16}/>{selectedPlace.distance}</span><span><Accessibility size={16}/>{selectedPlace.accessible ? t.accessible : (rtl ? 'لم يتم تأكيد التجهيزات' : 'Not verified')}</span></div><button className="btn-primary" onClick={() => {setSelectedPlace(null);notify(t.requestSent)}}>{rtl ? 'احفظ المكان لرحلتي' : 'Save to my trip'}<Heart size={17}/></button></div></div></div>}
    </div>
  );
}

function PlaceGrid({items, t, favorites, toggleFavorite, onSelect}) {
  return <div className="place-grid">{items.map(p => <article className="place-card" key={p.id}><div className="place-image-wrap"><img src={p.image} alt={p.name}/><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => toggleFavorite(p.id)} aria-label="Save place"><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="place-category">{p.category}</span></div><div className="place-info"><div className="place-title-row"><h3>{p.name}</h3><span className="rating"><Star size={14} fill="currentColor"/>{p.rating}</span></div><p>{p.description}</p><div className="place-meta"><span><MapPin size={14}/>{p.city}</span><span><Clock3 size={14}/>{p.distance}</span></div><div className="tag-row">{p.nature && <span><Map size={12}/>{t.nature}</span>}{p.family && <span><Baby size={12}/>{t.family}</span>}{p.accessible && <span><Accessibility size={12}/>{t.accessible}</span>}</div><button className="place-details" onClick={() => onSelect(p)}>{t.details}<ChevronLeft size={16}/></button></div></article>)}</div>;
}

export default App;