import React, { useMemo, useState, useEffect } from 'react';
import Admin from './Admin.jsx';
import TravelHub from './TravelHub.jsx';
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
ar:{explore:'لا تزُر المكان... انتمِ إليه',guides:'عِش المكان بعيون أهله',access:'السفر للجميع... بلا حواجز',home:'الرئيسية',discover:'اكتشف العالم',localGuides:'المرشدون المحليون',inclusive:'الوصول الشامل',tagline:'العالم أقرب مما تتخيّل',heroLine1:'سفر آمن وشامل...',heroLine2:'انتمِ إلى المكان',sub:'فيا لوكال يجمع استكشاف الوجهات، والتعرّف على المرشدين المحليين، ومعلومات الوصول الشامل — في تجربة واحدة.',heroLabel:'منصة سياحية ذكية · تجربة سفر للجميع',announcement:'منصة فيا لوكال — استكشف العالم بأمان، واكتشف المكان مع أهله',search:'ابحث عن دولة أو مدينة أو وجهة...',start:'ابدأ الاستكشاف',exploreTitle:'وجهات حول العالم تستحق التجربة',exploreSub:'اكتشف حكايات المواقع التاريخية والثقافات والطبيعة.',all:'كل الوجهات',family:'مناسب للعائلات',halal:'خيارات الطعام الحلال',nature:'طبيعة ومغامرات',accessible:'إمكانية الوصول',guidesTitle:'تعرّف على المرشدين المحليين',guidesSub:'قدّم طلب اهتمام بجولة، وسيظهر في لوحة الإدارة لمتابعته. المرشدون المعروضون نماذج توضيحية وليست ملفات أشخاص حقيقيين.',guidesFeatureSub:'تعرّف على نماذج توضيحية لخدمة الإرشاد المحلي.',noRating:'لا يوجد تقييم',accessSub:'معلومات وصول توضيحية وأدوات تواصل أولية.',viewProfile:'عرض الملف',book:'طلب جولة',accessTitle:'تجربة سفر أكثر شمولًا',mapTitle:'خريطة الوصول — نموذج توضيحي',mapSub:'اختر وجهة لعرض موقعها على الخريطة، ثم راجع معلومات الوصول المتاحة.',communication:'تحويل النص إلى صوت',communicationSub:'اكتب عبارة وسيحاول المتصفح قراءتها بصوت مسموع.',typeHere:'اكتب ما تريد قوله...',speak:'استمع إلى العبارة',stop:'إيقاف الصوت',location:'استخدم موقعي',locationHelp:'الموقع اختياري ولا يُستخدم حاليًا لجلب أماكن حقيقية.',featured:'وجهات مختارة',categories:'اكتشف تجارب جديدة',history:'تاريخ وثقافة',familyCat:'عائلات وأطفال',food:'مطاعم ومقاهٍ',accessibleCat:'وصول ميسّر',rating:'التقييم',distance:'المنطقة',details:'التفاصيل',demo:'ملف توضيحي',footer:'رحلتك تبدأ بفهم المكان.',requestSent:'سيتم إرسال طلب اهتمام بالجولة، وليس حجزًا مؤكدًا.',close:'إغلاق',searchResults:'نتائج الاستكشاف',noResults:'لا توجد نتائج مطابقة. جرّب تغيير البحث أو الفلاتر.',filter:'تصفية',favoritesFilter:'المفضلة',clearFilters:'مسح البحث والفلاتر',language:'English',verifiedNote:'معلومات تعريفية أولية. تحقق من تفاصيل الزيارة من المصادر الرسمية. الصور قد تكون توضيحية، ولا توجد تقييمات أو توافر مباشر.',saved:'تمت إضافة المكان إلى المفضلة.',unsaved:'تمت إزالة المكان من المفضلة.',save:'أضف للمفضلة',savedLabel:'في المفضلة',homeAria:'العودة للرئيسية',menuAria:'فتح القائمة',saveAria:'حفظ المكان في المفضلة'},
en:{explore:'Don’t just visit. Belong.',guides:'Experience places through local eyes',access:'Travel without barriers',home:'Home',discover:'Explore the world',localGuides:'Local guides',inclusive:'Accessibility',tagline:'The world is closer than you imagine',heroLine1:'Travel safely and inclusively...',heroLine2:'Belong to the place',sub:'VIA LOCAL brings destination discovery, local guide introductions, and accessibility information together in one experience.',heroLabel:'Smart travel platform · Travel for everyone',announcement:'VIA LOCAL — Explore the world safely and discover places with local people',search:'Search a country, city, or destination...',start:'Start exploring',exploreTitle:'Destinations around the world worth experiencing',exploreSub:'Discover stories, historic sites, cultures, and nature.',all:'All destinations',family:'Family-friendly',halal:'Halal food options',nature:'Nature & outdoors',accessible:'Accessibility',guidesTitle:'Meet local guides',guidesSub:'Send a tour inquiry for the team to review. The displayed guides are sample profiles, not real providers.',guidesFeatureSub:'Preview an illustrative local-guide service.',noRating:'No rating',accessSub:'Illustrative accessibility information and basic communication tools.',viewProfile:'View profile',book:'Request a tour',accessTitle:'A more inclusive travel experience',mapTitle:'Accessibility map — demo',mapSub:'Choose a destination to view its map and review the available accessibility details.',communication:'Text-to-speech',communicationSub:'Type a phrase and your browser may read it aloud.',typeHere:'Type what you want to say...',speak:'Speak phrase',stop:'Stop speech',location:'Use my location',locationHelp:'Location is optional and is not used to fetch real places yet.',featured:'Featured destinations',categories:'Discover new experiences',history:'History & culture',familyCat:'Families & kids',food:'Restaurants & cafes',accessibleCat:'Accessible travel',rating:'Rating',distance:'Area',details:'Details',demo:'Sample profile',footer:'Your journey starts with understanding the place.',requestSent:'This submits a tour inquiry, not a confirmed booking.',close:'Close',searchResults:'Discovery results',noResults:'No matches. Try changing your search or filters.',filter:'Filters',favoritesFilter:'Favorites',clearFilters:'Clear search and filters',language:'العربية',verifiedNote:'Introductory information. Verify visitor details with official sources. Images may be illustrative; ratings and availability are not live.',saved:'Added to favorites.',unsaved:'Removed from favorites.',save:'Save to favorites',savedLabel:'Saved',homeAria:'Go to home',menuAria:'Open menu',saveAria:'Save place to favorites'}
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
function localizedPlace(p,lang){
  if (p.name_en || p.city_en) return lang==='en' ? {...p,name:p.name_en||p.name,city:p.city_en||p.city,category:p.category_en||p.category,distance:p.city_en||p.distance,description:p.description_en||p.description,tags:p.tags||[]} : {...p,name:p.name_ar||p.name,city:p.city_ar||p.city,distance:p.city_ar||p.distance,description:p.description_ar||p.description,tags:p.tags||[]};
  return lang==='en'?{...p,...(placeEN[p.id]||{})}:p;
}

