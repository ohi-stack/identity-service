# QuantumOHI™ Identity Service

**Founder / architect:** One Gregory Onegodian™  
**Current package version:** 0.1.0  
**Maturity:** SPECIFICATION / CONTRACT-FIRST — **NOT PRODUCTION**

The `identity-service` repository defines the canonical identity and authentication boundary for the QuantumOHI Platform. It is designed to establish authenticated human, organization, and workload identities so downstream governance and execution services can evaluate requests against declared policies.

> Identity answers **who or what is making the request**. The OHI Control Plane evaluates **what that principal may do**. The Execution Gateway performs only governed, approved work.

## Source status

This is a Node.js / Express scaffold with HTTP routes and an integration contract. The current login/logout, token issue/verify, and tenant management routes return `501 Not Implemented`. Cryptographic token issuance and validation are **not deployed in this repo**. Do not point customer authentication at these placeholders or represent the service as production-ready.

The `GET /health` route is a **liveness response only**, not proof that authentication, tenancy, key management, or database dependencies are available. A separate verified readiness contract is required before production.

### Security correction in the October 18, 2026 proposal

The original resolver trusted `x-tenant-id` and `?tenant=` and used a default tenant. The hardening branch introduces `src/middleware/tenantContext.js`, which assigns tenant scope **only from a trusted server-set `req.verifiedIdentity` principal with an explicit tenant ID**. Anonymous requests and arbitrary caller tenant hints produce `req.tenant === null`. There is **no verifier middleware yet**, so this remains a safe scaffold, not a complete authorization layer.

Run:

```bash
npm install
npm test
npm run check
npm start
```

The initial tests exercise tenant-context rules, including forged header/query tenant hints. Full startup, integration, CI, infrastructure and public-domain acceptance require independent evidence.

## Existing API placeholders

- `POST /auth/login` — returns 501
- `POST /auth/logout` — returns 501
- `POST /token/issue` — returns 501
- `POST /token/verify` — returns 501
- `POST /tenant/register` — returns 501
- `GET /tenant/:tenantId` — returns 501
- `GET /health` — liveness only

Do not infer an operational OAuth/OIDC issuer from these route names.

## Canonical integration

- Public application and product UX: `ohi-stack/quantumohi-platform`, target `https://quantumohi.com`
- Identity and authentication: `ohi-stack/identity-service`
- Governance and policy decisions: `ohi-stack/ohi-control-plane`
- Execution: approved, verified OHI Execution Gateway
- Records: correlated identity, governance, execution and audit events

The service remains independently deployable. Production URL variables must remain blank until real service endpoints are validated. No service can manufacture identity authority by passing a query parameter, arbitrary header, or unsigned JWT.

## Documentation

- [QuantumOHI Platform integration contract](docs/QUANTUMOHI_PLATFORM_INTEGRATION.md)
- [October 18, 2026 upgrade specification — APIs, security, operations, UI/UX, services and commercial packages](docs/IDENTITY_SERVICE_UPGRADE_2026-10-18.md)

**Next gate:** reproduce a clean build, verify actual runtime health, select and integrate an approved authentication/identity provider, implement tenant-scoped storage and permissions, complete the security test suite, and verify the full `Identity → Governance → Execution → Record` chain before production classification.
