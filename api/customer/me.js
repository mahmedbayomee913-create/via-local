import { db } from '../_lib/db.js';
import { getCustomer } from '../_lib/customer.js';
export default async function handler(req, res) {
  const user = await getCustomer(req);
  if (!user) return res.status(401).json({ error: 'Please sign in first.' });
  try {
    if (req.method === 'GET') {
      const rows = await db(`user_profiles?select=*&id=eq.${user.id}`);
      return res.status(200).json({ user: { id: user.id, email: user.email }, profile: rows?.[0] || null });
    }
    if (req.method === 'POST' || req.method === 'PATCH') {
      const body = req.body || {};
      const profile = { id: user.id, full_name: String(body.full_name || '').trim().slice(0,100), phone: String(body.phone || '').trim().slice(0,40), preferences: body.preferences && typeof body.preferences === 'object' ? body.preferences : {} };
      const rows = await db('user_profiles?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(profile) });
      return res.status(200).json({ profile: rows?.[0] || profile });
    }
    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).end();
  } catch (e) {
    console.error('customer profile error', e.message);
    return res.status(503).json({ error: 'Could not load or save your profile.' });
  }
}
