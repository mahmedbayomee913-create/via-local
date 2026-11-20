import { db } from '../db.js';
import { isValidEmail } from '../validation.js';
const clean = (v, max) => String(v ?? '').trim().slice(0, max);
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  try {
    const b = req.body || {};
    const row = {
      applicant_name: clean(b.applicant_name, 100),
      email: clean(b.email, 160).toLowerCase(),
      phone: clean(b.phone, 40),
      city: clean(b.city, 100),
      country: clean(b.country, 100) || null,
      languages: Array.isArray(b.languages) ? b.languages.slice(0, 8).map(x => clean(x, 30)) : [],
      specialties: Array.isArray(b.specialties) ? b.specialties.slice(0, 12).map(x => clean(x, 50)) : [],
      bio: clean(b.bio, 1500) || null,
      status: 'pending'
    };
    if (!row.applicant_name || !row.email || !isValidEmail(row.email) || !row.phone || !row.city) return res.status(400).json({ error: 'Enter a valid email, name, phone and city.' });
    const inserted = await db('guide_applications', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
    return res.status(201).json({ ok: true, application: inserted?.[0] });
  } catch (e) {
    console.error('guide application error', e.message);
    return res.status(503).json({ error: 'Could not submit the application right now.' });
  }
}
