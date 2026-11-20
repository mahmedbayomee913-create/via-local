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

export async function getCustomer(req, res) {
  const token = readCookie(req, accessCookie);
  const refresh = readCookie(req, refreshCookie);
  if (!base || !anonKey) return null;
  const getUser = async access => {
    const response = await fetch(`${base}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${access}` } });
    if (!response.ok) return null;
    const user = await response.json();
    return user?.id ? user : null;
  };
  try {
    if (token) {
      const user = await getUser(token);
      if (user) return user;
    }
    if (!refresh) return null;
    const response = await fetch(`${base}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh })
    });
    if (!response.ok) return null;
    const session = await response.json();
    const user = session.user || await getUser(session.access_token);
    if (session.access_token && res) res.setHeader('Set-Cookie', customerCookies(session));
    return user?.id ? user : null;
  } catch { return null; }
}
