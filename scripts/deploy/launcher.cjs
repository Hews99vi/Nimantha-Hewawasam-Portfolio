// One-time cPanel startup file. It never executes a path supplied by an HTTP request.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const revisionPattern = /^[a-f0-9]{40}$/;
function resolveRelease(root, pointerName) {
  const pointer = JSON.parse(fs.readFileSync(path.join(root, pointerName), 'utf8'));
  if (!revisionPattern.test(pointer.revision)) throw new Error('Invalid release revision');
  const base = fs.realpathSync(path.join(root, 'releases'));
  const directory = fs.realpathSync(path.join(base, pointer.revision));
  if (!directory.startsWith(base + path.sep)) throw new Error('Release escapes the release directory');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'release-ready.json'), 'utf8'));
  if (manifest.version !== 1 || manifest.revision !== pointer.revision) throw new Error('Release is incomplete');
  for (const name of ['server.js', '.next/BUILD_ID']) {
    const bytes = fs.readFileSync(path.join(directory, name));
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== manifest.critical?.[name]) throw new Error('Release integrity check failed');
  }
  return { revision: pointer.revision, directory };
}
function selectRelease(root) {
  for (const name of ['current-release.json', 'last-good-release.json']) {
    try { return resolveRelease(root, name); }
    catch { /* A partial pointer or incomplete upload must not boot a partial release. */ }
  }
  throw new Error('No complete release is available. Restore the last-good release in cPanel.');
}
function launch(root) {
  if (Number(process.versions.node.split('.')[0]) !== 22) throw new Error('The portfolio requires Node.js 22.');
  const release = selectRelease(root);
  process.env.PORTFOLIO_REVISION = release.revision;
  process.chdir(release.directory);
  require(path.join(release.directory, 'server.js'));
}
module.exports = { resolveRelease, selectRelease, launch };
if (require.main === module) launch(__dirname);
