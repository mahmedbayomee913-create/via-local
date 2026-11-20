import { db } from '../db.js';
const fields = ['name','phone','email','destination','guide','date','guests','language','notes'];
function clean(v, max) { return String(v ?? '').trim().slice(0, max); }
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).end(); }
  try {
    const body = req.body || {};
    const data = {
      name: clean(body.name, 100), phone: clean(body.phone, 40),
      email: clean(body.email, 160), destination: clean(body.destination, 120),
      guide: clean(body.guide, 100), date: body.date || null,
      guests: Math.min(30, Math.max(1, Number(body.guests) || 1)),
      language: clean(body.language, 40), notes: clean(body.notes, 1000),
      status: 'new'
    };
    if (!data.name || !data.phone || !data.destination) return res.status(400).json({ error: 'Name, phone and destination are required.' });
    const inserted = await db('guide_requests', { method:'POST', headers:{ Prefer:'return=representation' }, body:JSON.stringify(data) });
    return res.status(201).json({ ok:true, request:inserted?.[0] });
  } catch (e) {
    console.error('guide request submit error', e.message);
    return res.status(503).json({ error:'Could not send request right now. Please try again later.' });
  }
}
