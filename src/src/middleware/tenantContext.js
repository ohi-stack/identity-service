/**
 * Tenant context resolver
 * Attaches tenant scope to every request
 */
export function tenantContext(req, res, next) {
  const tenantId =
    req.headers['x-tenant-id'] ||
    req.query.tenant ||
    null;

  req.tenant = tenantId
    ? { id: tenantId }
    : { id: 'default' };

  next();
}
