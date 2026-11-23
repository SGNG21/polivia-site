#!/usr/bin/env node
// Lists the legal information still missing (src/content/site.ts → legal). Warning by default; blocking for a Vercel
// production build (VERCEL_ENV=production) or with REQUIRE_LEGAL=1: « À compléter » boxes can never reach production.
import { pathToFileURL } from 'node:url';

export async function report(env = process.env) {
  const { missingLegal } = await import('../src/content/site.ts');
  return missingLegal(Boolean(env.VITE_FORM_ENDPOINT));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const missing = await report();
  if (!missing.length) console.log('pages légales complètes');
  else console.warn(`pages légales : ${missing.length} information(s) à compléter (pages en noindex) :\n${missing.map((m) => `  · ${m}`).join('\n')}`);
  if (missing.length && (process.env.REQUIRE_LEGAL === '1' || process.env.VERCEL_ENV === 'production')) process.exit(1);
}
