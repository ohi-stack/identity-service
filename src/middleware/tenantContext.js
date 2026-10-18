/**
 * Tenant context boundary for the identity-service scaffold.
 *
 * SECURITY: Never grant tenant authority from X-Tenant-ID, query parameters,
 * or a default tenant. Only a verified identity established by a trusted,
 * server-side authentication middleware can establish the tenant context.
 *
 * This repository does not yet implement authentication or token verification.
 * Consequently, req.tenant remains null for existing unauthenticated routes.
 */
export function tenantContext(req, res, next) {
  req.tenant = null;
  const verifiedIdentity = req.verifiedIdentity;

  if (
    verifiedIdentity &&
    verifiedIdentity.verified === true &&
    typeof verifiedIdentity.tenantId === 'string' &&
    verifiedIdentity.tenantId.length > 0
  ) {
    req.tenant = Object.freeze({ id: verifiedIdentity.tenantId });
  }

  next();
}
