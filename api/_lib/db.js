const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_ANON_KEY;
const backendSecret = process.env.VIA_LOCAL_DB_SECRET;

export async function db(path, options = {}) {
  if (!base || !key || !backendSecret) {
    throw new Error('Database is not configured');
  }

  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'X-Via-Local-DB-Secret': backendSecret,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || 'Database request failed');
  return text ? JSON.parse(text) : null;
}
