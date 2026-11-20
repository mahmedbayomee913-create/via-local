import { createSession, cookie, clearCookie } from '../_lib/auth.js';
export default function handler(req, res) {
  if (req.method === 'POST') {
    const expected = process.env.ADMIN_PASSWORD;
    const password = String(req.body?.password || '');
    if (!expected || expected.length < 12) return res.status(503).json({ error: 'Admin password is not configured securely.' });
    if (password !== expected) return res.status(401).json({ error: 'Incorrect password' });
    res.setHeader('Set-Cookie', cookie(createSession(), 8 * 60 * 60));
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCookie());
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', 'POST, DELETE');
  return res.status(405).end();
}
