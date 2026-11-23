// node --test scripts/ — contrat de src/lib/intake.ts face aux règles de l'intake (intake/handler.mjs receive).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intakeFields, intakeErrors, SERVICE_LABELS, TOWN_NOT_ASKED } from '../src/lib/intake.ts';

const base = { name: 'Test Fictif', email: 'test.fictif@example.com', consent: true, lines: [] };

test('champs attendus par l’intake, consentement explicite', () => {
  const f = intakeFields({ ...base, service: 'devis', lines: ['Activité : Artisanat', false, '\nBonjour'] });
  assert.deepEqual(Object.keys(f).sort(), ['consent', 'email', 'message', 'name', 'phone', 'service', 'town']);
  assert.equal(f.consent, 'oui');
  assert.equal(f.town, TOWN_NOT_ASKED);
  assert.equal(f.message, 'Demande de devis POLIVIA\nActivité : Artisanat\n\nBonjour');
  assert.deepEqual(intakeErrors(f), []);
});

test('chaque service passe le minimum de 20 caractères sans message saisi', () => {
  for (const service of Object.keys(SERVICE_LABELS)) assert.deepEqual(intakeErrors(intakeFields({ ...base, service })), [], service);
});

test('jamais de consentement forcé', () => {
  const f = intakeFields({ ...base, service: 'studio', consent: false });
  assert.equal(f.consent, '');
  assert.match(intakeErrors(f).join(), /Cochez la case/);
});

test('refus identiques à ceux de l’intake', () => {
  const f = intakeFields({ ...base, service: 'devis', name: 'X', email: 'pas-un-email', phone: '06 12 (bureau)' });
  assert.equal(intakeErrors(f).length, 3);
  assert.equal(intakeFields({ ...base, service: 'devis', lines: ['x'.repeat(6000)] }).message.length, 5000);
});
