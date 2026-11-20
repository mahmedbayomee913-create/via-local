import { createHmac, timingSafeEqual } from 'node:crypto';
const cookieName = 'via_admin_session';
const secret = process.env.ADMIN_SESSION_SECRET;
function sign(value) {
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');
  return createHmac('sha256', secret).update(value).digest('base64url');
}
export function createSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
export function isAdmin(req) {
  try {
    const cookie = req.headers.cookie || '';
    const token = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
    if (!token) return false;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;
    const expected = sign(payload);
    const a = Buffer.from(signature), b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch { return false; }
}
export function cookie(value, maxAge) {
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${maxAge}`;
}
export function clearCookie() {
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`;
}
