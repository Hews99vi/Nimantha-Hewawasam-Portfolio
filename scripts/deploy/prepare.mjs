import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export const revisionPattern = /^[a-f0-9]{40}$/;
export async function prepareRelease(root, revision, output = join(root, '.release')) {
  if (!revisionPattern.test(revision)) throw new Error('A full commit SHA is required.');
  const target = join(output, revision);
  await rm(target, { recursive: true, force: true });
  await mkdir(join(target, '.next/static'), { recursive: true });
  await cp(join(root, '.next/standalone'), target, { recursive: true, filter: source => !/^\.env(?:\.|$)/.test(source.split(/[\\/]/).pop()) });
  await cp(join(root, '.next/static'), join(target, '.next/static'), { recursive: true });
  await cp(join(root, 'public'), join(target, 'public'), { recursive: true });
  const critical = {};
  for (const name of ['server.js', '.next/BUILD_ID']) {
    const data = await readFile(join(target, name));
    if (!data.length) throw new Error(`Missing release file: ${name}`);
    critical[name] = createHash('sha256').update(data).digest('hex');
  }
  // Catch accidentally traced environment files anywhere in the portable bundle.
  const scan = async directory => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = join(directory, entry.name);
      if (/^\.env(?:\.|$)/.test(entry.name)) await rm(name, { force: true, recursive: true });
      else if (entry.isDirectory()) await scan(name);
    }
  };
  await scan(target);
  await writeFile(join(target, 'DEPLOYED_SHA'), revision + '\n');
  const manifest = { version: 1, revision, critical };
  // Kept outside the uploaded directory: transfer the completion marker only after SCP succeeds.
  const marker = join(output, `${revision}-ready.json`);
  await writeFile(marker, JSON.stringify(manifest));
  await cp(join(root, 'scripts/deploy/launcher.cjs'), join(output, 'server.cjs'));
  return { directory: target, marker, revision };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareRelease(process.cwd(), process.argv[2] ?? process.env.GITHUB_SHA ?? '');
  console.log('Standalone release prepared without environment files.');
}
