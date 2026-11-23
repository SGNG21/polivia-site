#!/usr/bin/env node
// Refuse the build when VITE_FORM_ENDPOINT could not work under the CSP shipped in vercel.json.
// The forms submit natively to the intake (src/lib/intake.ts): what gates them is `form-action`, not `connect-src`.
// Unset = mailto fallback, nothing to check.
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function endpointProblems(endpoint, csp) {
  if (!endpoint) return [];
  let u;
  try {
    u = new URL(endpoint);
  } catch {
    return [`VITE_FORM_ENDPOINT n’est pas une URL absolue : ${endpoint}`];
  }
  const problems = [];
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname);
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && loopback)) problems.push('VITE_FORM_ENDPOINT doit être en https (http seulement en local).');
  if (!/^\/v1\/devis\/[a-z0-9-]{3,80}$/.test(u.pathname) || u.search || u.hash) problems.push('VITE_FORM_ENDPOINT doit être <origine de l’intake>/v1/devis/<siteId>.');
  // form-action has no fallback to default-src: absent = every target allowed.
  const directive = csp.split(';').map((d) => d.trim().split(/\s+/)).find(([name]) => name === 'form-action');
  // ponytail: exact origin or scheme-source only; host wildcards (https://*.x) are refused until needed.
  if (directive && !directive.slice(1).some((s) => s === u.origin || s === u.protocol))
    problems.push(`La CSP de vercel.json n’autorise pas ${u.origin} dans form-action : le navigateur bloquerait l’envoi.`);
  return problems;
}

export function shippedCsp(vercel) {
  const all = vercel.headers.find((h) => h.source === '/(.*)');
  return all?.headers.find((h) => h.key.toLowerCase() === 'content-security-policy')?.value ?? '';
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const { loadEnv } = await import('vite'); // same sources as `vite build`: .env files and the environment
  const endpoint = loadEnv(process.env.MODE || 'production', root, 'VITE_').VITE_FORM_ENDPOINT;
  const problems = endpointProblems(endpoint, shippedCsp(JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))));
  if (problems.length) {
    console.error(problems.map((p) => `✖ ${p}`).join('\n'));
    process.exit(1);
  }
  console.log(endpoint ? `formulaires → intake (${new URL(endpoint).origin}), autorisé par form-action` : 'formulaires → repli mailto (VITE_FORM_ENDPOINT absent)');
}
