# QuantumOHI™ Identity Service — October 18, 2026 Upgrade Specification

**Document version:** 0.2 draft (not software release)  
**Record date:** 2026-10-18  
**Originator / platform architect:** One Gregory Onegodian™  
**Repository:** `ohi-stack/identity-service`  
**Maturity:** SPECIFICATION / CONTRACT-FIRST; backend authentication not production-verified.

## 1. Scope and trust boundary

The Identity Service identifies **who or what** is requesting access. It does not manufacture authority or replace the separate OHI Control Plane's governance and authorization decisions. The QuantumOHI request sequence remains:

`Client → Identity → Governance / Control Plane → Approved Execution Gateway → Adapter / Provider → Structured Result → Record / Oversight`.

Keep one reusable core, many configurable deployments, and minimal divergence. Identity is a backend service: QuantumOHI Platform owns presentation; the Identity Service owns verified identity and related lifecycle records.

## 2. Verified baseline and immediate gaps

As examined 2026-10-18 at source revision `d0d32604d99cc62d96adced83dfdc9db404e5cdc`:
- `package.json` declares Express, Node ESM and version 0.1.0.
- `/auth/login`, `/auth/logout`, `/token/issue`, `/token/verify`, and tenant routes are placeholder HTTP 501 responses.
- `tokenService.js` throws "not implemented" for issuance and verification.
- `src/server.js` imports `./middleware/tenantContext.js` while the original file was incorrectly placed at `src/src/middleware/tenantContext.js`.
- The old tenant middleware trusted caller-supplied `x-tenant-id` / `?tenant=` values and silently used `default`. This is unsafe as an authoritative tenant source.
- Deployment, database persistence, token cryptography, session storage, automated integration tests and enterprise SSO are unverified.

The accompanying branch adds an import-resolving, fail-closed tenant-context scaffold and focused unit tests. **That is not a completed identity provider.** Until a trusted authentication verifier exists, there is no authenticated tenant context.

## 3. Upgrades by priority

### P0 — Foundational, before customer login

1. **Runtime hygiene:** fix middleware layout, add Node LTS baseline, liveness `GET /health` vs readiness `GET /ready`, structured error envelopes, safe logging, request IDs, bounded JSON bodies and request timeouts.
2. **Persistence:** transactional storage for subjects, organizations, memberships, credentials, sessions, applications, approval-relevant identity events, invitations and key metadata; migrations and backup/restore.
3. **Authentication:** adopt a mature and security-reviewed identity provider or implement explicitly reviewed OpenID Connect (OIDC) support, with authorization code plus PKCE. No implicit or resource-owner-password grant. Prefer passkeys (WebAuthn Level 3) and strong step-up for privileged actions. Password support, if needed, requires well-tested hashing, recovery and abuse protection.
4. **Token validation:** enforce issuer, audience, signature algorithm allowlist, key ID, expiration, not-before, subject, client, organization and scopes on every relevant boundary; JWKS and key rotation; fail closed on unknown keys.
5. **Session control:** secure HttpOnly/SameSite cookies for first-party web sessions where suitable, rotating refresh tokens, replay detection, per-device session views, forced logout, token revocation and short-lived access tokens. Store no bearer tokens in localStorage.
6. **Tenant isolation:** tenant scope comes only from cryptographically verified claims plus server-side membership checks. Query strings and tenant headers are untrusted hints, never grants. Prevent cross-tenant reads and writes in storage and API layers.
7. **Machine identities:** service/client registration, scoped credentials, workload authentication, rotation and offboarding; no universal shared master tokens. Delegated agent identities must show sponsoring human/service and bounded scopes.
8. **Governance integration:** provide normalized verified context to the OHI Control Plane; do not let roles in a JWT alone authorize high-impact workflow actions; evaluate relevant server-side policy at execution time.
9. **Audit:** record successful and denied identity operations using normalized identifiers, UTC timestamps, outcome, reason codes, trace IDs and evidence references; exclude secrets, full tokens, biometric data and raw passwords.
10. **Security validation:** threat model, dependency scanning, rate limits, abuse detection, CSRF and redirect checks, least privilege, encrypted transport, staging/production separation and incident playbooks.

### P1 — Customer-ready organization features

