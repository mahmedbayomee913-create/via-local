import { db } from '../db.js';

const IMAGE_CACHE_MS = 6 * 60 * 60 * 1000;
let imageCache = { at: 0, byTitle: new Map() };
const titleKey = value => String(value || '').toLowerCase().replace(/_/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();

async function resolveWikipediaImages(destinations) {
  if (imageCache.byTitle.size && Date.now() - imageCache.at < IMAGE_CACHE_MS) return imageCache.byTitle;

  const titles = [...new Set((destinations || []).map(item => item.name_en).filter(Boolean))];
  const byTitle = new Map();
  const batches = [];
  for (let index = 0; index < titles.length; index += 35) batches.push(titles.slice(index, index + 35));

  await Promise.all(batches.map(async batch => {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      redirects: '1',
      titles: batch.join('|'),
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '1200'
    });
    const response = await fetch('https://en.wikipedia.org/w/api.php?' + params, {
      headers: {
        'User-Agent': 'VIA LOCAL destination image resolver/1.0 (https://via-local.vercel.app)',
        'Api-User-Agent': 'VIA LOCAL destination image resolver/1.0'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (!response.ok) throw new Error('Wikipedia image lookup failed: ' + response.status);

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    const batchMap = new Map();
    for (const page of pages) {
      const image = page.thumbnail?.source;
      if (image && /^https:\/\/(upload|thumb)\.wikimedia\.org\//i.test(image)) batchMap.set(titleKey(page.title), image);
    }
    for (const redirect of data.query?.redirects || []) {
      const image = batchMap.get(titleKey(redirect.to));
      if (image) batchMap.set(titleKey(redirect.from), image);
    }
    for (const title of batch) {
      const image = batchMap.get(titleKey(title));
      if (image) byTitle.set(titleKey(title), image);
    }
  }));

  // Some destinations have Commons photos even when the article page has no thumbnail.
  const commonsFiles = {
    'Wadi Shab': 'File:Wadi Shab.jpg',
    'Wadi Darbat': 'File:Wadi Darbat.jpg',
    'Khasab Fort': 'File:Khasab Fort.jpg',
    'Sharqiyah Sands': 'File:Wahiba Sands.jpg',
    'Mughsail Beach': 'File:Mughsayl Beach.jpg'
  };
  const unresolved = Object.entries(commonsFiles).filter(([destination]) =>
    titles.some(title => titleKey(title) === titleKey(destination)) && !byTitle.has(titleKey(destination))
  );
  if (unresolved.length) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: unresolved.map(([, file]) => file).join('|'),
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '1200'
    });
    const response = await fetch('https://commons.wikimedia.org/w/api.php?' + params, {
      headers: {
        'User-Agent': 'VIA LOCAL destination image resolver/1.0 (https://via-local.vercel.app)',
        'Api-User-Agent': 'VIA LOCAL destination image resolver/1.0'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (!response.ok) throw new Error('Wikimedia Commons image lookup failed: ' + response.status);
    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    for (const [destination, file] of unresolved) {
      const page = pages.find(item => titleKey(item.title) === titleKey(file));
      const image = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
      if (image && /^https:\/\/(upload|thumb)\.wikimedia\.org\//i.test(image)) byTitle.set(titleKey(destination), image);
    }
  }

  imageCache = { at: Date.now(), byTitle };
  return byTitle;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const [destinations, guides, experiences, reviews, pages] = await Promise.all([
      db('destinations?select=*&published=eq.true&order=featured.desc,name_en.asc&limit=200'),
      db('guides?select=*&published=eq.true&order=verified.desc,name_en.asc&limit=200'),
      db('experiences?select=*&published=eq.true&order=created_at.desc&limit=200'),
      db('reviews?select=id,destination_id,guide_id,author_name,rating,comment,created_at&approved=eq.true&order=created_at.desc&limit=500'),
      db('content_pages?select=id,slug,title_ar,title_en,body_ar,body_en,updated_at&published=eq.true&order=updated_at.desc&limit=100')
    ]);

    let photoMap = new Map();
    try {
      photoMap = await resolveWikipediaImages(destinations || []);
    } catch (photoError) {
      console.warn('Destination image refresh skipped:', photoError?.message || photoError);
    }

    const safeDestinations = (destinations || []).map(destination => ({
      ...destination,
      image_url: photoMap.get(titleKey(destination.name_en)) || destination.image_url || ''
    }));

    const destinationRatings = {};
    const guideRatings = {};
    for (const review of reviews || []) {
      const key = review.destination_id ? 'destination' : 'guide';
      const id = review.destination_id || review.guide_id;
      const map = key === 'destination' ? destinationRatings : guideRatings;
      if (!map[id]) map[id] = { total: 0, count: 0, average: 0 };
      map[id].total += Number(review.rating);
      map[id].count += 1;
      map[id].average = Math.round((map[id].total / map[id].count) * 10) / 10;
    }

    return res.status(200).json({
      destinations: safeDestinations,
      guides,
      experiences,
      reviews,
      pages: pages || [],
      ratings: { destinations: destinationRatings, guides: guideRatings }
    });
  } catch (error) {
    console.error('catalog load error', error?.message || error);
    return res.status(503).json({ error: 'Catalog is temporarily unavailable.' });
  }
}
