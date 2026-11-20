import { db } from '../db.js';
import { isAdmin } from '../auth.js';
import { isValidISODate } from '../validation.js';

const clean = (value, max) => String(value ?? '').trim().slice(0, max);
const statuses = new Set(['pending','accepted','confirmed','cancelled','completed','rejected']);

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const bookings = await db('bookings?select=*&order=created_at.desc&limit=500');
      return res.status(200).json({ bookings: bookings || [] });
    } catch (e) {
      console.error('admin bookings error', e.message);
      return res.status(503).json({ error: 'Could not load bookings.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const customer_name = clean(body.customer_name, 100);
      const customer_phone = clean(body.customer_phone, 40);
      const customer_email = clean(body.customer_email, 160);
      const booking_date = clean(body.booking_date, 10);
      const experienceId = clean(body.experience_id, 36);
      const guests = Number(body.guests || 1);
      const status = clean(body.status, 20) || 'pending';
      if (!customer_name || !customer_phone || !isValidISODate(booking_date) || !/^[0-9a-f-]{36}$/i.test(experienceId) || !Number.isInteger(guests) || guests < 1 || guests > 30 || !statuses.has(status)) {
        return res.status(400).json({ error: 'Complete all required booking fields with valid values.' });
      }
      if (booking_date < new Date().toISOString().slice(0, 10)) return res.status(400).json({ error: 'Booking date cannot be in the past.' });
      const rows = await db(`experiences?select=id,price,currency,capacity,destination_id,guide_id,title_ar,title_en&id=eq.${experienceId}&published=eq.true`);
      const experience = rows?.[0];
      if (!experience) return res.status(404).json({ error: 'Choose an available published experience.' });
      if (guests > Number(experience.capacity || 0)) return res.status(400).json({ error: 'Guests exceed the experience capacity.' });
      const unit_price = Number(experience.price || 0);
      const payload = {
        customer_name, customer_phone, customer_email: customer_email || null,
        experience_id: experience.id, destination_id: experience.destination_id,
        guide_id: experience.guide_id, booking_date, guests, unit_price,
        total_amount: unit_price * guests, currency: experience.currency || 'USD',
        user_id: null, status, notes: clean(body.notes, 1000) || null
      };
      const inserted = await db('bookings', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
      return res.status(201).json({ ok: true, booking: inserted?.[0] || null });
    } catch (e) {
      console.error('admin booking create error', e.message);
      return res.status(503).json({ error: 'Could not create booking.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
