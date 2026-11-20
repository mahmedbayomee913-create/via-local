import { db } from '../../_lib/db.js';
import { isAdmin } from '../../_lib/auth.js';
const allowed = new Set(['pending','reviewing','approved','rejected']);
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const id = String(req.query.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'Invalid application id.' });
  if (req.method !== 'PATCH') { res.setHeader('Allow', 'PATCH'); return res.status(405).end(); }
  const status = String(req.body?.status || '');
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid application status.' });
  try {
    const rows = await db(`guide_applications?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status }) });
    if (status === 'approved' && rows?.[0]) {
      const a = rows[0];
      await db('guides', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({
        name_ar: a.applicant_name, name_en: a.applicant_name, bio_ar: a.bio, bio_en: a.bio,
        city_ar: a.city, city_en: a.city, country_ar: a.country, country_en: a.country,
        languages: a.languages || [], specialties: a.specialties || [], verified: true, published: false, price: 0, currency: 'USD'
      })});
    }
    return res.status(200).json({ application: rows?.[0] || null });
  } catch (e) {
    console.error('guide application update error', e.message);
    return res.status(503).json({ error: 'Could not update the application.' });
  }
}
