import { db } from '../_lib/db.js';
import { getCustomer } from '../_lib/customer.js';
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  const user = await getCustomer(req, res);
  if (!user) return res.status(401).json({ error: 'Sign in to view your bookings.' });
  try {
    const rows = await db(`bookings?select=*&user_id=eq.${user.id}&order=created_at.desc&limit=200`);
    return res.status(200).json({ bookings: rows || [] });
  } catch (e) {
    console.error('customer bookings error', e.message);
    return res.status(503).json({ error: 'Could not load your bookings.' });
  }
}
