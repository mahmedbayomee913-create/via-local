const CACHE_MS = 4 * 60 * 60 * 1000;
const curatedCache = { items: null, at: 0 };

const seed = (wiki, slug, ar, en, cityAr, cityEn, countryAr, countryEn, categoryAr, categoryEn, lat, lon, nature = false, family = true) => ({
  wiki, slug, ar, en, cityAr, cityEn, countryAr, countryEn, categoryAr, categoryEn, lat, lon, nature, family
});

// Curated tourist destinations. They are published only when Wikimedia returns a real photo.
const SEEDS = [
  // Egypt
  seed('Giza pyramid complex','giza-pyramid-complex','مجمع أهرامات الجيزة','Giza Pyramid Complex','الجيزة','Giza','مصر','Egypt','أثري','Archaeological',29.9792,31.1342),
  seed('Great Sphinx of Giza','great-sphinx-giza','أبو الهول','Great Sphinx of Giza','الجيزة','Giza','مصر','Egypt','أثري','Archaeological',29.9753,31.1376),
  seed('Saqqara','saqqara','سقارة','Saqqara','البدرشين','Badrashin','مصر','Egypt','أثري','Archaeological',29.8712,31.2165),
  seed('Dahshur','dahshur','دهشور','Dahshur','الجيزة','Giza','مصر','Egypt','أثري','Archaeological',29.8082,31.2061),
  seed('Egyptian Museum','egyptian-museum-cairo','المتحف المصري بالتحرير','Egyptian Museum','القاهرة','Cairo','مصر','Egypt','متحف','Museum',30.0478,31.2336),
  seed('National Museum of Egyptian Civilization','nmec','المتحف القومي للحضارة المصرية','National Museum of Egyptian Civilization','الفسطاط','Fustat','مصر','Egypt','متحف','Museum',30.0069,31.2497),
  seed('Cairo Citadel','cairo-citadel','قلعة صلاح الدين الأيوبي','Cairo Citadel','القاهرة','Cairo','مصر','Egypt','تاريخي','Historic',30.0294,31.2613),
  seed('Al-Muizz Street','al-muizz-street','شارع المعز','Al-Muizz Street','القاهرة','Cairo','مصر','Egypt','تراثي','Heritage',30.0478,31.2621),
  seed('Khan el-Khalili','khan-el-khalili','خان الخليلي','Khan el-Khalili','القاهرة','Cairo','مصر','Egypt','تراثي','Heritage',30.0479,31.2625),
  seed('Cairo Tower','cairo-tower','برج القاهرة','Cairo Tower','الزمالك','Zamalek','مصر','Egypt','ثقافي','Cultural',30.0459,31.2243),
  seed('Luxor Temple','luxor-temple','معبد الأقصر','Luxor Temple','الأقصر','Luxor','مصر','Egypt','أثري','Archaeological',25.6995,32.6391),
  seed('Karnak','karnak-temple','مجمع معابد الكرنك','Karnak Temple Complex','الأقصر','Luxor','مصر','Egypt','أثري','Archaeological',25.7188,32.6573),
  seed('Valley of the Kings','valley-of-the-kings','وادي الملوك','Valley of the Kings','القرنة','Qurna','مصر','Egypt','أثري','Archaeological',25.7402,32.6014),
  seed('Mortuary Temple of Hatshepsut','hatshepsut-temple','معبد حتشبسوت','Mortuary Temple of Hatshepsut','الدير البحري','Deir el-Bahari','مصر','Egypt','أثري','Archaeological',25.7382,32.6065),
  seed('Medinet Habu','medinet-habu','مدينة هابو','Medinet Habu','الأقصر','Luxor','مصر','Egypt','أثري','Archaeological',25.7205,32.6018),
  seed('Colossi of Memnon','colossi-of-memnon','تمثالا ممنون','Colossi of Memnon','الأقصر','Luxor','مصر','Egypt','أثري','Archaeological',25.7202,32.6108),
  seed('Abu Simbel temples','abu-simbel','معبدا أبو سمبل','Abu Simbel Temples','أبو سمبل','Abu Simbel','مصر','Egypt','أثري','Archaeological',22.3372,31.6258),
  seed('Philae temple','philae-temple','معبد فيلة','Philae Temple','أسوان','Aswan','مصر','Egypt','أثري','Archaeological',24.0259,32.8844),
  seed('Temple of Edfu','edfu-temple','معبد إدفو','Temple of Edfu','إدفو','Edfu','مصر','Egypt','أثري','Archaeological',24.9782,32.8734),
  seed('Temple of Kom Ombo','kom-ombo-temple','معبد كوم أمبو','Temple of Kom Ombo','كوم أمبو','Kom Ombo','مصر','Egypt','أثري','Archaeological',24.4521,32.9292),
  seed('Citadel of Qaitbay','qaitbay-citadel','قلعة قايتباي','Citadel of Qaitbay','الإسكندرية','Alexandria','مصر','Egypt','تاريخي','Historic',31.2139,29.8859),
  seed('Bibliotheca Alexandrina','bibliotheca-alexandrina','مكتبة الإسكندرية','Bibliotheca Alexandrina','الإسكندرية','Alexandria','مصر','Egypt','ثقافي','Cultural',31.2089,29.9092),
  seed('Catacombs of Kom el Shoqafa','kom-el-shoqafa','مقابر كوم الشقافة','Catacombs of Kom el Shoqafa','الإسكندرية','Alexandria','مصر','Egypt','أثري','Archaeological',31.1786,29.8927),
  seed('Montaza Palace','montaza-palace','قصر المنتزه','Montaza Palace','الإسكندرية','Alexandria','مصر','Egypt','تاريخي','Historic',31.2892,30.0117),
  seed('Siwa Oasis','siwa-oasis','واحة سيوة','Siwa Oasis','سيوة','Siwa','مصر','Egypt','طبيعة','Nature',29.2032,25.5195,true),
  seed('Wadi al-Hitan','wadi-al-hitan','وادي الحيتان','Wadi al-Hitan','الفيوم','Faiyum','مصر','Egypt','طبيعة','Nature',29.326,30.185,true),
  seed('White Desert National Park','white-desert-national-park','الصحراء البيضاء','White Desert National Park','الفرافرة','Farafra','مصر','Egypt','طبيعة','Nature',27.266,28.166,true),
  seed('Ras Muhammad National Park','ras-muhammad-national-park','محمية رأس محمد','Ras Muhammad National Park','شرم الشيخ','Sharm El Sheikh','مصر','Egypt','طبيعة','Nature',27.7286,34.257,true),
  seed('Saint Catherine Monastery','saint-catherine-monastery','دير سانت كاترين','Saint Catherine Monastery','سانت كاترين','Saint Catherine','مصر','Egypt','تاريخي','Historic',28.556,33.975),
  seed('Wadi El Rayan','wadi-el-rayan','وادي الريان','Wadi El Rayan','الفيوم','Faiyum','مصر','Egypt','طبيعة','Nature',29.228,30.352,true),
  seed('El Gouna','el-gouna','الجونة','El Gouna','البحر الأحمر','Red Sea','مصر','Egypt','ساحلي','Coastal',27.394,33.678,true),
  seed('Blue Hole (Dahab)','blue-hole-dahab','الثقب الأزرق','Blue Hole, Dahab','دهب','Dahab','مصر','Egypt','طبيعة','Nature',28.572,34.536,true,false),

  // Requested archaeological destinations
  seed('Göbekli Tepe','gobekli-tepe','غوبكلي تبه','Göbekli Tepe','شانلي أورفا','Şanlıurfa','تركيا','Türkiye','أثري','Archaeological',37.223,38.922),
  seed('Derinkuyu Underground City','derinkuyu-underground-city','مدينة ديرينكويو تحت الأرض','Derinkuyu Underground City','ديرينكويو','Derinkuyu','تركيا','Türkiye','أثري','Archaeological',38.373,34.734),
  seed('Ħal-Saflieni Hypogeum','hal-saflieni-hypogeum','هايبوجيوم هال سافليني','Ħal-Saflieni Hypogeum','باولا','Paola','مالطا','Malta','أثري','Archaeological',35.871,14.506),
  seed('Skara Brae','skara-brae','سكارا بري','Skara Brae','أوركني','Orkney','اسكتلندا','Scotland','أثري','Archaeological',59.048,-3.337),
  seed('Djémila','djemila','جميلة','Djémila','جميلة','Djémila','الجزائر','Algeria','أثري','Archaeological',36.32,5.736),
  seed('Great Zimbabwe','great-zimbabwe','زيمبابوي العظمى','Great Zimbabwe','ماسينغو','Masvingo','زيمبابوي','Zimbabwe','أثري','Archaeological',-20.267,30.933),
  seed('Tiwanaku','tiwanaku','تيواناكو','Tiwanaku','تيواناكو','Tiwanaku','بوليفيا','Bolivia','أثري','Archaeological',-16.554,-68.673),
  seed('Sukhothai Historical Park','sukhothai-historical-park','سوخوثاي','Sukhothai Historical Park','سوخوثاي','Sukhothai','تايلاند','Thailand','أثري','Archaeological',17.016,99.704),

  // International highlights
  seed('Petra','petra','البتراء','Petra','وادي موسى','Wadi Musa','الأردن','Jordan','أثري','Archaeological',30.3285,35.4444),
  seed('Taj Mahal','taj-mahal','تاج محل','Taj Mahal','أغرا','Agra','الهند','India','تاريخي','Historic',27.1751,78.0421),
  seed('Great Wall of China','great-wall-china','سور الصين العظيم','Great Wall of China','بكين','Beijing','الصين','China','تاريخي','Historic',40.4319,116.5704),
  seed('Machu Picchu','machu-picchu','ماتشو بيتشو','Machu Picchu','كوسكو','Cusco','بيرو','Peru','أثري','Archaeological',-13.1631,-72.545),
  seed('Colosseum','colosseum','الكولوسيوم','Colosseum','روما','Rome','إيطاليا','Italy','تاريخي','Historic',41.8902,12.4922),
  seed('Eiffel Tower','eiffel-tower','برج إيفل','Eiffel Tower','باريس','Paris','فرنسا','France','ثقافي','Cultural',48.8584,2.2945),
  seed('Acropolis of Athens','acropolis-athens','أكروبوليس أثينا','Acropolis of Athens','أثينا','Athens','اليونان','Greece','أثري','Archaeological',37.9715,23.7257),
  seed('Angkor Wat','angkor-wat','أنغكور وات','Angkor Wat','سيام ريب','Siem Reap','كمبوديا','Cambodia','أثري','Archaeological',13.4125,103.867),
  seed('Hagia Sophia','hagia-sophia','آيا صوفيا','Hagia Sophia','إسطنبول','Istanbul','تركيا','Türkiye','تاريخي','Historic',41.0086,28.9802),
  seed('Göreme Open-Air Museum','goreme-open-air-museum','متحف غوريم المفتوح','Göreme Open-Air Museum','كابادوكيا','Cappadocia','تركيا','Türkiye','تاريخي','Historic',38.6431,34.8289),
  seed('Statue of Liberty','statue-of-liberty','تمثال الحرية','Statue of Liberty','نيويورك','New York','الولايات المتحدة','United States','ثقافي','Cultural',40.6892,-74.0445),
  seed('Chichen Itza','chichen-itza','تشيتشن إيتزا','Chichen Itza','يوكاتان','Yucatán','المكسيك','Mexico','أثري','Archaeological',20.6843,-88.5678),
  seed('Christ the Redeemer','christ-the-redeemer','تمثال المسيح الفادي','Christ the Redeemer','ريو دي جانيرو','Rio de Janeiro','البرازيل','Brazil','ثقافي','Cultural',-22.9519,-43.2105),
  seed('Iguazu Falls','iguazu-falls','شلالات إجوازو','Iguazu Falls','ميسيونس','Misiones','الأرجنتين والبرازيل','Argentina and Brazil','طبيعة','Nature',-25.6953,-54.4367,true),
  seed('Victoria Falls','victoria-falls','شلالات فيكتوريا','Victoria Falls','ليفينغستون','Livingstone','زامبيا وزيمبابوي','Zambia and Zimbabwe','طبيعة','Nature',-17.9243,25.8572,true),
  seed('Serengeti National Park','serengeti-national-park','متنزه سيرينغيتي الوطني','Serengeti National Park','مرا','Mara','تنزانيا','Tanzania','طبيعة','Nature',-2.3333,34.8333,true),
  seed('Yellowstone National Park','yellowstone-national-park','متنزه يلوستون الوطني','Yellowstone National Park','وايومنغ','Wyoming','الولايات المتحدة','United States','طبيعة','Nature',44.428,-110.5885,true),
  seed('Grand Canyon','grand-canyon','الأخدود العظيم','Grand Canyon','أريزونا','Arizona','الولايات المتحدة','United States','طبيعة','Nature',36.1069,-112.1129,true),
  seed('Banff National Park','banff-national-park','متنزه بانف الوطني','Banff National Park','ألبرتا','Alberta','كندا','Canada','طبيعة','Nature',51.4968,-115.9281,true),
  seed('Mont-Saint-Michel','mont-saint-michel','مون سان ميشيل','Mont-Saint-Michel','نورماندي','Normandy','فرنسا','France','تاريخي','Historic',48.6361,-1.5115),
  seed('Neuschwanstein Castle','neuschwanstein-castle','قلعة نويشفانشتاين','Neuschwanstein Castle','بافاريا','Bavaria','ألمانيا','Germany','تاريخي','Historic',47.5576,10.7498),
  seed('Stonehenge','stonehenge','ستونهنج','Stonehenge','ويلتشير','Wiltshire','المملكة المتحدة','United Kingdom','أثري','Archaeological',51.1789,-1.8262),
  seed('Borobudur Temple','borobudur','معبد بوروبودور','Borobudur Temple','جاوة الوسطى','Central Java','إندونيسيا','Indonesia','أثري','Archaeological',-7.6079,110.2038),
  seed('Bagan','bagan','باغان','Bagan','ماندالاي','Mandalay','ميانمار','Myanmar','تاريخي','Historic',21.168,94.865),
  seed('Fushimi Inari-taisha','fushimi-inari-taisha','ضريح فوشيمي إيناري','Fushimi Inari-taisha','كيوتو','Kyoto','اليابان','Japan','ثقافي','Cultural',34.9671,135.7727),
  seed('Burj Khalifa','burj-khalifa','برج خليفة','Burj Khalifa','دبي','Dubai','الإمارات','United Arab Emirates','ثقافي','Cultural',25.1972,55.2744),
  seed('Sheikh Zayed Grand Mosque','sheikh-zayed-grand-mosque','جامع الشيخ زايد الكبير','Sheikh Zayed Grand Mosque','أبوظبي','Abu Dhabi','الإمارات','United Arab Emirates','ثقافي','Cultural',24.4128,54.4749),
  seed('Alhambra','alhambra','قصر الحمراء','Alhambra','غرناطة','Granada','إسبانيا','Spain','تاريخي','Historic',37.1761,-3.5881),
  seed('Sagrada Família','sagrada-familia','كنيسة ساغرادا فاميليا','Sagrada Família','برشلونة','Barcelona','إسبانيا','Spain','ثقافي','Cultural',41.4036,2.1744),
  seed('Louvre Museum','louvre','متحف اللوفر','Louvre Museum','باريس','Paris','فرنسا','France','متحف','Museum',48.8606,2.3376),
  seed('Notre-Dame de Paris','notre-dame-de-paris','كاتدرائية نوتردام','Notre-Dame de Paris','باريس','Paris','فرنسا','France','تاريخي','Historic',48.853,-2.3499),
  seed('Tower Bridge','tower-bridge','جسر البرج','Tower Bridge','لندن','London','المملكة المتحدة','United Kingdom','تاريخي','Historic',51.5055,-0.0754)
];

