import { test } from 'node:test';
import assert from 'node:assert/strict';
import { report } from './check-legal.mjs';

test('informations légales manquantes : listées, et le serveur de réception compte quand les formulaires l’utilisent', async () => {
  const sans = await report({});
  assert.ok(sans.includes('SIREN') && sans.includes('Directeur de la publication'));
  assert.ok(!sans.includes('Hébergeur et pays du serveur de réception'));
  const avec = await report({ VITE_FORM_ENDPOINT: 'https://intake.example/v1/devis/polivia-site' });
  assert.equal(avec.length, sans.length + 1);
});

test('build de production Vercel bloqué tant qu’une information manque ; Preview et local seulement avertis', async () => {
  const { spawnSync } = await import('node:child_process');
  const run = (env) => spawnSync(process.execPath, ['scripts/check-legal.mjs'], { env: { PATH: process.env.PATH, ...env } }).status;
  assert.equal(run({ VERCEL_ENV: 'production' }), 1);
  assert.equal(run({ REQUIRE_LEGAL: '1' }), 1);
  assert.equal(run({ VERCEL_ENV: 'preview' }), 0);
  assert.equal(run({}), 0);
});
