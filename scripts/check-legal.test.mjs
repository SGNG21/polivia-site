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