const normalize = value => String(value || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function wikipediaFetch(titles) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    redirects: '1',
    titles: titles.join('|'),
    prop: 'pageimages|extracts',
    piprop: 'thumbnail',
    pithumbsize: '1200',
    exintro: '1',
    explaintext: '1',
    exchars: '500'
  });
  const response = await fetch('https://en.wikipedia.org/w/api.php?' + params, {
    headers: {
      'User-Agent': 'VIA LOCAL curated destination catalog/1.0 (https://via-local.vercel.app)',
      'Api-User-Agent': 'VIA LOCAL curated destination catalog/1.0'
    },
    signal: AbortSignal.timeout(8500)
  });
  if (!response.ok) throw new Error('Wikipedia API returned ' + response.status);
  return response.json();
}

async function loadCuratedCatalog() {
  if (curatedCache.items && Date.now() - curatedCache.at < CACHE_MS) return curatedCache.items;

  const batches = [];
  for (let index = 0; index < SEEDS.length; index += 30) batches.push(SEEDS.slice(index, index + 30));

  const results = await Promise.all(batches.map(async batch => {
    const data = await wikipediaFetch(batch.map(item => item.wiki));
    const pages = Object.values(data.query?.pages || {});
    const byTitle = new Map(pages.map(page => [normalize(page.title), page]));
    for (const redirect of data.query?.redirects || []) {
      const target = byTitle.get(normalize(redirect.to));
      if (target) byTitle.set(normalize(redirect.from), target);
    }

    return batch.map(item => {
      const page = byTitle.get(normalize(item.wiki));
      const image = page?.thumbnail?.source || '';
      if (!page || !image || !/^https:\/\/(upload|thumb)\.wikimedia\.org\//i.test(image)) return null;

      const descriptionEn = page.extract || `${item.en} is a notable visitor destination in ${item.cityEn}, ${item.countryEn}. Check official visitor information before travelling.`;
      const descriptionAr = `${item.ar} من أبرز الأماكن السياحية في ${item.cityAr}، ${item.countryAr}. راجع معلومات الزيارة الرسمية قبل السفر.`;

      return {
        id: 'curated-' + item.slug,
        slug: item.slug,
        name_ar: item.ar,
        name_en: item.en,
        city_ar: item.cityAr,
        city_en: item.cityEn,
        country_ar: item.countryAr,
        country_en: item.countryEn,
        category: item.categoryAr,
        category_ar: item.categoryAr,
        category_en: item.categoryEn,
        description_ar: descriptionAr,
        description_en: descriptionEn,
        image_url: image,
        image_source: 'Wikimedia Commons',
        tags: [item.categoryAr, item.categoryEn, item.countryAr, item.countryEn],
        family_friendly: item.family,
        nature: item.nature,
        halal_options: null,
        accessible: false,
        accessibility_details: {},
        latitude: item.lat,
        longitude: item.lon,
        featured: false,
        published: true,
        source_url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title.replace(/ /g, '_'))
      };
    });
  }));

  curatedCache.items = results.flat().filter(Boolean);
  curatedCache.at = Date.now();
  return curatedCache.items;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const offset = Math.max(0, Math.min(3000, Number.parseInt(req.query?.offset || '0', 10) || 0));
    const limit = Math.max(1, Math.min(80, Number.parseInt(req.query?.limit || '80', 10) || 80));
    const allItems = await loadCuratedCatalog();
    const items = allItems.slice(offset, offset + limit);
    const nextOffset = offset + items.length;

    return res.status(200).json({
      items,
      offset,
      nextOffset,
      limit,
      total: allItems.length,
      hasMore: nextOffset < allItems.length,
      source: 'Curated visitor destinations with verified Wikimedia thumbnails',
      photoPolicy: 'Only places with a direct Wikimedia thumbnail are included'
    });
  } catch (error) {
    console.error('Curated destination catalog error:', error?.message || error);
    return res.status(502).json({ error: 'World destination source unavailable', detail: error?.message || 'Fetch failed' });
  }
}
