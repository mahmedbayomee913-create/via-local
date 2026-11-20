import { db } from './_lib/db.js';
import { getCustomer } from './_lib/customer.js';
export default async function handler(req, res) {
  const user = await getCustomer(req);
  if (!user) return res.status(401).json({ error: 'Sign in to use your VIA LOCAL Passport.' });
  try {
    if (req.method === 'GET') {
      const [visits, destinations] = await Promise.all([
        db(`passport_visits?select=*&user_id=eq.${user.id}&order=visited_on.desc`),
        db('destinations?select=id,name_ar,name_en,image_url&published=eq.true')
      ]);
      const items = (visits || []).map(v => ({ ...v, destination: destinations.find(d => d.id === v.destination_id) || null }));
      return res.status(200).json({ visits: items, points: items.filter(v => v.status === 'verified').reduce((sum, v) => sum + Number(v.points || 0), 0) });
    }
    if (req.method === 'POST') {
      const body = req.body || {};
      const destination_id = String(body.destination_id || '');
      const visited_on = String(body.visited_on || new Date().toISOString().slice(0,10));
      if (!/^[0-9a-f-]{36}$/i.test(destination_id) || !/^\d{4}-\d{2}-\d{2}$/.test(visited_on)) return res.status(400).json({ error: 'Choose a destination and visit date.' });
      const inserted = await db('passport_visits', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ user_id: user.id, destination_id, visited_on, note: String(body.note || '').trim().slice(0,500), status: 'submitted', points: 0 }) });
      return res.status(201).json({ visit: inserted?.[0] });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  } catch (e) {
    console.error('passport error', e.message);
    return res.status(503).json({ error: 'Could not access your passport right now.' });
  }
}
