import { db } from '../db.js';
import { isAdmin } from '../auth.js';

const statuses = new Set(['submitted', 'verified', 'rejected']);
const uuid = /^[0-9a-f-]{36}$/i;

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const visits = await db('passport_visits?select=*&order=created_at.desc&limit=500');
      const destinationIds = [...new Set((visits || []).map(row => row.destination_id).filter(id => uuid.test(id || '')))];
      const userIds = [...new Set((visits || []).map(row => row.user_id).filter(id => uuid.test(id || '')))];
      const [destinations, profiles] = await Promise.all([
        destinationIds.length
          ? db('destinations?select=id,name_ar,name_en&id=in.(' + destinationIds.join(',') + ')')
          : Promise.resolve([]),
        userIds.length
          ? db('user_profiles?select=id,full_name&id=in.(' + userIds.join(',') + ')')
          : Promise.resolve([])
      ]);
      const destinationMap = new Map((destinations || []).map(row => [row.id, row]));
      const profileMap = new Map((profiles || []).map(row => [row.id, row]));
      return res.status(200).json({
        visits: (visits || []).map(row => ({
          ...row,
          destination: destinationMap.get(row.destination_id) || null,
          profile: profileMap.get(row.user_id) || null
        }))
      });
    } catch (error) {
      console.error('admin passport list error', error?.message || error);
      return res.status(503).json({ error: 'Could not load passport visits.' });
    }
  }

  if (req.method === 'PATCH') {
    const id = String(req.query.id || '');
    if (!uuid.test(id)) return res.status(400).json({ error: 'Invalid passport visit id.' });
    const status = String(req.body?.status || '');
    if (!statuses.has(status)) return res.status(400).json({ error: 'Invalid passport visit status.' });

    const points = req.body?.points === undefined ? (status === 'verified' ? 10 : 0) : Number(req.body.points);
    if (!Number.isInteger(points) || points < 0 || points > 100000) {
      return res.status(400).json({ error: 'Points must be a whole number between 0 and 100000.' });
    }

    try {
      const updated = await db('passport_visits?id=eq.' + id, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ status, points: status === 'verified' ? points : 0 })
      });
      if (!updated?.length) return res.status(404).json({ error: 'Passport visit not found.' });
      return res.status(200).json({ visit: updated[0] });
    } catch (error) {
      console.error('admin passport update error', error?.message || error);
      return res.status(503).json({ error: 'Could not update this passport visit.' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).end();
}
