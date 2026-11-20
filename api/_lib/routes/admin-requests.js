import { db } from '../db.js';
import { isAdmin } from '../auth.js';
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error:'Unauthorized' });
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return res.status(405).end(); }
  try {
    const requests = await db('guide_requests?select=*&order=created_at.desc');
    return res.status(200).json({ requests });
  } catch (e) {
    console.error('admin list error', e.message);
    return res.status(503).json({ error:'Database is not configured or unavailable.' });
  }
}
