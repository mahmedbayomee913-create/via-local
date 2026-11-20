import { db } from '../db.js';
import { isAdmin } from '../auth.js';
const allowed = new Set(['pending','accepted','confirmed','cancelled','completed','rejected']);
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const id = String(req.query.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'Invalid booking id.' });
  if (req.method !== 'PATCH') { res.setHeader('Allow', 'PATCH'); return res.status(405).end(); }
  const status = String(req.body?.status || '');
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid booking status.' });
  try {
    const rows = await db(`bookings?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status }) });
    return res.status(200).json({ booking: rows?.[0] || null });
  } catch (e) {
    console.error('admin booking update error', e.message);
    return res.status(503).json({ error: 'Could not update booking status.' });
  }
}
