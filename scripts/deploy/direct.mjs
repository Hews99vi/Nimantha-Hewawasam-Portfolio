import { rename, writeFile, rm, mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { prepareRelease, revisionPattern } from './prepare.mjs';
import { deploymentConfig, verifyRelease } from './release.mjs';

/** @param {string} root @param {string} revision @param {Record<string, string | undefined>} env */
export async function prepareDirect(root, revision, env = process.env) {
  const values = {};
  for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SITE_URL']) {
    if (!env[name]) throw new Error(`Missing ${name}.`);
    values[name] = env[name];
  }
  const bundle = await prepareRelease(root, revision);
  await rename(join(bundle.directory, 'server.js'), join(bundle.directory, 'portfolio-server.cjs'));
  // These are public build settings, never a service-role key. Synchronize runtime
  // with this build without modifying the owner's .env or cPanel environment.
  await writeFile(join(bundle.directory, 'server.js'), `// Generated portfolio startup file.\nif (Number(process.versions.node.split('.')[0]) !== 22) throw new Error('Select Node.js 22 in cPanel before restarting this application.');\nObject.assign(process.env, ${JSON.stringify({ ...values, PORTFOLIO_REVISION: revision })});\nrequire('./portfolio-server.cjs');\n`);
  // Completion markers/launcher belong to the optional versioned release system.
  await rm(bundle.marker, { force: true });
  await rm(join(root, '.release/server.cjs'), { force: true });
  return bundle;
}
function run(name, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(name, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let diagnostic = '';
    child.stderr.on('data', data => { diagnostic = (diagnostic + data).slice(-4096); });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) return resolvePromise();
      const reason = /permission denied/i.test(diagnostic) ? 'SSH authentication or destination permissions were denied.'
        : /host key verification failed/i.test(diagnostic) ? 'SSH host verification failed.'
        : /no such file/i.test(diagnostic) ? 'The configured application folder does not exist.'
        : /timed out|timeout/i.test(diagnostic) ? 'The hosting connection timed out.' : 'The hosting transfer failed.';
      reject(new Error(`${reason} ${name} exited ${code}.`));
    });
  });
}
/**
 * @param {{host: string, port: string, user: string, root: string, origin: string}} config
 * @param {string} directory
 * @param {string} revision
 * @param {{temporary: string, execute?: (name: string, args: string[]) => Promise<unknown>, verify?: (revision: string) => Promise<unknown>}} options
 */
export async function uploadDirect(config, directory, revision, { execute = run, temporary, verify = sha => verifyRelease(config.origin, sha) }) {
  if (!revisionPattern.test(revision)) throw new Error('A full commit SHA is required.');
  const destination = `${config.user}@${config.host}:${config.root}/`;
  const flags = ['-P', config.port, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=30'];
  // Keep the prior startup entry while transferring the complete application.
  const startup = join(temporary, 'server.js');
  await rename(join(directory, 'server.js'), startup);
  try {
    await execute('scp', [...flags, '-r', `${directory}/.`, destination]);
    await execute('scp', [...flags, startup, destination]);
    const restart = join(temporary, 'tmp');
    await mkdir(restart, { recursive: true });
    await writeFile(join(restart, 'restart.txt'), new Date().toISOString());
    await execute('scp', [...flags, '-r', restart, destination]);
    await verify(revision);
  } finally { await rename(startup, join(directory, 'server.js')); }
}
async function main() {
  const revision = process.argv[3] ?? process.env.GITHUB_SHA ?? '';
  if (process.argv[2] === 'prepare') {
    await prepareDirect(process.cwd(), revision);
    console.log('Direct standalone bundle prepared. cPanel startup remains server.js.');
    return;
  }
  if (process.argv[2] !== 'deploy') throw new Error('Choose prepare or deploy.');
  const config = deploymentConfig();
  const temporary = await mkdtemp(join(tmpdir(), 'portfolio-direct-'));
  try {
    await uploadDirect(config, resolve('.release', revision), revision, { temporary });
    console.log('Application uploaded, restarted and verified.');
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
