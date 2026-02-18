# identity-service
Canonical identity, authentication, and tenant authorization service for the QuantumOHI platform. Issues tenant-aware JWTs and serves as the sole identity authority for all execution and infrastructure systems.
## Status

This service is intentionally implemented using a **contract-first architecture**.

- Public service interfaces are defined
- Route boundaries are established
- Cryptographic issuance and verification are intentionally deferred

This allows dependent systems to integrate against stable identity contracts
before the underlying key management, signing strategy, or HSM/KMS provider
is finalized.
## Responsibilities

This service is responsible for:

- Tenant resolution and isolation
- Subject identity canonicalization
- Token issuance (tenant-bound)
- Token verification (issuer + audience enforcement)
- Acting as the **single source of identity truth** for all QuantumOHI services

This service is **not** responsible for:
- Business authorization logic
- Domain-specific role interpretation
- UI authentication flows
## Service Contracts

### Token Authority

Defined in: `src/services/tokenService.js`

- `issueToken(params)`
  - Issues a tenant-bound token
  - Enforces issuer and audience constraints

- `verifyToken(token)`
  - Verifies token integrity and validity
  - Enforces tenant, issuer, and audience claims

> Implementation is deferred by design.
## Usage Pattern

All downstream services must:

1. Accept bearer tokens only
2. Delegate verification to identity-service
3. Treat tenant context as authoritative from verified claims

No service may issue, mutate, or self-sign identity tokens.
