import { db } from '../db.js';
import { isAdmin } from '../auth.js';

const fields = {
  destinations: ['slug','name_ar','name_en','city_ar','city_en','country_ar','country_en','category','description_ar','description_en','image_url','gallery','tags','family_friendly','nature','halal_options','accessible','accessibility_details','latitude','longitude','featured','published'],
  guides: ['name_ar','name_en','bio_ar','bio_en','city_ar','city_en','country_ar','country_en','languages','specialties','price','currency','avatar_url','is_demo','verified','published'],
  experiences: ['slug','title_ar','title_en','description_ar','description_en','destination_id','guide_id','duration_minutes','price','currency','capacity','schedule','accessible_features','published'],
  content_pages: ['slug','title_ar','title_en','body_ar','body_en','published']
};
const cleanBody = (type, body) => Object.fromEntries(fields[type].filter(k => body[k] !== undefined).map(k => [k, body[k]]));

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const type = String(req.query.type || 'destinations');
  if (!fields[type]) return res.status(400).json({ error: 'Unknown content type.' });
  try {
    if (req.method === 'GET') {
      const rows = await db(`${type}?select=*&order=updated_at.desc&limit=500`);
      return res.status(200).json({ items: rows || [] });
    }
    if (req.method === 'POST') {
      const payload = cleanBody(type, req.body || {});
      if (!Object.keys(payload).length) return res.status(400).json({ error: 'No content fields supplied.' });
      if (type === 'guides' && payload.is_demo === true && payload.verified === true) return res.status(400).json({ error: 'Demo guide profiles cannot be verified.' });
      const inserted = await db(type, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
      return res.status(201).json({ item: inserted?.[0] || null });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  } catch (e) {
    console.error('admin content error', e.message);
    return res.status(503).json({ error: 'Could not manage content right now.' });
  }
}
