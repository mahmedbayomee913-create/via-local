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

const guides = [];

const copy = {
ar:{explore:'لا تزُر المكان... انتمِ إليه',guides:'عِش المكان بعيون أهله',access:'السفر للجميع... بلا حواجز',home:'الرئيسية',discover:'اكتشف العالم',localGuides:'المرشدون المحليون',inclusive:'الوصول الشامل',tagline:'العالم أقرب مما تتخيّل',heroLine1:'سفر آمن وشامل...',heroLine2:'انتمِ إلى المكان',sub:'فيا لوكال يجمع استكشاف الوجهات، والتعرّف على المرشدين المحليين، ومعلومات الوصول الشامل — في تجربة واحدة.',heroLabel:'منصة سياحية ذكية · تجربة سفر للجميع',announcement:'منصة فيا لوكال — استكشف العالم بأمان، واكتشف المكان مع أهله',search:'ابحث عن دولة أو مدينة أو وجهة...',start:'ابدأ الاستكشاف',exploreTitle:'وجهات حول العالم تستحق التجربة',exploreSub:'اكتشف حكايات المواقع التاريخية والثقافات والطبيعة.',all:'كل الوجهات',family:'مناسب للعائلات',halal:'خيارات الطعام الحلال',nature:'طبيعة ومغامرات',accessible:'إمكانية الوصول',guidesTitle:'تعرّف على المرشدين المحليين',guidesSub:'تعرّف على المرشدين المحليين المعتمدين، أو قدّم طلبًا للانضمام إلى شبكة VIA LOCAL.',guidesFeatureSub:'تواصل مع مرشدين محليين بعد مراجعة ملفاتهم.',noRating:'لا يوجد تقييم',accessSub:'معلومات وصول متاحة وأدوات تواصل مساعدة.',viewProfile:'عرض الملف',book:'طلب جولة',accessTitle:'تجربة سفر أكثر شمولًا',mapTitle:'خريطة الوصول',mapSub:'اختر وجهة لعرض موقعها على الخريطة، ثم راجع معلومات الوصول المتاحة.',communication:'تحويل النص إلى صوت',communicationSub:'اكتب عبارة وسيحاول المتصفح قراءتها بصوت مسموع.',typeHere:'اكتب ما تريد قوله...',speak:'استمع إلى العبارة',stop:'إيقاف الصوت',location:'رتّب حسب موقعي',locationHelp:'اختياري: استخدم موقعك لترتيب الوجهات من الأقرب إليك. لا نحفظ إحداثيات موقعك.',locationLoading:'جارٍ تحديد موقعك…',locationEnabled:'ترتيب الأقرب مفعّل',clearLocation:'إيقاف الموقع',featured:'وجهات مختارة',categories:'اكتشف تجارب جديدة',history:'تاريخ وثقافة',familyCat:'عائلات وأطفال',food:'مطاعم ومقاهٍ',accessibleCat:'وصول ميسّر',rating:'التقييم',distance:'المنطقة',details:'التفاصيل',footer:'رحلتك تبدأ بفهم المكان.',requestSent:'سيتم إرسال طلب اهتمام بالجولة، وليس حجزًا مؤكدًا.',close:'إغلاق',searchResults:'نتائج الاستكشاف',noResults:'لا توجد نتائج مطابقة. جرّب تغيير البحث أو الفلاتر.',filter:'تصفية',favoritesFilter:'المفضلة',clearFilters:'مسح البحث والفلاتر',language:'English',verifiedNote:'تحقق من تفاصيل الزيارة من المصادر الرسمية قبل السفر. التقييمات والتوافر ليست مباشرة.',saved:'تمت إضافة المكان إلى المفضلة.',unsaved:'تمت إزالة المكان من المفضلة.',save:'أضف للمفضلة',savedLabel:'في المفضلة',homeAria:'العودة للرئيسية',menuAria:'فتح القائمة',saveAria:'حفظ المكان في المفضلة'},
en:{explore:'Don’t just visit. Belong.',guides:'Experience places through local eyes',access:'Travel without barriers',home:'Home',discover:'Explore the world',localGuides:'Local guides',inclusive:'Accessibility',tagline:'The world is closer than you imagine',heroLine1:'Travel safely and inclusively...',heroLine2:'Belong to the place',sub:'VIA LOCAL brings destination discovery, local guide introductions, and accessibility information together in one experience.',heroLabel:'Smart travel platform · Travel for everyone',announcement:'VIA LOCAL — Explore the world safely and discover places with local people',search:'Search a country, city, or destination...',start:'Start exploring',exploreTitle:'Destinations around the world worth experiencing',exploreSub:'Discover stories, historic sites, cultures, and nature.',all:'All destinations',family:'Family-friendly',halal:'Halal food options',nature:'Nature & outdoors',accessible:'Accessibility',guidesTitle:'Meet local guides',guidesSub:'Meet published local guides, or apply to join the VIA LOCAL guide network.',guidesFeatureSub:'Connect with reviewed local guides.',noRating:'No rating',accessSub:'Available accessibility information and helpful communication tools.',viewProfile:'View profile',book:'Request a tour',accessTitle:'A more inclusive travel experience',mapTitle:'Accessibility map',mapSub:'Choose a destination to view its map and review available accessibility details.',communication:'Text-to-speech',communicationSub:'Type a phrase and your browser may read it aloud.',typeHere:'Type what you want to say...',speak:'Speak phrase',stop:'Stop speech',location:'Sort by my location',locationHelp:'Optional: use your location to sort destinations from nearest to farthest. Your coordinates are not stored.',locationLoading:'Finding your location…',locationEnabled:'Nearest-first sorting is on',clearLocation:'Turn off location',featured:'Featured destinations',categories:'Discover new experiences',history:'History & culture',familyCat:'Families & kids',food:'Restaurants & cafes',accessibleCat:'Accessible travel',rating:'Rating',distance:'Area',details:'Details',footer:'Your journey starts with understanding the place.',requestSent:'This submits a tour inquiry, not a confirmed booking.',close:'Close',searchResults:'Discovery results',noResults:'No matches. Try changing your search or filters.',filter:'Filters',favoritesFilter:'Favorites',clearFilters:'Clear search and filters',language:'العربية',verifiedNote:'Check official visitor information before your trip. Ratings and availability are not live.',saved:'Added to favorites.',unsaved:'Removed from favorites.',save:'Save to favorites',savedLabel:'Saved',homeAria:'Go to home',menuAria:'Open menu',saveAria:'Save place to favorites'}
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
const categoryLabels = {
  history:{ar:'تاريخي',en:'Historic'},heritage:{ar:'تراثي',en:'Heritage'},
  culture:{ar:'ثقافي',en:'Cultural'},nature:{ar:'طبيعة',en:'Nature'},
  archaeological:{ar:'أثري',en:'Archaeological'},coast:{ar:'ساحلي',en:'Coastal'},
  museum:{ar:'متحف',en:'Museum'}
};
function localizedPlace(p,lang){
  const city = lang==='en' ? (p.city_en||p.city||'') : (p.city_ar||p.city||'');
  const country = lang==='en' ? (p.country_en||'') : (p.country_ar||'');
  const name = lang==='en' ? (p.name_en||p.name||'') : (p.name_ar||p.name||'');
  const category = (lang==='en' ? p.category_en : p.category_ar) || categoryLabels[p.category]?.[lang] || p.category || '';
  const description = lang==='en' ? (p.description_en||p.description||'') : (p.description_ar||p.description||'');
  if (p.name_en || p.city_en || p.country_en) return {...p,name,city,country,category,distance:[city,country].filter(Boolean).join(' · ')||p.distance||'',description,tags:p.tags||[]};
  return lang==='en'?{...p,...(placeEN[p.id]||{})}:p;
}
function distanceKm(place,origin){
  const lat=Number(place.latitude), lon=Number(place.longitude);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)) return null;
  const rad=n=>n*Math.PI/180;
  const dLat=rad(lat-origin.latitude), dLon=rad(lon-origin.longitude);
  const a=Math.sin(dLat/2)**2+Math.cos(rad(origin.latitude))*Math.cos(rad(lat))*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function Website() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('via-local:lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; } });
  const [tab, setTab] = useState('home');
  const [liveCatalog, setLiveCatalog] = useState({ destinations: [], guides: [], experiences: [], reviews: [], ratings: {} });
  const [worldPlaces, setWorldPlaces] = useState([]);
  const [worldOffset, setWorldOffset] = useState(0);
  const [worldLoading, setWorldLoading] = useState(false);
  const [worldHasMore, setWorldHasMore] = useState(true);
  const [worldError, setWorldError] = useState('');
  const [mapPlaceId, setMapPlaceId] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [catalogError, setCatalogError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('/api/catalog')
      .then(async response => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json(); })
      .then(data => { if (active) { setLiveCatalog(data); setCatalogError(''); } })
      .catch(() => { if (active) setCatalogError(lang==='ar'?'تعذر تحميل قاعدة بيانات الوجهات؛ نعرض الأماكن المتاحة مؤقتًا.':'The destinations database could not load; showing the available places for now.'); });
    return () => { active = false; };
  }, [lang]);
  const loadWorldPlaces = async () => {
    if (worldLoading || !worldHasMore) return;
    setWorldLoading(true); setWorldError('');
    try {
      const response = await fetch(`/api/world-destinations?offset=${worldOffset}&limit=80`);
      if (!response.ok) throw new Error('Source unavailable');
      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];
      setWorldPlaces(previous => [...previous, ...items.filter(item => !previous.some(p => p.id === item.id))]);
      setWorldOffset(Number(data.nextOffset ?? (worldOffset + 80)));
      setWorldHasMore(Boolean(data.hasMore) && Number(data.nextOffset ?? (worldOffset + 80)) < 3000);
    } catch { setWorldError(lang === 'ar' ? 'تعذّر تحميل الوجهات العالمية الآن. حاول مرة أخرى.' : 'World destinations could not load. Try again.'); }
    finally { setWorldLoading(false); }
  };
  useEffect(() => { if (tab === 'explore' && worldPlaces.length === 0 && worldHasMore) loadWorldPlaces(); }, [tab]);
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
  const databasePlaces = liveCatalog.destinations.length ? liveCatalog.destinations.map(d => ({
    id:d.id, slug:d.slug, name_ar:d.name_ar, name_en:d.name_en, city_ar:d.city_ar, city_en:d.city_en,
    country_ar:d.country_ar, country_en:d.country_en, name:d.name_ar, city:d.city_ar||d.city_en,
    category:d.category, category_ar:d.category_ar||categoryLabels[d.category]?.ar, category_en:d.category_en||categoryLabels[d.category]?.en,
    distance:[d.city_ar||d.city_en,d.country_ar||d.country_en].filter(Boolean).join(' · '),
    description_ar:d.description_ar, description_en:d.description_en,
    image:d.image_url, tags:d.tags||[], family:d.family_friendly, nature:d.nature, accessible:d.accessible,
    halal_options:d.halal_options, accessibility_details:d.accessibility_details, latitude:d.latitude, longitude:d.longitude,
    ratingAvg:liveCatalog.ratings?.destinations?.[d.id]?.average||0, reviewCount:liveCatalog.ratings?.destinations?.[d.id]?.count||0
  })) : places;
  const placeList = [...databasePlaces, ...worldPlaces.filter(w => !databasePlaces.some(d => (d.name_en||d.name) === w.name_en || d.slug === w.slug))];
  const activeMapPlace = placeList.find(p=>p.id===mapPlaceId) || placeList[0];
  const guideList = liveCatalog.guides.map(g => ({
    id:g.id, name_ar:g.name_ar, name_en:g.name_en, name:g.name_ar, specialty:(g.specialties||[]).join(' · '),
    languages:(g.languages||[]).join(' · '), location:[rtl?g.city_ar:g.city_en,rtl?g.country_ar:g.country_en].filter(Boolean).join(' · '),
    price:g.price ? String(g.price)+' '+g.currency : (rtl?'تواصل لمعرفة السعر':'Contact for price'),
    initials:(g.name_ar||'V').slice(0,2), isLive:true, isDemo:Boolean(g.is_demo), verified:g.verified
  }));

  const filteredPlaces = useMemo(() => {
    const results = placeList.filter(p => {
      const lp = localizedPlace(p,lang);
      const searchable = [p.name,p.city,p.country_ar,p.country_en,p.category,(p.tags||[]).join(' '),lp.name,lp.city,lp.country,lp.category,lp.distance,(lp.tags||[]).join(' ')].join(' ').toLowerCase();
      const matchesQuery = searchable.includes(query.trim().toLowerCase());
      const matchesFilter = filter==='all' || (filter==='family'&&p.family) || (filter==='nature'&&p.nature) || (filter==='history'&&['أثري','تاريخي','تراثي','Archaeological','Historic','Heritage','Cultural','History'].includes(lp.category)) || (filter==='accessible'&&p.accessible) || (filter==='halal'&&p.halal_options) || (filter==='favorites'&&favorites.includes(p.id));
      return matchesQuery && matchesFilter;
    });
    if(!userCoords) return results;
    return results.map(place=>({...place,nearbyKm:distanceKm(place,userCoords)}))
      .sort((a,b)=>(a.nearbyKm??Infinity)-(b.nearbyKm??Infinity));
  },[placeList,query,filter,lang,favorites,userCoords]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const requestLocation = () => setLocationDialogOpen(true);

  const confirmLocation = () => {
    setLocationDialogOpen(false);
    if (!window.isSecureContext) {
      const message = rtl ? 'ميزة الموقع تحتاج فتح الموقع عبر اتصال آمن (https). افتح https://via-local.vercel.app ثم أعد المحاولة.' : 'Location access requires a secure connection (https). Open https://via-local.vercel.app and try again.';
      setLocationText(message);
      return notify(rtl ? 'افتح الموقع من الرابط الآمن https ثم أعد المحاولة.' : 'Open the secure https site and try again.');
    }
    if (!navigator.geolocation) {
      const message = rtl ? 'المتصفح الحالي لا يدعم تحديد الموقع. جرّب فتح الموقع في Chrome.' : 'This browser does not support location. Try opening the site in Chrome.';
      setLocationText(message);
      return notify(message);
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        setUserCoords({latitude:coords.latitude,longitude:coords.longitude});
        setLocationText(rtl?'تم ترتيب الوجهات من الأقرب إلى الأبعد. إحداثياتك لا تُحفظ ولا تُرسل إلى الخادم.':'Destinations are sorted nearest-first. Your coordinates are not stored or sent to the server.');
        setLocationLoading(false);
      },
      error => {
        setLocationLoading(false);
        const message = error?.code===1
          ? (rtl
            ? 'إذن الموقع مرفوض من المتصفح. من إعدادات الموقع بجوار عنوان الصفحة افتح «الأذونات» ثم «الموقع» واختر «سماح»، وتأكد أن خدمة الموقع مفعّلة على الهاتف، ثم اضغط «رتّب حسب موقعي» مرة أخرى.'
            : 'Location is blocked by your browser. Open the site settings beside the address bar, choose Permissions > Location > Allow, make sure phone location is on, then try again.')
          : error?.code===3
            ? (rtl?'انتهت مهلة تحديد الموقع. تأكد من تشغيل خدمة الموقع وحاول مرة أخرى.':'The location request timed out. Turn on device location and try again.')
            : (rtl?'تعذر تحديد الموقع حاليًا. تأكد من تشغيل خدمة الموقع على الهاتف ثم أعد المحاولة.':'Could not determine your location. Turn on device location and try again.');
        setLocationText(message);
        notify(error?.code===1 ? (rtl?'إذن الموقع مرفوض من إعدادات المتصفح. اتبع التعليمات الظاهرة بجوار زر الموقع.':'Location is blocked in browser settings. Follow the instructions beside the location button.') : message);
      },
      {enableHighAccuracy:false,timeout:15000,maximumAge:60000}
    );
  };
  const clearLocation = () => { setUserCoords(null); setLocationText(''); notify(rtl?'تم إيقاف ترتيب الأماكن حسب موقعك.':'Nearby sorting has been turned off.'); };

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
      const response = await fetch('/api/guide-requests', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...requestForm,guide:requestGuide?.name || '',notes:requestGuide?.isDemo ? `[DEMO GUIDE REQUEST] ${rtl?'طلب تجريبي على ملف مرشد افتراضي.':'Test inquiry for a fictional demo guide.'} ${requestForm.notes}`.slice(0,1000) : requestForm.notes})});
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
              <div className="location-row">
                <button onClick={requestLocation} disabled={locationLoading}><LocateFixed size={16}/>{locationLoading?t.locationLoading:(userCoords?t.locationEnabled:t.location)}</button>
                {userCoords&&<button className="location-clear" onClick={clearLocation}>{t.clearLocation}</button>}
                <span>{locationText||t.locationHelp}</span>
              </div>
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
            <PlaceGrid items={placeList.slice(0,6)} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} notify={notify} onSelect={setSelectedPlace}/>
          </section>
        </>}

        {tab === 'explore' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.explore}</span><h1>{t.exploreTitle}</h1><p>{t.exploreSub}</p></div>
          <div className="filter-panel">
            <div className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search}/></div>
            <div className="filter-chips">
              {[['all',t.all],['family',t.family],['nature',t.nature],['history',t.history],['halal',t.halal],['accessible',t.accessible],['favorites',t.favoritesFilter]].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'chip selected' : 'chip'}>{label}</button>)}
            </div>
          </div>
          <div className="results-caption"><span><SlidersHorizontal size={16}/>{t.searchResults}</span><small>{filteredPlaces.length} {rtl ? 'أماكن' : 'places'}</small></div>
          {filteredPlaces.length ? <PlaceGrid items={filteredPlaces} t={t} lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} notify={notify} onSelect={setSelectedPlace}/> : <div className="empty-state"><Search size={30}/><p>{t.noResults}</p><button className="btn-outline" onClick={() => {setQuery('');setFilter('all');notify(rtl ? 'تم مسح البحث والفلاتر.' : 'Search and filters cleared.')}}>{t.clearFilters}</button></div>}
          {catalogError && <p className="disclaimer">{catalogError}</p>}
          {worldError && <p className="disclaimer">{worldError}</p>}
          {worldHasMore && <div className="load-more-wrap"><button className="btn-outline" disabled={worldLoading} onClick={loadWorldPlaces}>{worldLoading ? (rtl?'جارٍ تحميل الوجهات…':'Loading destinations…') : (rtl?'تحميل المزيد من وجهات العالم':'Load more destinations')}</button><small>{rtl?'استكشف المزيد من الوجهات العالمية بصورها.':'Discover more destinations around the world, with photos.'}</small></div>}
        </section>}

        {tab === 'guides' && <section className="container page-section">
          <div className="page-title"><span className="eyebrow gold-text">{t.guides}</span><h1>{t.guidesTitle}</h1><p>{t.guidesSub}</p></div>
          <div className="guide-intro"><div className="guide-intro-icon"><Headphones size={30}/></div><div><h3>{rtl ? 'تجربة محلية أقرب إليك' : 'A more local experience'}</h3><p>{rtl ? 'الـ12 ملفًا الظاهرون الآن تجريبيون بأسماء وبيانات افتراضية، وليسوا مرشدين حقيقيين. طلب الجولة هنا للتجربة فقط.' : 'The 12 profiles currently shown are fictional demo profiles, not real guides. Tour inquiries here are for testing only.'}</p></div></div>
          {guideList.length ? <div className="guide-grid">{guideList.map(g => <article className="guide-card" key={g.id}><div className="guide-top"><div className="avatar">{g.initials}</div><div className="guide-badges"><span className="rating">{g.verified ? (rtl?'مرشد موثّق':'Verified guide') : (rtl?'ملف مرشد':'Guide profile')}</span></div></div><h3>{rtl ? (g.name_ar||g.name) : (g.name_en||g.name)}</h3><p className="muted">{g.location ? `${g.location} · ` : ''}{g.specialty||''}</p><div className="guide-language"><Languages size={16}/>{g.languages||'—'}</div><div className="guide-bottom"><strong>{g.price||'—'}</strong><button className="btn-primary small" onClick={() => {setRequestGuide(g);setRequestResult('');setRequestForm({...requestForm,guide:g.name_ar||g.name,destination:''});}}>t.book</button></div></article>)}</div> : <div className="empty-state"><Users size={30}/><p>{rtl?'لا يوجد مرشدون منشورون حاليًا. يمكنك تقديم طلب للانضمام إلى شبكة المرشدين.':'No guides are currently published. You can apply to join the guide network.'}</p></div>}
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

      <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark"><MapPin size={20}/></span><div><strong>{rtl ? 'فيا لوكال' : 'VIA LOCAL'}</strong><small>{t.footer}</small></div></div><span className="footer-copy">© 2026 VIA LOCAL</span></div></footer>

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      {locationDialogOpen && <div className="modal-backdrop" onClick={() => setLocationDialogOpen(false)}>
        <section className="location-consent-modal" role="dialog" aria-modal="true" aria-labelledby="location-consent-title" onClick={e => e.stopPropagation()}>
          <div className="location-consent-icon"><LocateFixed size={27}/></div>
          <span className="eyebrow gold-text">VIA LOCAL · {rtl?'الخصوصية أولًا':'PRIVACY FIRST'}</span>
          <h2 id="location-consent-title">{rtl?'تفعيل استخدام موقعك؟':'Use your location?'}</h2>
          <p>{rtl?'سنستخدم موقعك الحالي داخل متصفحك فقط لترتيب الوجهات من الأقرب إلى الأبعد. لن نرسل الإحداثيات إلى خوادمنا ولن نحفظها في حسابك.' : 'Your current location will be used only in this browser to sort destinations from nearest to farthest. Coordinates are not sent to our servers or saved to your account.'}</p>
          <ul>
            <li>{rtl?'اختياري تمامًا، ويمكنك الاستكشاف بدونه.':'Completely optional; you can explore without it.'}</li>
            <li>{rtl?'سيطلب المتصفح إذن الوصول بعد الضغط على متابعة.':'Your browser will ask for permission after you continue.'}</li>
            <li>{rtl?'يمكنك إيقاف ترتيب الأقرب في أي وقت.':'You can turn off nearby sorting at any time.'}</li>
            <li>{rtl?'إذا رفض المتصفح الإذن، فعّله من إعدادات الموقع بجوار عنوان الصفحة ثم أعد المحاولة.':'If the browser blocks access, allow Location in this site’s settings beside the address bar, then try again.'}</li>
          </ul>
          <div className="location-consent-actions">
            <button className="btn-primary" onClick={confirmLocation}>{rtl?'متابعة وطلب الإذن':'Continue and request permission'}</button>
            <button className="btn-outline" onClick={() => setLocationDialogOpen(false)}>{rtl?'ليس الآن':'Not now'}</button>
          </div>
        </section>
      </div>}
      {requestGuide && <div className="modal-backdrop" onClick={() => setRequestGuide(null)}><div className="request-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setRequestGuide(null)} aria-label={t.close}><X/></button>{requestResult ? <div className="request-success"><CheckCircle2 size={42}/><h2>{rtl?'تم حفظ طلبك بنجاح':'Your inquiry was saved'}</h2><p>{requestGuide?.isDemo ? (rtl?'تم حفظ طلب تجريبي على ملف افتراضي. لا يوجد مرشد حقيقي أو حجز فعلي. رقم الطلب:':'A demo inquiry for a fictional profile was saved. No real guide or booking exists. Request ID:') : (rtl?'وصل طلبك إلى لوحة الإدارة. رقم الطلب:':'Your inquiry is now in the admin dashboard. Request ID:')}</p><code>{requestResult}</code><button className="btn-primary" onClick={()=>setRequestGuide(null)}>{t.close}</button></div> : <><div className="request-modal-head"><span className="eyebrow gold-text">{rtl?'طلب اهتمام بجولة':'Tour inquiry'}</span><h2>{requestGuide.isDemo ? (rtl?'جرّب إرسال طلب مع':'Try a demo inquiry with') : (rtl?'طلب جولة مع':'Request a tour with')} {rtl?(requestGuide.name_ar||requestGuide.name):(requestGuide.name_en||requestGuide.name)}</h2><p>{requestGuide.isDemo ? (rtl?'تنبيه: هذا ملف مرشد افتراضي للتجربة فقط. لن يتم حجز جولة حقيقية، وسيظهر الطلب في لوحة الإدارة كطلب تجريبي.':'Note: this is a fictional guide profile for testing only. No real tour will be booked; the request will be marked as a demo in admin.') : (rtl?'املأ بياناتك وسيصل الطلب لفريق الإدارة لمراجعته. الإرسال لا يعني تأكيد الحجز.':'Complete the form and it will be sent to the admin team. This is not a booking confirmation.')}</p></div><form className="request-form" onSubmit={submitGuideRequest}><label>{rtl?'الاسم بالكامل *':'Full name *'}<input required maxLength="100" value={requestForm.name} onChange={e=>setRequestForm({...requestForm,name:e.target.value})}/></label><label>{rtl?'رقم الهاتف *':'Phone number *'}<input required maxLength="40" type="tel" value={requestForm.phone} onChange={e=>setRequestForm({...requestForm,phone:e.target.value})}/></label><label>{rtl?'البريد الإلكتروني':'Email'}<input type="email" maxLength="160" value={requestForm.email} onChange={e=>setRequestForm({...requestForm,email:e.target.value})}/></label><label>{rtl?'الوجهة المطلوبة *':'Destination *'}<input required maxLength="120" value={requestForm.destination} onChange={e=>setRequestForm({...requestForm,destination:e.target.value})} placeholder={rtl?'المدينة أو المكان':'City or place'}/></label><label>{rtl?'التاريخ المقترح':'Preferred date'}<input type="date" min={new Date().toISOString().slice(0,10)} value={requestForm.date} onChange={e=>setRequestForm({...requestForm,date:e.target.value})}/></label><label>{rtl?'عدد الأشخاص':'Number of guests'}<select value={requestForm.guests} onChange={e=>setRequestForm({...requestForm,guests:e.target.value})}>{Array.from({length:10},(_,i)=>i+1).map(n=><option value={n} key={n}>{n}</option>)}</select></label><label>{rtl?'لغة التواصل':'Preferred language'}<select value={requestForm.language} onChange={e=>setRequestForm({...requestForm,language:e.target.value})}><option>{rtl?'العربية':'Arabic'}</option><option>{rtl?'الإنجليزية':'English'}</option><option>{rtl?'أخرى':'Other'}</option></select></label><label className="request-notes">{rtl?'تفاصيل إضافية':'Additional details'}<textarea maxLength="1000" rows="3" value={requestForm.notes} onChange={e=>setRequestForm({...requestForm,notes:e.target.value})}/></label><button className="btn-primary request-submit" disabled={requestSending}>{requestSending?(rtl?'جارٍ الإرسال...':'Sending...'):(requestGuide.isDemo ? (rtl?'إرسال طلب تجريبي':'Send demo inquiry') : (rtl?'إرسال الطلب':'Send inquiry'))}<ArrowUpLeft size={17}/></button></form></>}</div></div>}

      {selectedPlace && <div className="modal-backdrop" onClick={() => setSelectedPlace(null)}><div className="place-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedPlace(null)} aria-label={t.close}><X/></button><img src={selectedPlace.image} alt={localizedPlace(selectedPlace,lang).name} onError={e=>{const el=e.currentTarget;el.style.display='none';el.parentElement?.classList.add('image-unavailable');el.parentElement?.setAttribute('data-fallback',lang==='ar'?'الصورة غير متاحة':'Image unavailable')}}/><div className="modal-body"><span className="eyebrow gold-text">{localizedPlace(selectedPlace,lang).city} · {localizedPlace(selectedPlace,lang).category}</span><h2>{localizedPlace(selectedPlace,lang).name}</h2><p>{localizedPlace(selectedPlace,lang).description}</p><div className="modal-facts"><span>{selectedPlace.ratingAvg ? <><Star size={14} fill="currentColor"/>{selectedPlace.ratingAvg} ({selectedPlace.reviewCount||0})</> : t.noRating}</span><span><MapPin size={16}/>{localizedPlace(selectedPlace,lang).distance}</span><span><Accessibility size={16}/>{selectedPlace.accessible ? t.accessible : (rtl ? 'لم يتم تأكيد التجهيزات' : 'Not verified')}</span></div><div className="destination-map"><iframe title={rtl?'خريطة الوجهة':'Destination map'} loading="lazy" src={'https://maps.google.com/maps?q='+encodeURIComponent(localizedPlace(selectedPlace,lang).name+', '+localizedPlace(selectedPlace,lang).city)+'&output=embed'} referrerPolicy="no-referrer-when-downgrade"></iframe></div>{liveCatalog.reviews?.filter(r=>r.destination_id===selectedPlace.id).slice(0,3).map(r=><div className="destination-review" key={r.id}><strong>{r.author_name}</strong><span><Star size={12} fill="currentColor"/> {r.rating}/5</span><p>{r.comment}</p></div>)}<div className="modal-actions"><button className="btn-primary" onClick={() => {const placeId=selectedPlace.id;const wasSaved=favorites.includes(placeId);toggleFavorite(placeId);setSelectedPlace(null);notify(wasSaved?t.unsaved:t.saved)}}>{favorites.includes(selectedPlace.id) ? t.savedLabel : t.save}<Heart size={17}/></button><button className="btn-outline" onClick={() => { if (!('speechSynthesis' in window)) return notify(rtl?'ميزة الصوت غير مدعومة.':'Speech is not supported.'); window.speechSynthesis.cancel(); const utterance=new SpeechSynthesisUtterance(localizedPlace(selectedPlace,lang).description||localizedPlace(selectedPlace,lang).name); utterance.lang=rtl?'ar-EG':'en-US'; window.speechSynthesis.speak(utterance); }}>{rtl?'استمع للوصف':'Listen'}<Volume2 size={17}/></button><button className="btn-outline" onClick={() => sharePlace(selectedPlace)}>{rtl?'مشاركة':'Share'}<Globe2 size={17}/></button></div></div></div></div>}
    </div>
  );
}

function PlaceGrid({items, t, lang, favorites, toggleFavorite, notify, onSelect}) {
  return <div className="place-grid">{items.map(p => { const lp = localizedPlace(p, lang); return <article className="place-card" key={p.id}><div className="place-image-wrap"><img src={p.image} alt={lp.name} onError={e=>{const el=e.currentTarget;el.style.display='none';el.parentElement?.classList.add('image-unavailable');el.parentElement?.setAttribute('data-fallback',lang==='ar'?'الصورة غير متاحة':'Image unavailable')}}/><button className={favorites.includes(p.id) ? 'favorite saved' : 'favorite'} onClick={() => {toggleFavorite(p.id);notify(favorites.includes(p.id)?t.unsaved:t.saved)}} aria-label={favorites.includes(p.id) ? t.savedLabel : t.saveAria}><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button><span className="place-category">{lp.category}</span></div><div className="place-info"><div className="place-title-row"><h3>{lp.name}</h3><span className="rating">{p.ratingAvg ? <><Star size={13} fill="currentColor"/>{p.ratingAvg} ({p.reviewCount||0})</> : t.noRating}</span></div><p>{lp.description}</p><div className="place-meta"><span><MapPin size={14}/>{lp.city}</span><span><Clock3 size={14}/>{lp.distance}</span>{Number.isFinite(p.nearbyKm)&&<span><LocateFixed size={14}/>{p.nearbyKm<1?(lang==='ar'?'أقل من 1 كم':'Under 1 km'):`${Math.round(p.nearbyKm)} ${lang==='ar'?'كم':'km'}`}</span>}</div><div className="tag-row">{p.nature && <span><Map size={12}/>{t.nature}</span>}{p.family && <span><Baby size={12}/>{t.family}</span>}{p.accessible && <span><Accessibility size={12}/>{t.accessible}</span>}</div><button className="place-details" onClick={() => onSelect(p)}>{t.details}<ChevronLeft size={16}/></button></div></article>})}</div>;
}

export default function App(){ return window.location.pathname.replace(/\/$/,'') === '/admin' ? <Admin/> : <Website/>; }