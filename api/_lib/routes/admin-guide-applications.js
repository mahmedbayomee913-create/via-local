import { db } from '../db.js';
import { isAdmin } from '../auth.js';
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  try {
    const applications = await db('guide_applications?select=*&order=created_at.desc&limit=500');
    return res.status(200).json({ applications: applications || [] });
  } catch (e) {
    console.error('guide application list error', e.message);
    return res.status(503).json({ error: 'Could not load guide applications.' });
  }
}
