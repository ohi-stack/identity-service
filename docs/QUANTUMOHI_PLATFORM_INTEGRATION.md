# QuantumOHI Platform Integration Contract

## Canonical Platform Boundary

The QuantumOHI Platform is the public/application surface for governed intelligence, systems, standards, verification, execution access, developer tooling, platform-directory records, and commercial platform workflows.

Production application surface:
- https://quantumohi.com

ChatGPT Sites content/source reference:
- https://quantumohi-platform.onegodian.chatgpt.site

Canonical application repository:
- `ohi-stack/quantumohi-platform`

The canonical repository is intentionally separate from service/runtime repositories.

## Source-Convergence Rule

The GitHub platform repository is the reproducible deployment source. The ChatGPT Sites project remains a content/product reference. The August 14, 2026 Platform Directory export has been restored into the repository, including interface purpose, maturity labels, authority boundaries, interface contracts, planned integration paths, related-interface links, maturity discipline, and originator attribution.

Content parity does **not** promote a capability's technical maturity. Status changes require implementation evidence, testing, versioned documentation, and authorized approval.

## Service Boundary

QuantumOHI Platform must consume services through documented interfaces. It must not absorb their implementation code.

- `ohi-stack/identity-service` — identity, authentication, tenant-aware authorization context
- approved execution boundary — governed execution interface/runtime boundary; the prior `execution-interface` repository requires realignment before use as the canonical gateway
- `ohi-stack/ohi-control-plane` — policy, governance, approval, risk, and execution authorization
- QR-V repositories — verification, registry, SDK, explorer, status, security, billing, and developer services where integrated

## Platform Rules

1. Human authority remains above models, tools, workflows, and adapters.
2. Platform UI must not imply that research-stage components are production runtimes.
3. Research, planned, beta, specification, reference, and production capabilities must be labeled distinctly.
4. Services remain independently deployable and versioned.
5. No duplicated service logic in the platform frontend.
6. Authentication, policy evaluation, execution, and verification must cross explicit API/service boundaries.
7. Audit identifiers and execution records should be preserved end-to-end where supported.
8. Interface pages must preserve documented authority boundaries and source-vs-future distinctions.

## Maturity Discipline

The following remain research-stage until separately implemented, tested, versioned, observable, and reproducibly deployable:

- Quantum-OHI™ Kernel
- Harmonic Governance Engine™ (HGE™)
- Quantum Intent Field™ (QIF™)
- Quantum Intent Parser™
- Sentient Contract Router™ (SCR™)
- Q-Lattice Encryption Mesh™
- OBPID™ Biometric Privacy ID
- Quantum-Key Authentication (QKA-10™)
- other research interfaces not backed by verified runtime evidence

Planned interfaces remain roadmap intent and must not be represented as operational merely because they are documented in the Platform Directory.

## Recommended Request Path

```text
QuantumOHI Platform
        |
        v
identity-service
        |
        v
ohi-control-plane
        |
        v
approved execution gateway
        |
        v
approved adapter / runtime / service
        |
        v
structured result + audit metadata
```

## Repository Rule

The platform repository should contain:
- frontend/application code
- platform route registry
- Platform Directory and public-safe interface records
- developer and documentation UI
- marketplace/product UI
- integration clients
- public-safe schemas
- deployment configuration for the platform surface

It should not become a monorepo copy of every OHI service.

## Status

This contract aligns identity-service with `https://quantumohi.com` and the dedicated `ohi-stack/quantumohi-platform` application repository. The platform repository owns the application surface; this repository remains an independently deployable identity authority.