- Organization signup and invites with verified email ownership; invitation expiry and one-time redemption.
- Membership lifecycle: invite, accept, activate, suspend, role change, transfer and offboard.
- Role and group administration with least-privilege defaults; effective permissions shown separately from identity claims.
- Self-service sessions, passkey enrollment and recovery, connected apps and account export/deletion subject to retention obligations.
- Organization-switcher that revalidates membership and establishes a new tenant-scoped session.
- MFA/passkey step-up for privileged actions such as integrations, key rotation, bulk exports and user grants.
- Break-glass administrator access with explicit controls, short duration, dedicated audit and post-event review.
- Federated organization sign-on and SCIM provisioning once the base user lifecycle is proven.
- Accessible error recovery, session-expiry warnings, mobile account security and phishing-resistant login UX.

### P2 — Advanced enterprise capabilities

- Optional sender-constrained service tokens using mutually authenticated TLS or DPoP.
- OAuth token exchange for narrower downstream delegation; not unrestricted impersonation.
- Fine-grained identity risk signals with documented controls, user appeals and privacy-protective retention.
- Multi-region resilience, disaster recovery and tenant-specific configurations where justified.
- Regulated-enterprise integration profiles only after separate legal/security review; never assert certification without audit evidence.

## 4. API contracts — proposals, not deployed endpoints

The existing placeholders use `/auth`, `/token`, and `/tenant`. **Do not silently change or advertise existing paths as production.** The following are the proposed future versioned interface:

| Route | Purpose | Security boundary |
| --- | --- | --- |
| `GET /health` | Liveness only | Public, no secrets |
| `GET /ready` | Dependency readiness | Public-safe status |
| `GET /.well-known/openid-configuration` | OIDC discovery | After provider implementation |
| `GET /.well-known/jwks.json` | Public signing keys | Never private keys |
| `GET /v1/identity/me` | Verified self identity | Session or verified token |
| `GET /v1/identity/sessions` | Own active sessions | Authenticated subject |
| `DELETE /v1/identity/sessions/{id}` | Revoke session | Subject or authorized administrator |
| `POST /v1/identity/passkeys/register/options` | Begin passkey enrollment | Session + replay resistance |
| `POST /v1/identity/passkeys/register/verify` | Complete passkey enrollment | WebAuthn verified challenge |
| `GET /v1/organizations` | Organizations visible to user | Verified memberships |
| `POST /v1/organizations/{id}/invitations` | Invite member | Tenant-scoped administrator |
| `GET /v1/organizations/{id}/members` | Membership list | Tenant-scoped permission |
| `PATCH /v1/organizations/{id}/members/{id}` | Change membership | Governed privileged action |
| `POST /v1/service-accounts` | Create service principal | Privileged + approval where required |
| `POST /v1/service-accounts/{id}/rotate` | Rotate client credential | Privileged, auditable |
| `POST /oauth2/token` | Protocol-defined issuance | OIDC/OAuth-compliant grant validation |
| `POST /oauth2/revoke` | Revoke refresh/access token | Authorized client |
| `POST /oauth2/introspect` | Token status for trusted resource service | Authenticated confidential client |
| `GET /v1/identity/events` | Scoped identity audit | Organization policy + read permission |

Do not expose an unrestricted `POST /token/issue` to arbitrary callers. Require a tested, standards-conforming issuer, approved grant, client authentication, and strict policy checks. Preserve existing placeholders until compatible migrations are ready.

### Normalized internal identity context (target)

```json
{
  "schemaVersion": "1.0",
  "requestId": "req_example",
  "subjectId": "sub_example",
  "subjectType": "human",
  "organizationId": "org_example",
  "sessionId": "ses_example",
  "clientId": "quantumohi-platform",
  "authenticationContext": {
    "method": "webauthn",
    "authenticatedAt": "2026-10-18T00:00:00Z"
  },
  "scopes": ["workflow:request"],
  "verifiedBy": "identity-service",
  "issuer": "configuration-derived-issuer",
  "audience": "ohi-control-plane"
}
```

This is an illustrative **server-side derived** object, not untrusted browser input. Authorization must re-check tenant membership, policy and sensitive-action approval rather than trusting client-displayed roles.

### Deterministic error contract (target)

