#!/usr/bin/env node
// Lists the legal information still missing (src/content/site.ts → legal). Warning by default;
// REQUIRE_LEGAL=1 makes it blocking (production with the intake active, see the go-live plan).
import { pathToFileURL } from 'node:url';

export async function report(env = process.env) {
  const { missingLegal } = await import('../src/content/site.ts');
  return missingLegal(Boolean(env.VITE_FORM_ENDPOINT));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const missing = await report();
  if (!missing.length) console.log('pages légales complètes');
  else console.warn(`pages légales : ${missing.length} information(s) à compléter (pages en noindex) :\n${missing.map((m) => `  · ${m}`).join('\n')}`);
  if (missing.length && process.env.REQUIRE_LEGAL === '1') process.exit(1);
}
