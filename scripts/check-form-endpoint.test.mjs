import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { endpointProblems, shippedCsp } from './check-form-endpoint.mjs';

const CSP = shippedCsp(JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')));
const E = 'https://intake.example/v1/devis/polivia-site';

test('sans endpoint : repli mailto, rien à contrôler', () => assert.deepEqual(endpointProblems(undefined, CSP), []));
test('CSP livrée : intake https autorisé par form-action', () => assert.deepEqual(endpointProblems(E, CSP), []));
test('CSP livrée : intake local en http bloqué par form-action', () =>
  assert.match(endpointProblems('http://127.0.0.1:4501/v1/devis/polivia-site', CSP).join(), /form-action/));
test('form-action limité à self : refusé ; origine explicite : accepté', () => {
  assert.match(endpointProblems(E, "default-src 'self'; form-action 'self'").join(), /form-action/);
  assert.deepEqual(endpointProblems(E, "form-action 'self' https://intake.example"), []);
  assert.deepEqual(endpointProblems(E, "default-src 'self'"), []); // pas de repli sur default-src
});
test('URL hors contrat', () => {
  assert.equal(endpointProblems('http://intake.example/v1/devis/polivia-site', CSP).length, 2); // http distant + form-action
  assert.match(endpointProblems('https://intake.example/api/form', CSP).join(), /v1\/devis/);
  assert.match(endpointProblems('/v1/devis/x', CSP).join(), /absolue/);
});
