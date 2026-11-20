import { db } from './_lib/db.js';
const clean = (v, max) => String(v ?? '').trim().slice(0, max);
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  try {
    const body = req.body || {};
    const author_name = clean(body.author_name, 100);
    const comment = clean(body.comment, 2000);
    const rating = Number(body.rating);
    const destination_id = clean(body.destination_id, 36) || null;
    const guide_id = clean(body.guide_id, 36) || null;
    if (!author_name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5 || (!destination_id && !guide_id)) {
      return res.status(400).json({ error: 'Please provide a name, rating, review, and destination or guide.' });
    }
    const row = { author_name, comment, rating, destination_id, guide_id, approved: false };
    const inserted = await db('reviews', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
    return res.status(201).json({ ok: true, review: inserted?.[0], message: 'Your review was received and is awaiting moderation.' });
  } catch (e) {
    console.error('review submit error', e.message);
    return res.status(503).json({ error: 'Could not submit the review right now.' });
  }
}
