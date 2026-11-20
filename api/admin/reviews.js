import { db } from '../_lib/db.js';
import { isAdmin } from '../_lib/auth.js';
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  try {
    const reviews = await db('reviews?select=*&order=created_at.desc&limit=500');
    return res.status(200).json({ reviews: reviews || [] });
  } catch (e) {
    console.error('admin reviews error', e.message);
    return res.status(503).json({ error: 'Could not load reviews.' });
  }
}
