import test from 'node:test';
import assert from 'node:assert/strict';
import { tenantContext } from '../src/middleware/tenantContext.js';

function resolve(req) {
  let advanced = false;
  tenantContext(req, {}, () => { advanced = true; });
  assert.equal(advanced, true);
  return req;
}

test('anonymous requests have no authoritative tenant', () => {
  const req = resolve({ headers: {}, query: {} });
  assert.equal(req.tenant, null);
});

test('caller-controlled headers and query cannot establish a tenant', () => {
  const req = resolve({
    headers: { 'x-tenant-id': 'tenant-attacker' },
    query: { tenant: 'tenant-other' }
  });
  assert.equal(req.tenant, null);
});

test('unverified identity objects do not establish a tenant', () => {
  const req = resolve({
    verifiedIdentity: { tenantId: 'tenant-1', verified: false }
  });
  assert.equal(req.tenant, null);
});

test('verified identity without tenant does not silently fall back', () => {
  const req = resolve({
    verifiedIdentity: { verified: true, tenantId: '' }
  });
  assert.equal(req.tenant, null);
});

test('trusted verified identity can establish tenant context', () => {
  const req = resolve({
    headers: { 'x-tenant-id': 'attacker-override' },
    query: { tenant: 'other-override' },
    verifiedIdentity: { verified: true, tenantId: 'tenant-verified' }
  });
  assert.deepEqual(req.tenant, { id: 'tenant-verified' });
  assert.equal(Object.isFrozen(req.tenant), true);
});

test('middleware must not trust a boolean or object as tenant ID', () => {
  assert.equal(resolve({
    verifiedIdentity: { verified: true, tenantId: { id: 'wrong' } }
  }).tenant, null);
});
