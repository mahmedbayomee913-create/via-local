import { createSession, cookie, clearCookie, isAdmin } from '../auth.js';
const attempts = new Map();
function clientKey(req){ return String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim(); }
export default function handler(req, res) {
  if (req.method === 'GET') {
    return isAdmin(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'POST') {
    const key=clientKey(req), now=Date.now(), record=attempts.get(key);
    if(record?.blockedUntil>now){res.setHeader('Retry-After',String(Math.ceil((record.blockedUntil-now)/1000)));return res.status(429).json({error:'Too many attempts. Try again later.'});}
    const expected = process.env.ADMIN_PASSWORD;
    const password = String(req.body?.password || '');
    if (!expected || expected.length < 12) return res.status(503).json({ error: 'Admin password is not configured securely.' });
    if (password !== expected) { const next={count:(record?.count||0)+1,blockedUntil:0}; if(next.count>=8) next.blockedUntil=now+15*60*1000; attempts.set(key,next); for(const [k,v] of attempts)if(v.blockedUntil&&v.blockedUntil<now)attempts.delete(k); return res.status(401).json({ error: 'Incorrect password' }); }
    attempts.delete(key);
    res.setHeader('Set-Cookie', cookie(createSession(), 8 * 60 * 60));
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCookie());
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).end();
}
