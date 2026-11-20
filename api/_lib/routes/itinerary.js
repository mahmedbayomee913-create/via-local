import { db } from '../db.js';
import { getCustomer } from '../customer.js';
const clean = (v, max) => String(v ?? '').trim().slice(0, max);
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  try {
    const body = req.body || {};
    const city = clean(body.city, 100);
    const country = clean(body.country, 100);
    const days = Number(body.days || 1);
    if (!Number.isInteger(days) || days < 1 || days > 30) return res.status(400).json({ error: 'Trip duration must be a whole number between 1 and 30 days.' });
    const currency = clean(body.currency, 8) || 'USD';
    const budget = body.budget === '' || body.budget === null || body.budget === undefined ? null : Number(body.budget);
    if (budget !== null && (!Number.isFinite(budget) || budget < 0)) return res.status(400).json({ error: 'Enter a valid trip budget.' });
    const interests = Array.isArray(body.interests) ? body.interests.slice(0, 12).map(v => clean(v, 40)).filter(Boolean) : [];
    if (!city) return res.status(400).json({ error: 'Enter a city to plan your trip.' });
    const [destinations, experiences] = await Promise.all([
      db('destinations?select=id,slug,name_ar,name_en,city_ar,city_en,country_ar,country_en,category,description_ar,description_en,image_url,tags,latitude,longitude&published=eq.true&limit=200'),
      db('experiences?select=id,title_ar,title_en,description_ar,description_en,destination_id,duration_minutes,price,currency&published=eq.true&limit=200')
    ]);
    const terms = [city, country].filter(Boolean).map(x => x.toLocaleLowerCase());
    const matches = destinations.filter(d => {
      const haystack = [d.city_ar,d.city_en,d.country_ar,d.country_en,d.name_ar,d.name_en].filter(Boolean).join(' ').toLocaleLowerCase();
      return terms.some(term => haystack.includes(term) || term.includes(haystack));
    });
    const selected = matches.length ? matches : destinations.filter(d =>
      interests.some(interest => [d.category, ...(d.tags || [])].join(' ').toLocaleLowerCase().includes(interest.toLocaleLowerCase()))
    );
    if (!selected.length) return res.status(422).json({ error: 'No published destinations match this city yet. Add destinations from the admin dashboard first.' });
    const chosen = selected.slice(0, Math.max(3, Math.min(days * 3, 18)));
    const plan = Array.from({ length: days }, (_, i) => {
      const destination = chosen[i % chosen.length];
      const linked = experiences.filter(x => x.destination_id === destination.id).slice(0, 2);
      return {
        day: i + 1,
        title: `Day ${i + 1} · ${destination.name_en || destination.name_ar}`,
        destination,
        morning: { type: 'visit', title: destination.name_en || destination.name_ar, description: destination.description_en || destination.description_ar || '' },
        afternoon: linked[0] ? { type: 'experience', ...linked[0] } : { type: 'free-time', title: 'Explore the local area' },
        evening: linked[1] ? { type: 'experience', ...linked[1] } : { type: 'free-time', title: 'Local food and relaxed exploration' }
      };
    });
    const user = await getCustomer(req, res);
    const record = await db('itineraries', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({
      user_id: user?.id || null, title: `${city} trip plan`, city, country: country || null, days, budget, currency, interests, plan
    }) });
    return res.status(201).json({ ok: true, itinerary: record?.[0] || null, plan });
  } catch (e) {
    console.error('itinerary create error', e.message);
    return res.status(503).json({ error: 'Could not prepare the itinerary right now.' });
  }
}
