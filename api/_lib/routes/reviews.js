import { db } from '../db.js';
const clean = (v, max) => String(v ?? '').trim().slice(0, max);
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const destination = clean(req.query.destination_id, 36);
      const guide = clean(req.query.guide_id, 36);
      if ((!destination || !/^[0-9a-f-]{36}$/i.test(destination)) && (!guide || !/^[0-9a-f-]{36}$/i.test(guide))) {
        return res.status(400).json({ error: 'Choose a destination or guide.' });
      }
      const filter = destination ? `destination_id=eq.${destination}` : `guide_id=eq.${guide}`;
      const rows = await db(`reviews?select=id,author_name,rating,comment,created_at&approved=eq.true&${filter}&order=created_at.desc&limit=100`);
      return res.status(200).json({ reviews: rows || [] });
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).end(); }
    const body = req.body || {};
    const author_name = clean(body.author_name, 100);
    const comment = clean(body.comment, 2000);
    const rating = Number(body.rating);
    const destination_id = clean(body.destination_id, 36) || null;
    const guide_id = clean(body.guide_id, 36) || null;
    if (!author_name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5 || (!destination_id && !guide_id)) {
      return res.status(400).json({ error: 'Please provide a name, rating, review, and destination or guide.' });
    }
    if (destination_id && !/^[0-9a-f-]{36}$/i.test(destination_id)) return res.status(400).json({ error: 'Invalid destination.' });
    if (guide_id && !/^[0-9a-f-]{36}$/i.test(guide_id)) return res.status(400).json({ error: 'Invalid guide.' });
    const row = { author_name, comment, rating, destination_id, guide_id, approved: false };
    const inserted = await db('reviews', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
    return res.status(201).json({ ok: true, review: inserted?.[0], message: 'Your review was received and is awaiting moderation.' });
  } catch (e) {
    console.error('review endpoint error', e.message);
    return res.status(503).json({ error: 'Could not load or submit reviews right now.' });
  }
}