```json
{
  "error": {
    "code": "IDENTITY_AUTHENTICATION_REQUIRED",
    "message": "An authenticated identity is required.",
    "requestId": "req_example",
    "timestamp": "2026-10-18T00:00:00Z"
  }
}
```

Return 401 for missing/invalid authentication; 403 for verified-but-not-authorized; 409 for conflicts; 429 for throttling; 503 for mandatory dependency unavailable. Prevent user enumeration and redact credential-specific diagnostics from public responses.

## 5. Identity data model (target)

- `subjects`: stable subject ID, type (human/service/agent), state and lifecycle timestamps.
- `organizations`: tenant ID, display name, state, billing linkage and configuration reference.
- `memberships`: subject, organization, roles/groups, status and effective times.
- `credentials`: passkey/public-key metadata, registered authenticators, key IDs, lifecycle states; **no recoverable plaintext secrets**.
- `sessions`: opaque session ID hash, subject, client, organization, expiry, revocation and device metadata.
- `oauth_clients`: approved redirect URIs, grants, authentication mode, allowed audiences/scopes.
- `service_principals`: workload identity, owner, scopes, rotation state and expiry.
- `invitations`: tenant, target principal/email, one-time token hash, expiration and acceptance record.
- `identity_events`: event ID, tenant/subject/client, action, result, reason, timestamp, request/trace ID and retention metadata.
- `key_metadata`: provider reference, public key ID, use, activation/rotation/revocation state. Raw signing keys remain in an approved KMS/HSM/secrets service.

Use tenant-scoped database access restrictions, migrations, encrypted backups, retention rules and a tested restore sequence.

## 6. Operating processes

**Human sign-in:** Launch Platform → choose passkey/SSO → authenticate → derive verified principal → verify organization membership → create protected session → display dashboard → apply policy on each requested operation.

**Invitations:** authorized org admin requests invite → tenant policy check → one-time time-limited invite → recipient validates identity → membership activated → event recorded.

**Sensitive workflow:** verified principal → organization context → control-plane rule/approval → permitted execution gateway → structured result → correlated audit record.

**Machine access:** service owner registers client → privileged approval if applicable → bound credential provisioned → scoped token request → audience-validated downstream call → execution/audit → scheduled rotation/revocation.

**Offboarding:** revoke memberships → revoke/expire sessions and service credentials → prevent new grants → record and review residual access, integrations and retention obligations.

**Incident response:** alert → suspend affected principal/client where justified → revoke/rotate compromised credentials → preserve sanitized evidence → investigate → document recovery.

## 7. Operational service-level indicators

Measure **successful authenticated sign-in rate**, median and p95 authentication latency, passkey enrollment completion, failed sign-ins, suspicious lockouts, refresh-token reuse, revoked-session enforcement time, tenant-isolation test results, security event delivery, key-rotation success, service uptime, recovery readiness and support ticket volume. Do not publish guaranteed SLAs before measuring real production performance.

Suggested operational panels: sessions by status; identity events by type; token/JWKS health; tenant membership changes; privileged approvals; latency/error trends; key age; account recovery; integration failures; security exceptions.

## 8. User interface / user experience

The Identity Service remains backend infrastructure. React/TypeScript/Tailwind on QuantumOHI Platform owns customer-facing UI; `/admin` owns privileged internal management. Proposed routes (not yet verified as built):

- `/login`: branded passwordless-first sign-in, enterprise SSO fallback and accessible recovery.
- `/register` and `/onboarding/organization`: account verification and first organization setup.
- `/dashboard/settings/profile`: personal account information and privacy.
- `/dashboard/settings/security`: passkeys, recovery, MFA, sessions and recent sign-ins.
- `/dashboard/organization/members`: invitations, roles, membership status and bulk offboarding.
- `/dashboard/organization/service-accounts`: service principals, scoped credentials, rotation health.
- `/dashboard/organization/sso`: enterprise federation settings after verified SSO implementation.
- `/dashboard/organization/audit`: identity-security events, filters and evidence exports.
- `/admin/identity`: cross-environment service status and incident review for authorized platform operators.
- `/developers/identity`: SDK, identity context, API schema, token validation and integration documentation.

**UX standards:** responsive light/dark design consistent with QuantumOHI navy/cyan brand; accessible labels and focus; WCAG 2.2 AA target; plain-language explanations of authentication vs authorization; clear session expiry and recovery; reversible actions where possible; double confirmation for credential revocation; safe no-data states; no simulated live metrics or production status.

