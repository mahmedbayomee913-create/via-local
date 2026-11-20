import { db } from '../../_lib/db.js';
import { isAdmin } from '../../_lib/auth.js';
const allowed = new Set(['new','reviewing','accepted','completed','rejected']);
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error:'Unauthorized' });
  const id = String(req.query.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error:'Invalid request id' });
  try {
    if (req.method === 'PATCH') {
      const status = String(req.body?.status || '');
      if (!allowed.has(status)) return res.status(400).json({ error:'Invalid status' });
      const updated = await db(`guide_requests?id=eq.${id}`, { method:'PATCH', headers:{ Prefer:'return=representation' }, body:JSON.stringify({status,updated_at:new Date().toISOString()}) });
      return res.status(200).json({ request:updated?.[0] || null });
    }
    if (req.method === 'DELETE') {
      await db(`guide_requests?id=eq.${id}`, { method:'DELETE' });
      return res.status(200).json({ ok:true });
    }
    res.setHeader('Allow','PATCH, DELETE');
    return res.status(405).end();
  } catch (e) {
    console.error('admin update error', e.message);
    return res.status(503).json({ error:'Could not update request.' });
  }
}
