import React, { useMemo, useState } from 'react';
import {
  MapPin, Compass, Users, Accessibility, Search, Globe2, Menu, X,
  Star, Clock3, Heart, ArrowUpLeft, ChevronLeft, ShieldCheck,
  Languages, Volume2, MessageCircle, CalendarDays, LocateFixed,
  SlidersHorizontal, Sparkles, CheckCircle2, Footprints, Baby,
  Utensils, Map, Headphones
} from 'lucide-react';

const places = [
  { id: 1, name: 'قلعة صلاح الدين', city: 'القاهرة', category: 'تاريخي', tags: ['ثقافة', 'تاريخ'], rating: '4.9', distance: '2.4 كم', family: true, halal: false, accessible: true, image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=85', description: 'اكتشف واحدة من أبرز معالم القاهرة التاريخية وإطلالتها المميزة.' },
  { id: 2, name: 'ممشى أهل مصر', city: 'القاهرة', category: 'ترفيهي', tags: ['عائلات', 'نزهات'], rating: '4.7', distance: '1.1 كم', family: true, halal: true, accessible: true, image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85', description: 'مساحة مفتوحة للتنزه والاستمتاع بإطلالة النيل.' },
  { id: 3, name: 'المتحف القومي للحضارة', city: 'القاهرة', category: 'ثقافي', tags: ['ثقافة', 'تاريخ'], rating: '4.8', distance: '5.2 كم', family: true, halal: false, accessible: true, image: 'https://images.unsplash.com/photo-1565060169194-19fabf63012b?auto=format&fit=crop&w=900&q=85', description: 'رحلة بين فصول من تاريخ الحضارة المصرية.' },
  { id: 4, name: 'حديقة العائلة', city: 'القاهرة', category: 'عائلي', tags: ['أطفال', 'عائلات'], rating: '4.5', distance: '8.0 كم', family: true, halal: true, accessible: false, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85', description: 'اختيار مناسب لقضاء وقت ممتع مع الأطفال والعائلة.' }
];

const guides = [
  { id: 1, name: 'سارة محمود', specialty: 'مرشدة تاريخية وثقافية', languages: 'العربية • الإنجليزية', rating: '4.9', price: 'من 450 ج.م / الجولة', initials: 'سم' },
  { id: 2, name: 'عمر شريف', specialty: 'جولات القاهرة القديمة', languages: 'العربية • الإنجليزية • الفرنسية', rating: '4.8', price: 'من 500 ج.م / الجولة', initials: 'عش' },
  { id: 3, name: 'ليلى حسن', specialty: 'تجارب عائلية ومحلية', languages: 'العربية • الإنجليزية', rating: '5.0', price: 'من 400 ج.م / الجولة', initials: 'لح' }
];

const copy = {
  ar: {
    explore: 'لا تزُر المكان... انتمِ إليه', guides: 'عِش المكان بعيون أهله', access: 'المكان له صوت... ونحن لغتك',
    home: 'الرئيسية', discover: 'اكتشف', localGuides: 'المرشدون المحليون', inclusive: 'الوصول الشامل',
    tagline: 'رحلتك أقرب إلى المكان وأهله', sub: 'اكتشف وجهات تناسبك، تعرّف على ثقافة المكان مع أهله، واستمتع بتجربة سفر ميسّرة للجميع.',
    search: 'ابحث عن مدينة أو مكان...', start: 'ابدأ الاستكشاف', exploreTitle: 'أماكن تستحق أن تعيشها',
    exploreSub: 'ترشيحات أولية تساعدك على اكتشاف المكان بطريقتك.', all: 'الكل', family: 'مناسب للعائلات',
    halal: 'خيارات حلال', accessible: 'مهيأ للوصول', guidesTitle: 'اكتشف المكان مع أهله',
    guidesSub: 'تعرّف على مرشدين محليين لتجربة أعمق وأكثر قربًا من ثقافة المكان.',
    viewProfile: 'عرض الملف', book: 'اطلب حجزًا', accessTitle: 'السفر حق للجميع',
    accessSub: 'نساعدك في العثور على أماكن أكثر جاهزية، ونوفر أدوات تواصل أولية لتقريب المسافات.',
    mapTitle: 'خريطة الأماكن المهيأة', mapSub: 'استكشف الأماكن التي تتوفر بها تجهيزات تسهّل الحركة والوصول.',
    communication: 'مساعد التواصل النصي والصوتي', communicationSub: 'اكتب العبارة التي تريد إيصالها، وسيحاول المتصفح قراءتها بصوت مسموع.',
    typeHere: 'اكتب ما تريد قوله...', speak: 'استمع إلى العبارة', stop: 'إيقاف الصوت',
    location: 'استخدم موقعي', locationHelp: 'السماح بالموقع يساعدنا على ترتيب النتائج حسب قربها منك.',
    featured: 'اختيارات قريبة منك', categories: 'اكتشف حسب اهتمامك', history: 'تاريخ وثقافة', familyCat: 'عائلات وأطفال',
    food: 'طعام حلال', accessibleCat: 'وصول ميسّر', rating: 'التقييم', distance: 'المسافة',
    details: 'التفاصيل', demo: 'نسخة تجريبية', footer: 'رحلتك تبدأ بفهم المكان.', requestSent: 'تم تسجيل طلبك التجريبي.',
    close: 'إغلاق', searchResults: 'نتائج الاستكشاف', noResults: 'لا توجد نتائج مطابقة. جرّب تغيير الفلاتر.',
    filter: 'تصفية', language: 'English', verifiedNote: 'بيانات تجريبية — يلزم التحقق من المعلومات قبل الإطلاق.'
  },
  en: {
    explore: 'Don’t just visit. Belong.', guides: 'See the place through local eyes', access: 'The place has a voice. We speak your language',
    home: 'Home', discover: 'Discover', localGuides: 'Local guides', inclusive: 'Accessibility',
    tagline: 'Travel closer to the place and its people', sub: 'Discover places that fit you, connect with local culture, and enjoy a more accessible travel experience.',
    search: 'Search for a city or place...', start: 'Start exploring', exploreTitle: 'Places worth experiencing',
    exploreSub: 'Starter recommendations to help you discover the destination your way.', all: 'All', family: 'Family-friendly',
    halal: 'Halal options', accessible: 'Accessible', guidesTitle: 'Discover the place with locals',
    guidesSub: 'Meet local guides for a deeper connection with the culture.',
    viewProfile: 'View profile', book: 'Request booking', accessTitle: 'Travel is for everyone',
    accessSub: 'Find more accessible places and use simple communication tools to bridge the gap.',
    mapTitle: 'Accessible places map', mapSub: 'Explore places with facilities that can make movement and access easier.',
    communication: 'Text-to-speech assistant', communicationSub: 'Type a phrase and let your browser read it aloud.',
    typeHere: 'Type what you want to say...', speak: 'Speak phrase', stop: 'Stop',
    location: 'Use my location', locationHelp: 'Location access helps sort results by distance.',
    featured: 'Places around you', categories: 'Explore by interest', history: 'History & culture', familyCat: 'Families & kids',
    food: 'Halal food', accessibleCat: 'Accessible travel', rating: 'Rating', distance: 'Distance',
    details: 'Details', demo: 'Prototype', footer: 'Your journey starts with understanding the place.', requestSent: 'Your demo request has been recorded.',
    close: 'Close', searchResults: 'Discovery results', noResults: 'No matching places. Try changing the filters.',
    filter: 'Filters', language: 'العربية', verifiedNote: 'Demo data — all information must be verified before launch.'
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
    const matchesFilter = filter === 'all' || (filter === 'family' && p.family) || (filter === 'halal' && p.halal) || (filter === 'accessible' && p.accessible);
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
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => setTab('home')} aria-label="Via Local home">
            <span className="brand-mark">V</span>
            <span className="brand-name">VIA <b>LOCAL</b><small>DISCOVER · CONNECT · EXPERIENCE</small></span>
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
              <span className="eyebrow"><Sparkles size={15}/>{t.demo} · VIA LOCAL</span>
              <h1>{t.tagline}</h1>
              <p>{t.sub}</p>
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
              {[['all',t.all],['family',t.family],['halal',t.halal],['accessible',t.accessible]].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'chip selected' : 'chip'}>{label}</button>)}
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
  return <div className="place-grid">{items.map(p => <article className="place-card" key={p.id}><div className="place-image-wrap"><img src={p.image} alt={p.name}/><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => toggleFavorite(p.id)} aria-label="Save place"><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="place-category">{p.category}</span></div><div className="place-info"><div className="place-title-row"><h3>{p.name}</h3><span className="rating"><Star size={14} fill="currentColor"/>{p.rating}</span></div><p>{p.description}</p><div className="place-meta"><span><MapPin size={14}/>{p.city}</span><span><Clock3 size={14}/>{p.distance}</span></div><div className="tag-row">{p.halal && <span><Utensils size={12}/>{t.halal}</span>}{p.family && <span><Baby size={12}/>{t.family}</span>}{p.accessible && <span><Accessibility size={12}/>{t.accessible}</span>}</div><button className="place-details" onClick={() => onSelect(p)}>{t.details}<ChevronLeft size={16}/></button></div></article>)}</div>;
}

export default App;