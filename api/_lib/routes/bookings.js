import { db } from '../db.js';
import { getCustomer } from '../customer.js';

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  try {
    const body = req.body || {};
    const customer_name = clean(body.customer_name, 100);
    const customer_phone = clean(body.customer_phone, 40);
    const customer_email = clean(body.customer_email, 160);
    const booking_date = clean(body.booking_date, 10);
    const guests = Number(body.guests || 1);
    const experienceId = clean(body.experience_id, 36);
    if (!/^[0-9a-f-]{36}$/i.test(experienceId)) return res.status(400).json({ error: 'Choose a valid experience.' });
    if (!customer_name || !customer_phone || !/^\d{4}-\d{2}-\d{2}$/.test(booking_date) || !experienceId || !Number.isInteger(guests) || guests < 1 || guests > 30) {
      return res.status(400).json({ error: 'Please complete the required booking details.' });
    }
    if (booking_date < new Date().toISOString().slice(0, 10)) return res.status(400).json({ error: 'The selected date is in the past.' });
    const rows = await db(`experiences?select=id,price,currency,capacity,destination_id,guide_id,title_ar,title_en&id=eq.${experienceId}&published=eq.true`);
    const experience = rows?.[0];
    if (!experience) return res.status(404).json({ error: 'This experience is not currently available.' });
    if (guests > Number(experience.capacity)) return res.status(400).json({ error: 'The number of guests exceeds this experience capacity.' });
    const user = await getCustomer(req, res);
    const unit_price = Number(experience.price || 0);
    const payload = {
      customer_name, customer_phone, customer_email: customer_email || null,
      experience_id: experience.id, destination_id: experience.destination_id,
      guide_id: experience.guide_id, booking_date, guests, unit_price,
      total_amount: unit_price * guests, currency: experience.currency || 'USD',
      user_id: user?.id || null, status: 'pending', notes: clean(body.notes, 1000) || null
    };
    const inserted = await db('bookings', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
    return res.status(201).json({ ok: true, booking: inserted?.[0] });
  } catch (e) {
    console.error('booking create error', e.message);
    return res.status(503).json({ error: 'Could not create the booking request right now.' });
  }
}
