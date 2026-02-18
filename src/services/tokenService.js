/**
 * Token Authority Service
 *
 * Responsibilities:
 * - Issue tenant-bound tokens
 * - Verify token integrity
 * - Enforce issuer + audience constraints
 *
 * NOTE: Implementation intentionally deferred.
 */
/**
 * Issue a tenant-bound token.
 *
 * @param {Object} params
 * @param {string} params.tenantId
 * @param {string} params.subject
 * @param {Array<string>} params.audience
 * @param {Object} params.claims
 */
export async function issueToken(params) {
  throw new Error('Token issuance not implemented');
}

/**
 * Verify a token and enforce issuer / audience constraints.
 *
 * @param {string} token
 */
export async function verifyToken(token) {
  throw new Error('Token verification not implemented');
}
