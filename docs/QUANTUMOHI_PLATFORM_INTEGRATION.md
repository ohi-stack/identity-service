# QuantumOHI Platform Integration Contract

## Canonical Platform Boundary

The QuantumOHI Platform is the public/application surface for governed intelligence, systems, standards, verification, execution access, developer tooling, and commercial platform workflows.

Current preview/application surface:
- https://quantumohi-platform.onegodian.chatgpt.site

Canonical application repository:
- `ohi-stack/quantumohi-platform`

The target repository is intentionally separate from service/runtime repositories.

## Service Boundary

QuantumOHI Platform must consume services through documented interfaces. It must not absorb their implementation code.

- `ohi-stack/identity-service` — identity, authentication, tenant-aware authorization context
- `ohi-stack/execution-interface` — governed execution interface/runtime boundary
- `ohi-stack/ohi-control-plane` — policy, governance, approval, risk, and execution authorization
- QR-V repositories — verification, registry, SDK, explorer, status, security, billing, and developer services where integrated

## Platform Rules

1. Human authority remains above models, tools, workflows, and adapters.
2. Platform UI must not imply that research-stage components are production runtimes.
3. Research, planned, beta, and production capabilities must be labeled distinctly.
4. Services remain independently deployable and versioned.
5. No duplicated service logic in the platform frontend.
6. Authentication, policy evaluation, execution, and verification must cross explicit API/service boundaries.
7. Audit identifiers and execution records should be preserved end-to-end where supported.

## Maturity Discipline

The following remain research-stage until separately implemented, tested, versioned, observable, and reproducibly deployable:

- Quantum-OHI™ Kernel
- Harmonic Governance Engine™ (HGE™)
- other research interfaces not backed by verified runtime evidence

The documented OHI Execution Gateway milestone establishes a functioning governed execution surface, but it does not by itself prove completion of the full Quantum-OHI™ Kernel or HGE™.

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
execution-interface / OHI Execution Gateway
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
- developer and documentation UI
- marketplace/product UI
- integration clients
- public-safe schemas
- deployment configuration for the platform surface

It should not become a monorepo copy of every OHI service.

## Status

This contract aligns this service with the dedicated `ohi-stack/quantumohi-platform` application repository. The platform repository is now established and owns the application surface; this repository remains an independently deployable service.
