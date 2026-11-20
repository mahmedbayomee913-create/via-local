const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
const anonKey = process.env.SUPABASE_ANON_KEY;
const accessCookie = 'via_customer_access';
const refreshCookie = 'via_customer_refresh';

function readCookie(req, name) {
  return String(req.headers.cookie || '').split(';').map(v => v.trim())
    .find(v => v.startsWith(name + '='))?.slice(name.length + 1) || '';
}

export function customerCookies(session) {
  const common = 'Path=/; HttpOnly; Secure; SameSite=Lax';
  const access = `${accessCookie}=${session.access_token}; ${common}; Max-Age=${Math.max(60, Number(session.expires_in) || 3600)}`;
  const refresh = `${refreshCookie}=${session.refresh_token}; ${common}; Max-Age=2592000`;
  return [access, refresh];
}

export function clearCustomerCookies() {
  const common = 'Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
  return [`${accessCookie}=; ${common}`, `${refreshCookie}=; ${common}`];
}

export async function getCustomer(req) {
  const token = readCookie(req, accessCookie);
  if (!token || !base || !anonKey) return null;
  try {
    const response = await fetch(`${base}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id ? user : null;
  } catch { return null; }
}
