const CACHE_MS = 30 * 60 * 1000;
let cachedItems = null;
let cachedAt = 0;

const TYPES = [
  'Q570116', 'Q839954', 'Q4989906', 'Q9259',
  'Q46169', 'Q33506', 'Q151885', 'Q17350442'
];

function imageUrl(raw) {
  if (!raw) return '';
  return raw.replace('http://commons.wikimedia.org/', 'https://commons.wikimedia.org/');
}

async function fetchWorldPlaces() {
  if (cachedItems && Date.now() - cachedAt < CACHE_MS) return cachedItems;
  const query = `SELECT DISTINCT ?place ?placeLabel ?placeLabelAr ?description ?descriptionAr ?image ?coord ?countryLabel WHERE {
    VALUES ?type { ${TYPES.map(t => 'wd:' + t).join(' ')} }
    ?place wdt:P31/wdt:P279* ?type; wdt:P18 ?image; wdt:P625 ?coord.
    OPTIONAL { ?place schema:description ?description FILTER(LANG(?description) = "en") }
    OPTIONAL { ?place schema:description ?descriptionAr FILTER(LANG(?descriptionAr) = "ar") }
    OPTIONAL { ?place rdfs:label ?placeLabelAr FILTER(LANG(?placeLabelAr) = "ar") }
    OPTIONAL { ?place wdt:P17 ?country. ?country rdfs:label ?countryLabel FILTER(LANG(?countryLabel) = "en") }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  } ORDER BY ?placeLabel LIMIT 2000`;
  const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(query) + '&format=json';
  const response = await fetch(url, { headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'VIA-LOCAL/1.0 (destination discovery; contact via-local.vercel.app)' }, signal: AbortSignal.timeout(14000) });
  if (!response.ok) throw new Error('Wikidata returned ' + response.status);
  const json = await response.json();
  const seen = new Set();
  cachedItems = (json.results?.bindings || []).map(row => {
    const qid = row.place.value.split('/').pop();
    if (seen.has(qid)) return null;
    seen.add(qid);
    const coords = row.coord?.value?.match(/Point\(([-0-9.]+) ([-0-9.]+)\)/);
    const en = row.placeLabel?.value || qid;
    const ar = row.placeLabelAr?.value || en;
    const country = row.countryLabel?.value || '';
    return {
      id: 'wikidata-' + qid, slug: qid.toLowerCase(), name_ar: ar, name_en: en,
      city_ar: country, city_en: country, country_ar: country, country_en: country,
      category: 'world', description_ar: row.descriptionAr?.value || row.description?.value || '',
      description_en: row.description?.value || '', image_url: imageUrl(row.image?.value),
      tags: ['worldwide', 'Wikidata'], family_friendly: false, nature: false, accessible: false,
      latitude: coords ? Number(coords[2]) : null, longitude: coords ? Number(coords[1]) : null,
      featured: false, published: true, source_url: row.place.value
    };
  }).filter(Boolean);
  cachedAt = Date.now();
  return cachedItems;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const all = await fetchWorldPlaces();
    const offset = Math.max(0, Math.min(2000, Number.parseInt(req.query?.offset || '0', 10) || 0));
    const limit = Math.max(1, Math.min(100, Number.parseInt(req.query?.limit || '80', 10) || 80));
    const items = all.slice(offset, offset + limit);
    return res.status(200).json({ items, offset, limit, total: Math.min(all.length, 2000), hasMore: offset + items.length < Math.min(all.length, 2000), source: 'Wikidata / Wikimedia Commons' });
  } catch (error) {
    return res.status(502).json({ error: 'World destination source unavailable', detail: error?.message || 'Fetch failed' });
  }
}