function Website() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('via-local:lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } });
  const [tab, setTab] = useState('home');
  const [liveCatalog, setLiveCatalog] = useState({ destinations: [], guides: [], experiences: [], reviews: [], ratings: {} });
  const [mapPlaceId, setMapPlaceId] = useState('');
  useEffect(() => { fetch('/api/catalog').then(r => r.ok ? r.json() : null).then(d => { if (d) setLiveCatalog(d); }).catch(() => {}); }, []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem('via-local:favorites') || '[]'); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem('via-local:favorites', JSON.stringify(favorites)); } catch {} }, [favorites]);
  const [speechText, setSpeechText] = useState('');
  const [notice, setNotice] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [requestGuide, setRequestGuide] = useState(null);
  const [requestSending, setRequestSending] = useState(false);
  const [requestResult, setRequestResult] = useState('');
  const [requestForm, setRequestForm] = useState({name:'',phone:'',email:'',destination:'',date:'',guests:'1',language:'العربية',notes:''});
  useEffect(() => { try { localStorage.setItem('via-local:lang', lang); } catch {} }, [lang]);
  const t = copy[lang];
  const rtl = lang === 'ar';
  const placeList = liveCatalog.destinations.length ? liveCatalog.destinations.map(d => ({
    id:d.id, name_ar:d.name_ar, name_en:d.name_en, city_ar:d.city_ar, city_en:d.city_en,
    country_ar:d.country_ar, country_en:d.country_en, name:d.name_ar, city:d.city_ar||d.city_en,
    category:d.category, distance:d.city_ar||d.city_en, description_ar:d.description_ar, description_en:d.description_en,
    image:d.image_url, tags:d.tags||[], family:d.family_friendly, nature:d.nature, accessible:d.accessible,
    halal_options:d.halal_options, accessibility_details:d.accessibility_details, latitude:d.latitude, longitude:d.longitude,
    ratingAvg:liveCatalog.ratings?.destinations?.[d.id]?.average||0, reviewCount:liveCatalog.ratings?.destinations?.[d.id]?.count||0
  })) : places;
  const activeMapPlace = placeList.find(p=>p.id===mapPlaceId) || placeList[0];
  const guideList = liveCatalog.guides.length ? liveCatalog.guides.map(g => ({
    id:g.id, name_ar:g.name_ar, name_en:g.name_en, name:g.name_ar, specialty:(g.specialties||[]).join(' · '),
    languages:(g.languages||[]).join(' · '), price:g.price ? String(g.price)+' '+g.currency : (rtl?'تواصل لمعرفة السعر':'Contact for price'),
    initials:(g.name_ar||'V').slice(0,2), isLive:true, verified:g.verified
  })) : guides.map(g=>({...g,isLive:false}));

  const filteredPlaces = useMemo(() => placeList.filter(p => {
    const lp = localizedPlace(p, lang); const matchesQuery = `${p.name} ${p.city} ${p.category} ${p.tags.join(' ')} ${lp.name} ${lp.city} ${lp.category} ${lp.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'family' && p.family) || (filter === 'nature' && p.nature) || (filter === 'history' && ['أثري','تاريخي','تراثي','Archaeological','Historic','Heritage','Cultural'].includes(lp.category)) || (filter === 'accessible' && p.accessible) || (filter === 'favorites' && favorites.includes(p.id));
    return matchesQuery && matchesFilter;
  }), [placeList, query, filter, lang, favorites]);

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
  const navigate = (nextTab) => { setTab(nextTab); setMobileMenu(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const sharePlace = async (place) => { const lp = localizedPlace(place, lang); const shareText = `${lp.name} — ${lp.city}\n${lp.description}`; try { if (navigator.share) await navigator.share({title:lp.name,text:shareText}); else {await navigator.clipboard.writeText(shareText);notify(rtl?'تم نسخ تفاصيل الوجهة.':'Destination details copied.');} } catch (err) { if (err?.name !== 'AbortError') notify(rtl?'تعذر مشاركة الوجهة.':'Could not share destination.'); } };

  const submitGuideRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.name.trim() || !requestForm.phone.trim() || !requestForm.destination.trim()) return;
    setRequestSending(true);
    try {
      const response = await fetch('/api/guide-requests', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...requestForm,guide:requestGuide?.name || ''})});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t.requestSent);
      setRequestResult(data.request?.id || 'sent');
      setRequestForm({name:'',phone:'',email:'',destination:'',date:'',guests:'1',language:rtl?'العربية':'English',notes:''});
    } catch (error) {
      notify(rtl?'تعذر إرسال الطلب حاليًا. حاول مرة أخرى لاحقًا.':'Could not send your request right now. Please try again later.');
    } finally { setRequestSending(false); }
  };

  const navItems = [
    ['home', t.home, Compass], ['explore', t.discover, MapPin],
    ['guides', t.localGuides, Users], ['access', t.inclusive, Accessibility],
    ['travel', rtl ? 'خدمات الرحلة' : 'Trip services', CalendarDays]
  ];

  return (
    <div className={rtl ? 'app' : 'app ltr'} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="announcement-bar"><Sparkles size={13}/><span>{t.announcement}</span><Sparkles size={13}/></div>
      <header className="header">
        <div className="container header-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label={t.homeAria}>
            <span className="brand-mark"><MapPin size={25} strokeWidth={2.5}/></span>
            <span className="brand-name">{rtl ? 'فيا لوكال' : 'VIA LOCAL'}<small>{rtl ? 'VIA LOCAL' : 'LOCAL EXPERIENCES'}</small></span>
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
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/>
                <button onClick={() => navigate('explore')}>{t.start}<ArrowUpLeft size={17}/></button>
              </div>
              <div className="location-row"><button onClick={requestLocation}><LocateFixed size={16}/>{t.location}</button><span>{locationText || t.locationHelp}</span></div>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.categories}</span><h2>{t.categories}</h2></div><button className="text-link" onClick={() => navigate('explore')}>{t.discover}<ChevronLeft size={17}/></button></div>
            <div className="feature-grid">
              <button className="feature-card feature-burgundy" onClick={() => navigate('explore')}><span className="feature-icon"><Compass/></span><strong>{t.explore}</strong><small>{t.exploreSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-gold" onClick={() => navigate('guides')}><span className="feature-icon"><Users/></span><strong>{t.guides}</strong><small>{t.guidesFeatureSub}</small><ArrowUpLeft className="feature-arrow"/></button>
              <button className="feature-card feature-light" onClick={() => navigate('access')}><span className="feature-icon"><Accessibility/></span><strong>{t.access}</strong><small>{t.accessSub}</small><ArrowUpLeft className="feature-arrow"/></button>
            </div>
          </section>
          <section className="container section">
            <div className="section-heading"><div><span className="eyebrow gold-text">{t.featured}</span><h2>{t.exploreTitle}</h2></div><button className="text-link" onClick={() => navigate('explore')}>{t.details}<ChevronLeft size={17}/></button></div>
            <PlaceGrid items={placeList.slice(0,3)} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} notify={notify} onSelect={setSelectedPlace}/>
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
          <div className="guide-intro"><div className="guide-intro-icon"><Headphones size={30}/></div><div><h3>{rtl ? 'تجربة محلية أقرب إليك' : 'A more local experience'}</h3><p>{rtl ? 'اختر نموذج المرشد واملأ طلب اهتمام بالجولة، وسيصل إلى فريق الإدارة.' : 'Choose a sample guide and send an inquiry for the admin team to review.'}</p></div></div>
          <div className="guide-grid">{guideList.map(g => <article className="guide-card" key={g.id}><div className="guide-top"><div className="avatar">{g.initials}</div><span className="rating">{g.isLive ? (g.verified ? (rtl?'مرشد موثّق':'Verified guide') : (rtl?'ملف مرشد':'Guide profile')) : t.demo}</span></div><h3>{rtl ? (g.name_ar||g.name) : (g.name_en||g.name)}</h3><p className="muted">{g.specialty||''}</p><div className="guide-language"><Languages size={16}/>{g.languages||'—'}</div><div className="guide-bottom"><strong>{g.price||'—'}</strong><button className="btn-primary small" onClick={() => {setRequestGuide(g);setRequestResult('');setRequestForm({...requestForm,guide:g.name_ar||g.name,destination:''});}}>{t.book}</button></div></article>)}</div>
          <p className="disclaimer"><ShieldCheck size={16}/>{t.verifiedNote}</p>
        </section>}

        {tab === 'access' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.access}</span><h1>{t.accessTitle}</h1><p>{t.accessSub}</p></div>
          <div className="access-grid">
            <article className="access-card map-card"><div className="access-icon"><Map size={25}/></div><h2>{t.mapTitle}</h2><p>{t.mapSub}</p><div className="access-map-live"><select aria-label={rtl?'اختر وجهة':'Select destination'} value={activeMapPlace?.id||''} onChange={e=>setMapPlaceId(e.target.value)}>{placeList.map(p=><option value={p.id} key={p.id}>{localizedPlace(p,lang).name} · {localizedPlace(p,lang).city}</option>)}</select>{activeMapPlace&&<iframe title={rtl?'خريطة الوجهة':'Destination map'} loading="lazy" src={'https://maps.google.com/maps?q='+encodeURIComponent(localizedPlace(activeMapPlace,lang).name+', '+localizedPlace(activeMapPlace,lang).city)+'&output=embed'} referrerPolicy="no-referrer-when-downgrade"/>}</div><div className="access-data-list"><strong>{rtl?'بيانات الوصول المتاحة':'Available accessibility details'}</strong>{activeMapPlace?.accessibility_details&&Object.keys(activeMapPlace.accessibility_details).length?Object.entries(activeMapPlace.accessibility_details).map(([k,v])=><span key={k}>{k}: {String(v)}</span>):<small>{rtl?'لم تُضف بيانات وصول موثقة لهذه الوجهة بعد. لا يعني ذلك أنها غير مهيأة.':'No verified accessibility details have been added for this destination yet. This does not mean it is inaccessible.'}</small>}</div><small className="muted">{t.verifiedNote}</small></article>
            <article className="access-card speech-card"><div className="access-icon"><MessageCircle size={25}/></div><h2>{t.communication}</h2><p>{t.communicationSub}</p><textarea value={speechText} onChange={e => setSpeechText(e.target.value)} placeholder={t.typeHere} rows="4"/><div className="speech-actions"><button className="btn-primary" onClick={speak}><Volume2 size={17}/>{t.speak}</button><button className="btn-outline" onClick={() => {window.speechSynthesis?.cancel();notify(rtl?'تم إيقاف الصوت.':'Speech stopped.')}}>{t.stop}</button></div><div className="speech-note"><CheckCircle2 size={16}/>{rtl ? 'تعتمد الميزة على دعم المتصفح للأصوات المتاحة.' : 'This feature depends on browser speech voice support.'}</div></article>
          </div>
          <div className="access-note"><Accessibility size={22}/><div><strong>{rtl ? 'التصميم الشامل يتجاوز ميزة واحدة' : 'Accessibility is more than one feature'}</strong><p>{rtl ? 'النسخة القادمة ستضيف معلومات موثقة عن المنحدرات والمصاعد ودورات المياه المهيأة، ودعم تحويل الكلام إلى نص وأدوات تواصل إضافية.' : 'The next version can add verified ramp, elevator and restroom details, speech-to-text and more communication tools.'}</p></div></div>
        </section>}

        {tab === 'travel' && <TravelHub lang={lang}/>}
      </main>

      <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark"><MapPin size={20}/></span><div><strong>{rtl ? 'فيا لوكال' : 'VIA LOCAL'}</strong><small>{t.footer}</small></div></div><span className="footer-copy">© 2026 VIA LOCAL · {t.demo}</span></div></footer>

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      {requestGuide && <div className="modal-backdrop" onClick={() => setRequestGuide(null)}><div className="request-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setRequestGuide(null)} aria-label={t.close}><X/></button>{requestResult ? <div className="request-success"><CheckCircle2 size={42}/><h2>{rtl?'تم إرسال طلبك بنجاح':'Your inquiry was sent'}</h2><p>{rtl?'وصل طلبك إلى لوحة الإدارة. رقم الطلب:':'Your inquiry is now in the admin dashboard. Request ID:'}</p><code>{requestResult}</code><button className="btn-primary" onClick={()=>setRequestGuide(null)}>{t.close}</button></div> : <><div className="request-modal-head"><span className="eyebrow gold-text">{rtl?'طلب اهتمام بجولة':'Tour inquiry'}</span><h2>{rtl?'طلب جولة مع':'Request a tour with'} {rtl?(requestGuide.name_ar||requestGuide.name):(requestGuide.name_en||requestGuide.name)}</h2><p>{rtl?'املأ بياناتك وسيصل الطلب لفريق الإدارة لمراجعته. الإرسال لا يعني تأكيد الحجز.':'Complete the form and it will be sent to the admin team. This is not a booking confirmation.'}</p></div><form className="request-form" onSubmit={submitGuideRequest}><label>{rtl?'الاسم بالكامل *':'Full name *'}<input required maxLength="100" value={requestForm.name} onChange={e=>setRequestForm({...requestForm,name:e.target.value})}/></label><label>{rtl?'رقم الهاتف *':'Phone number *'}<input required maxLength="40" type="tel" value={requestForm.phone} onChange={e=>setRequestForm({...requestForm,phone:e.target.value})}/></label><label>{rtl?'البريد الإلكتروني':'Email'}<input type="email" maxLength="160" value={requestForm.email} onChange={e=>setRequestForm({...requestForm,email:e.target.value})}/></label><label>{rtl?'الوجهة المطلوبة *':'Destination *'}<input required maxLength="120" value={requestForm.destination} onChange={e=>setRequestForm({...requestForm,destination:e.target.value})} placeholder={rtl?'المدينة أو المكان':'City or place'}/></label><label>{rtl?'التاريخ المقترح':'Preferred date'}<input type="date" min={new Date().toISOString().slice(0,10)} value={requestForm.date} onChange={e=>setRequestForm({...requestForm,date:e.target.value})}/></label><label>{rtl?'عدد الأشخاص':'Number of guests'}<select value={requestForm.guests} onChange={e=>setRequestForm({...requestForm,guests:e.target.value})}>{Array.from({length:10},(_,i)=>i+1).map(n=><option value={n} key={n}>{n}</option>)}</select></label><label>{rtl?'لغة التواصل':'Preferred language'}<select value={requestForm.language} onChange={e=>setRequestForm({...requestForm,language:e.target.value})}><option>{rtl?'العربية':'Arabic'}</option><option>{rtl?'الإنجليزية':'English'}</option><option>{rtl?'أخرى':'Other'}</option></select></label><label className="request-notes">{rtl?'تفاصيل إضافية':'Additional details'}<textarea maxLength="1000" rows="3" value={requestForm.notes} onChange={e=>setRequestForm({...requestForm,notes:e.target.value})}/></label><button className="btn-primary request-submit" disabled={requestSending}>{requestSending?(rtl?'جارٍ الإرسال...':'Sending...'):(rtl?'إرسال الطلب':'Send inquiry')}<ArrowUpLeft size={17}/></button></form></>}</div></div>}

      {selectedPlace && <div className="modal-backdrop" onClick={() => setSelectedPlace(null)}><div className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedPlace(null)} aria-label={t.close}><X/></button><img src={selectedPlace.image} alt={localizedPlace(selectedPlace,lang).name}/><div className="modal-body"><span className="eyebrow gold-text">{localizedPlace(selectedPlace,lang).city} · {localizedPlace(selectedPlace,lang).category}</span><h2>{localizedPlace(selectedPlace,lang).name}</h2><p>{localizedPlace(selectedPlace,lang).description}</p><div className="modal-facts"><span>{selectedPlace.ratingAvg ? <><Star size={14} fill="currentColor"/>{selectedPlace.ratingAvg} ({selectedPlace.reviewCount||0})</> : t.noRating}</span><span><MapPin size={16}/>{localizedPlace(selectedPlace,lang).distance}</span><span><Accessibility size={16}/>{selectedPlace.accessible ? t.accessible : (rtl ? 'لم يتم تأكيد التجهيزات' : 'Not verified')}</span></div><div className="destination-map"><iframe title={rtl?'خريطة الوجهة':'Destination map'} loading="lazy" src={'https://maps.google.com/maps?q='+encodeURIComponent(localizedPlace(selectedPlace,lang).name+', '+localizedPlace(selectedPlace,lang).city)+'&output=embed'} referrerPolicy="no-referrer-when-downgrade"></iframe></div><div className="modal-actions"><button className="btn-primary" onClick={() => {const placeId=selectedPlace.id;const wasSaved=favorites.includes(placeId);toggleFavorite(placeId);setSelectedPlace(null);notify(wasSaved?t.unsaved:t.saved)}}>{favorites.includes(selectedPlace.id) ? t.savedLabel : t.save}<Heart size={17}/></button><button className="btn-outline" onClick={() => sharePlace(selectedPlace)}>{rtl?'مشاركة':'Share'}<Globe2 size={17}/></button></div></div></div></div>}
    </div>
  );
}

function PlaceGrid({items, t, lang, favorites, toggleFavorite, notify, onSelect}) {
  return <div className="place-grid">{items.map(p => { const lp = localizedPlace(p, lang); return <article className="place-card" key={p.id}><div className="place-image-wrap"><img src={p.image} alt={lp.name}/><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => {toggleFavorite(p.id);notify(favorites.includes(p.id)?t.unsaved:t.saved)}} aria-label={favorites.includes(p.id) ? t.savedLabel : t.saveAria}><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="place-category">{lp.category}</span></div><div className="place-info"><div className="place-title-row"><h3>{lp.name}</h3><span className="rating">{p.ratingAvg ? <><Star size={13} fill="currentColor"/>{p.ratingAvg} ({p.reviewCount||0})</> : t.noRating}</span></div><p>{lp.description}</p><div className="place-meta"><span><MapPin size={14}/>{lp.city}</span><span><Clock3 size={14}/>{lp.distance}</span></div><div className="tag-row">{p.nature && <span><Map size={12}/>{t.nature}</span>}{p.family && <span><Baby size={12}/>{t.family}</span>}{p.accessible && <span><Accessibility size={12}/>{t.accessible}</span>}</div><button className="place-details" onClick={() => onSelect(p)}>{t.details}<ChevronLeft size={16}/></button></div></article>})}</div>;
}

export default function App(){ return window.location.pathname.replace(/\/$/,'') === '/admin' ? <Admin/> : <Website/>; }