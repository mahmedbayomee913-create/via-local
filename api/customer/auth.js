import { customerCookies, clearCustomerCookies } from '../_lib/customer.js';
const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
const anonKey = process.env.SUPABASE_ANON_KEY;
export default async function handler(req, res) {
  if (!base || !anonKey) return res.status(503).json({ error: 'Customer accounts are not configured.' });
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCustomerCookies());
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST, DELETE'); return res.status(405).end(); }
  try {
    const { action, email, password, full_name } = req.body || {};
    if (!['signup','login'].includes(action)) return res.status(400).json({ error: 'Unknown account action.' });
    if (!String(email || '').trim() || String(password || '').length < 8) return res.status(400).json({ error: 'Enter a valid email and a password of at least 8 characters.' });
    const endpoint = action === 'signup' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
    const response = await fetch(base + endpoint, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(action === 'signup' ? { email, password, data: { full_name: String(full_name || '').slice(0,100) } } : { email, password })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status >= 500 ? 503 : 400).json({ error: data.msg || data.message || data.error_description || 'Could not authenticate.' });
    const session = data.access_token ? data : data.session;
    if (!session?.access_token) return res.status(200).json({ ok: true, confirmationRequired: true, message: 'Check your email to confirm your account, then sign in.' });
    res.setHeader('Set-Cookie', customerCookies(session));
    return res.status(200).json({ ok: true, user: data.user || session.user });
  } catch (e) {
    console.error('customer auth error', e.message);
    return res.status(503).json({ error: 'Account service is temporarily unavailable.' });
  }
}
