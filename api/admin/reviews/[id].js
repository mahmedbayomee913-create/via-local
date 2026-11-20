import { db } from '../../_lib/db.js';
import { isAdmin } from '../../_lib/auth.js';
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const id = String(req.query.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'Invalid review id.' });
  if (req.method !== 'PATCH') { res.setHeader('Allow', 'PATCH'); return res.status(405).end(); }
  const approved = req.body?.approved;
  if (typeof approved !== 'boolean') return res.status(400).json({ error: 'Approval must be boolean.' });
  try {
    const rows = await db(`reviews?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ approved }) });
    return res.status(200).json({ review: rows?.[0] || null });
  } catch (e) {
    console.error('admin review update error', e.message);
    return res.status(503).json({ error: 'Could not update review.' });
  }
}
