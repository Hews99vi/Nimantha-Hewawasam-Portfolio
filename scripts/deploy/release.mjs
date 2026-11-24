import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { revisionPattern } from './prepare.mjs';

/** @param {Record<string, string | undefined>} env */
export function deploymentConfig(env = process.env) {
  const required = ['CPANEL_HOST', 'CPANEL_PORT', 'CPANEL_USERNAME', 'CPANEL_APP_PATH', 'NEXT_PUBLIC_SITE_URL'];
  for (const name of required) if (!env[name]) throw new Error(`Missing ${name}.`);
  if (!/^[a-z0-9.-]+$/i.test(env.CPANEL_HOST) || !/^[a-z0-9_-]+$/i.test(env.CPANEL_USERNAME)) throw new Error('Invalid SSH host or account.');
  if (!/^\d+$/.test(env.CPANEL_PORT) || +env.CPANEL_PORT < 1 || +env.CPANEL_PORT > 65535) throw new Error('Invalid SSH port.');
  if (!/^\/[a-z0-9_./-]+$/i.test(env.CPANEL_APP_PATH) || env.CPANEL_APP_PATH.split('/').includes('..') || env.CPANEL_APP_PATH.split('/').filter(Boolean).length < 2) throw new Error('Use an absolute application path without shell characters or parent traversal.');
  const origin = new URL(env.NEXT_PUBLIC_SITE_URL);
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || ['localhost', '127.0.0.1'].includes(origin.hostname)) throw new Error('Production requires the complete public HTTPS origin.');
  return { host: env.CPANEL_HOST, port: env.CPANEL_PORT, user: env.CPANEL_USERNAME, root: env.CPANEL_APP_PATH.replace(/\/$/, ''), origin: origin.origin };
}
function command(name, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(name, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    // Do not print transport output containing account details or paths.
    let diagnostic = '';
    child.stderr.on('data', bytes => { diagnostic = (diagnostic + bytes).slice(-4096); });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) return resolvePromise();
      const error = new Error(`${name} failed (${code}). No release was reported successful.`);
      error.missing = /no such file|not found|does not exist/i.test(diagnostic);
      reject(error);
    });
  });
}
export function scpTransport(config, temporary) {
  const destination = `${config.user}@${config.host}:${config.root}`;
  const flags = ['-P', config.port, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=15'];
  const upload = (local, remote) => command('scp', [...flags, local, `${destination}/${remote}`]);
  return {
    async probe() {
      const marker = join(temporary, 'deployed-sha');
      await command('scp', [...flags, `${destination}/DEPLOYED_SHA`, marker]);
      if (!revisionPattern.test((await readFile(marker, 'utf8')).trim())) throw new Error('Existing deployment marker is invalid. Verify the application path in cPanel.');
    },
    async readPointer(name) {
      const local = join(temporary, `read-${name}`);
      await command('scp', [...flags, `${destination}/${name}`, local]);
      const result = JSON.parse(await readFile(local, 'utf8'));
      if (!revisionPattern.test(result.revision)) throw new Error('Invalid remote release pointer. Complete the one-time bootstrap first.');
      return result;
    },
    async writePointer(name, value) {
      if (!revisionPattern.test(value.revision)) throw new Error('Invalid revision.');
      const local = join(temporary, name);
      await writeFile(local, JSON.stringify({ revision: value.revision }));
      await upload(local, name);
    },
    async stage(bundle) {
      const existing = join(temporary, `${bundle.revision}-existing.json`);
      let exists = true;
      try { await command('scp', [...flags, `${destination}/releases/${bundle.revision}/release-ready.json`, existing]); }
      catch (error) { if (error.missing) exists = false; else throw error; }
      if (exists) {
        const manifest = JSON.parse(await readFile(existing, 'utf8'));
        if (manifest.version !== 1 || manifest.revision !== bundle.revision) throw new Error('Existing release marker is invalid. Refusing to overwrite it.');
        return; // A previously completed release is immutable, including redeploys of the same commit.
      }
      await command('scp', [...flags, '-r', bundle.directory, `${destination}/releases/`]);
      await upload(bundle.marker, `releases/${bundle.revision}/release-ready.json`);
    },
    async installLauncher(local) { await upload(local, 'server.cjs'); },
    async restart() {
      const directory = join(temporary, 'restart.txt');
      await writeFile(directory, new Date().toISOString());
      await upload(directory, 'tmp/restart.txt');
    },
  };
}

export async function verifyRelease(origin, revision, { attempts = 40, pause = ms => new Promise(r => setTimeout(r, ms)), fetcher = fetch } = {}) {
  let healthy = 0;
  const deadline = Date.now() + 120000;
  for (let attempt = 0; attempt < attempts && Date.now() < deadline; attempt++) {
    try {
      const response = await fetcher(`${origin}/api/health?release=${revision}&attempt=${attempt}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const health = await response.json();
      if (!response.ok || health.status !== 'ok' || health.revision !== revision) throw new Error('Release not ready');
      healthy++;
      if (healthy >= 3) {
        for (const pathname of ['/', '/work', '/blog', '/contact', '/admin', '/sitemap.xml']) {
          const page = await fetcher(origin + pathname, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
          const html = await page.text();
          if (!page.ok || /Temporarily unavailable\.|Content is unavailable\.|Admin content could not be loaded/.test(html)) throw new Error('Page smoke check failed');
          if (pathname === '/') {
            const asset = html.match(/<script[^>]+src="([^\"]*\/_next\/static\/[^\"]+)"/i)?.[1];
            if (!asset) throw new Error('No JavaScript asset found');
            const assetUrl = new URL(asset.replaceAll('&amp;', '&'), origin);
            if (assetUrl.origin !== origin || !(await fetcher(assetUrl, { signal: AbortSignal.timeout(15000) })).ok) throw new Error('Static asset smoke check failed');
          }
          if (pathname === '/sitemap.xml' && !html.includes(`<loc>${origin}`)) throw new Error('Production sitemap has the wrong origin');
        }
        return;
      }
    } catch { healthy = 0; }
    if (attempt + 1 < attempts) await pause(3000);
  }
  throw new Error('The expected release failed health or page checks.');
}

export async function activateRelease({ remote, bundle, verify }) {
  const previous = await remote.readPointer('last-good-release.json');
  await remote.stage(bundle); // Failed uploads never touch the active pointer.
  try {
    await remote.writePointer('current-release.json', { revision: bundle.revision });
    await remote.restart();
    await verify(bundle.revision);
    await remote.writePointer('last-good-release.json', { revision: bundle.revision });
  } catch (cause) {
    try {
      await remote.writePointer('current-release.json', previous);
      await remote.restart();
      await verify(previous.revision);
    } catch { throw new Error('Deployment failed and rollback could not be verified. Restore the last-good pointer and restart in cPanel.', { cause }); }
    throw new Error('Deployment failed. The previous release was restored and verified.', { cause });
  }
}

async function main() {
  const config = deploymentConfig();
  const revision = process.argv[3] ?? process.env.GITHUB_SHA ?? '';
  if (!revisionPattern.test(revision)) throw new Error('A full commit SHA is required.');
  const mode = process.argv[2] ?? 'deploy';
  if (!['deploy', 'stage', 'verify-bootstrap', 'probe'].includes(mode)) throw new Error('Unknown release mode.');
  const temporary = await mkdtemp(join(tmpdir(), 'portfolio-release-'));
  try {
    const remote = scpTransport(config, temporary);
    const bundle = { directory: resolve('.release', revision), marker: resolve('.release', `${revision}-ready.json`), revision };
    const verify = sha => verifyRelease(config.origin, sha);
    if (mode === 'probe') {
      await remote.probe();
      console.log('Read-only SCP access and the existing application marker verified. Confirm Node 22 and restart support in cPanel before bootstrap.');
    } else if (mode === 'stage') {
      await remote.stage(bundle);
      if (process.env.CPANEL_RELEASES_READY !== 'true') await remote.installLauncher(resolve('.release/server.cjs'));
      console.log('Complete release staged. The active pointer and running app were not changed.');
    } else if (mode === 'verify-bootstrap') {
      const current = await remote.readPointer('current-release.json');
      if (current.revision !== revision) throw new Error('Bootstrap pointer does not match this commit.');
      await verify(revision);
      await remote.writePointer('last-good-release.json', current);
      console.log('Initial release verified. You may now enable CPANEL_RELEASES_READY.');
    } else {
      if (process.env.CPANEL_RELEASES_READY !== 'true') throw new Error('Complete the documented launcher bootstrap before enabling automatic releases.');
      await activateRelease({ remote, bundle, verify });
      console.log(`Release ${revision} activated and verified.`);
    }
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
