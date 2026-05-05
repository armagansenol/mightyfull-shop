import fs from 'node:fs';
import path from 'node:path';

function parseEnvLine(line: string) {
  const index = line.indexOf('=');
  if (index === -1) return undefined;

  const key = line.slice(0, index).trim();
  const rawValue = line.slice(index + 1).trim();
  const value = rawValue.replace(/^['"]|['"]$/g, '');

  return key ? { key, value } : undefined;
}

export function loadLocalEnv(projectDir = process.cwd()) {
  for (const file of ['.env', '.env.local']) {
    const envPath = path.join(projectDir, file);
    if (!fs.existsSync(envPath)) continue;

    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const parsed = parseEnvLine(trimmed);
      if (!parsed || process.env[parsed.key] !== undefined) continue;

      process.env[parsed.key] = parsed.value;
    }
  }
}
