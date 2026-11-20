import { db } from '../db.js';
import { isAdmin } from '../auth.js';

const fields = {
  destinations: ['slug','name_ar','name_en','city_ar','city_en','country_ar','country_en','category','description_ar','description_en','image_url','gallery','tags','family_friendly','nature','halal_options','accessible','accessibility_details','latitude','longitude','featured','published'],
  guides: ['name_ar','name_en','bio_ar','bio_en','city_ar','city_en','country_ar','country_en','languages','specialties','price','currency','avatar_url','is_demo','verified','published'],
  experiences: ['slug','title_ar','title_en','description_ar','description_en','destination_id','guide_id','duration_minutes','price','currency','capacity','schedule','accessible_features','published'],
  content_pages: ['slug','title_ar','title_en','body_ar','body_en','published']
};

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const id = String(req.query.id || '');
  const type = String(req.query.type || 'destinations');
  if (!/^[0-9a-f-]{36}$/i.test(id) || !fields[type]) return res.status(400).json({ error: 'Invalid content item.' });
  try {
    if (req.method === 'PATCH') {
      const body = req.body || {};
      const payload = Object.fromEntries(fields[type].filter(k => body[k] !== undefined).map(k => [k, body[k]]));
      if (!Object.keys(payload).length) return res.status(400).json({ error: 'No valid changes supplied.' });
      if (type === 'guides' && payload.verified === true) {
        let isDemo = payload.is_demo;
        if (isDemo === undefined) {
          const current = await db(`guides?id=eq.${id}&select=is_demo`);
          isDemo = current?.[0]?.is_demo === true;
        }
        if (isDemo) return res.status(400).json({ error: 'Demo guide profiles cannot be verified.' });
      }
      const updated = await db(`${type}?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
      return res.status(200).json({ item: updated?.[0] || null });
    }
    if (req.method === 'DELETE') {
      await db(`${type}?id=eq.${id}`, { method: 'DELETE' });
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'PATCH, DELETE');
    return res.status(405).end();
  } catch (e) {
    console.error('admin content item error', e.message);
    return res.status(503).json({ error: 'Could not update this content item.' });
  }
}
