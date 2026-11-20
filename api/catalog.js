import { db } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  try {
    const [destinations, guides, experiences] = await Promise.all([
      db('destinations?select=*&published=eq.true&order=featured.desc,name_en.asc&limit=200'),
      db('guides?select=*&published=eq.true&order=verified.desc,name_en.asc&limit=200'),
      db('experiences?select=*&published=eq.true&order=created_at.desc&limit=200')
    ]);
    return res.status(200).json({ destinations, guides, experiences });
  } catch (e) {
    console.error('catalog load error', e.message);
    return res.status(503).json({ error: 'Catalog is temporarily unavailable.' });
  }
}