## 9. Services and digital product opportunities — proposed catalog

1. **QuantumOHI Identity Core:** platform authentication and verified identity context; foundational bundled capability after production gates.
2. **Organization Access Manager:** customer-facing invitations, memberships, role lifecycle and offboarding; recurring SaaS entitlement.
3. **Enterprise SSO Connector:** OIDC/SAML federation, directory mapping and supervised onboarding; business/enterprise add-on only once implemented.
4. **Service Identity & Credential Manager:** governed client registration, credential scopes, rotation and revocation; developer/enterprise add-on.
5. **Identity Audit & Access Evidence:** searchable access changes, authentication events and exportable traceability records; governance add-on.
6. **Identity Integration Kit:** versioned OpenAPI definitions, TypeScript SDK, React integration guide, local test harness and migration examples; digital developer product.
7. **Managed Identity Operations:** setup, access reviews, incident-response support, key rotation monitoring and account lifecycle administration; managed professional service.

**Commercial safeguard:** these are product definitions and packaging candidates, not currently purchasable/operational offerings. No customer billing or availability claims before implementation, security validation, support policies and pricing approval.

## 10. Platform connections

- **QuantumOHI Platform:** sends users through backend-validated sign-in/session paths and displays identity UX, not token signing.
- **OHI Control Plane:** consumes verified principal context and independently evaluates authority/policy.
- **OHI Execution Gateway:** accepts only authorized, policy-evaluated execution input and preserves requester/execution correlation.
- **OHIaaS™:** provides reusable service-access interfaces; does not duplicate the identity issuer.
- **ACC:** where explicitly integrated, operates under an attributable service or human principal, not unrestricted authority.
- **QR-V:** optional verification of a supported record/credential by separately documented integration; not a replacement for authentication.
- **Q-Lattice™, Sovereign Key Manager and HGE™:** remain **RESEARCH**; do not claim these research components are deployed identity dependencies.

## 11. Production gates and acceptance tests

**Gate A — compile/start:** `npm install`, `npm test`, `npm run check`, server starts, `GET /health` works, no invalid imports. Current PR adds security tests; running them and validating deployments remains separate evidence.

**Gate B — identity correctness:** real provider or fully reviewed issuer, passkey/SSO or approved login flow, signed tokens, validated audience, issuance/revocation/rotation, no default tenant.

**Gate C — authorization safety:** wrong-tenant access denied, forged `x-tenant-id` denied, cross-tenant queries denied, expired/replayed credentials denied, privilege elevation blocked, sessions revoked promptly.

**Gate D — operations:** migrations, backups, restore, secret management, observability, incident response, vulnerability testing, provider-failure behavior, key recovery, support runbook, upgrade and rollback.

**Gate E — platform integration:** real sign-in → verified identity → governance evaluation → approved execution → persisted record → dashboard oversight; denial tests must block execution.

**Gate F — live production:** verify exact source commit, release artifact, live routing, health and readiness, TLS, monitoring, logs, load behavior, security signoff and reproducible rollback in the deployed environment.

Maintain statuses **COMPLETE / IN PROGRESS / BLOCKED / NOT STARTED / RESEARCH / PLANNED / NEEDS VERIFICATION** tied to artifacts, CI runs and actual deployments. Do not promote the service to PRODUCTION because the design or featured image exists.

## 12. Contemporary standards reference (as of 2026-10-18)

- W3C WebAuthn Level 3 Recommendation (2026-08-25): https://www.w3.org/TR/2026/REC-webauthn-3-20260825/
- NIST SP 800-63-4 Digital Identity Guidelines (2025-08): https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines
- OAuth 2.0 Security BCP, RFC 9700 (2025-01): https://www.rfc-editor.org/rfc/rfc9700
- JWT Profile for OAuth 2.0 Access Tokens, RFC 9068: https://www.rfc-editor.org/rfc/rfc9068
- OAuth 2.0 Token Exchange, RFC 8693: https://www.rfc-editor.org/rfc/rfc8693

Adopt standards by explicit versioned threat-model review, not by branding assertions. Avoid claims of federal compliance, formal certification, quantum-security capability, or standalone governmental identity authority without separate evidence.
