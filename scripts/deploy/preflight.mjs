// Read-only public queries and deliberately unauthorized RPC calls; no service-role credential.
/** @param {Record<string, string | undefined>} env */
export async function schemaPreflight(env = process.env, fetcher = fetch) {
  const base = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error('Supabase public configuration is required.');
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  for (const path of ['/projects?select=slug,images&limit=0', '/contact_section?select=whatsapp_number&limit=0']) {
    const result = await fetcher(base + '/rest/v1' + path, { headers, signal: AbortSignal.timeout(15000) });
    if (!result.ok) throw new Error('Required database columns are missing or unavailable. Apply the documented migrations before deployment.');
  }
  for (const [name, body] of [
    ['save_portfolio_blog_post', { p_id: null, p_post: {}, p_category_ids: [] }],
    ['reorder_portfolio_collection', { p_collection: '', p_items: [] }],
  ]) {
    const result = await fetcher(`${base}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    const value = await result.json();
    if (![401, 403].includes(result.status) || value.code !== '42501') throw new Error('Admin integrity functions are missing or their anonymous access is incorrect. Apply 202611240002_admin_integrity.sql before deployment.');
  }
}
if (process.argv[1]?.endsWith('/preflight.mjs')) { await schemaPreflight(); console.log('Database prerequisites verified without authenticated writes.'); }
