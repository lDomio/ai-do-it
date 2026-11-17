# Implementation Plan: Place Gig Order

**Branch**: `[011-place-gig-order]` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-place-gig-order/spec.md`

## Summary

Enable authenticated customers to place an order for a Gig by selecting one of its packages and entering requirements. The implementation extends the existing `Pedido` domain, adds a dedicated authenticated `POST /pedidos/reservar` endpoint, enforces validation, and updates the React Native frontend to collect requirements and show a confirmation step before submission.

## Technical Context

**Language/Version**: JavaScript (Node.js) + JavaScript/JSX (React Native / Expo)

**Primary Dependencies**: Express, React Native (Expo), React Navigation

**Storage**: In-memory persistence via `Map`-based repositories

**Testing**: Jest / existing test tooling used in the project

**Target Platform**: Backend (Linux/macOS/Windows via Node.js), Frontend (iOS/Android via Expo)

**Project Type**: Two-tier web/mobile application (backend API + React Native client)

**Performance Goals**: Standard mobile API responsiveness (requests complete in under 500 ms for in-memory operations)

**Constraints**: In-memory storage only; no external database. Payment processing is out of scope.

**Scale/Scope**: Marketplace MVP with seeded demo data; supports the project's existing demo role switching.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Notes |
|-----------|------------|-------|
| I. SRP | Pass | Controllers handle HTTP, `PedidoService` owns placement business rules, repositories own persistence, screens own UI. |
| II. OCP | Pass | New placement endpoint and service method extend existing code; no modification required in cancellation or chat features. |
| III. LSP | Pass | No new subtypes introduced. Existing domain classes remain substitutable. |
| IV. ISP | Pass | Service interface remains focused on order operations. Frontend screens depend on `orderService` interface, not concrete fetch details. |
| V. DIP | Pass | `PedidoService` already depends on repository abstractions. New controller uses injected service. |
| VI. Design Patterns | Pass | Repository pattern already in use; placement reuses it. No speculative patterns introduced. |
| VII. Flexibility | Pass | Package selection and requirements are encapsulated; future order types can reuse `Pedido`. |
| VIII. Robustness | Pass | All external inputs validated; idempotency key guards duplicate submissions. |
| IX. Low Coupling | Pass | New feature communicates via existing `PedidoService`/`PedidoRepository` interfaces. |
| X. Simplicity | Pass | Minimal changes: extend domain, add endpoint/service method, add frontend modal/screen. |
| XI. High Cohesion | Pass | Order placement logic stays in the order domain and service. |
| XII. DRY | Pass | Validation helpers reused; gig/package lookup reused via existing services. |
| XIII. Concise Methods | Pass | New methods kept under 30 lines; helper methods used for validation. |
| XIV. No God Classes | Pass | Responsibilities split across `Pedido`, `PedidoService`, `PedidoController`, and frontend components. |
| XV. No Refused Bequest | Pass | No inheritance changes required. |

## Project Structure

### Documentation (this feature)

```text
specs/011-place-gig-order/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── place-order.md
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/
│   │   └── PedidoController.js          # add place() action
│   ├── services/
│   │   └── PedidoService.js              # add placeOrder() + helpers
│   ├── domain/
│   │   └── Pedido.js                     # add paqueteId, requerimientos
│   ├── repositories/
│   │   └── PedidoRepository.js           # no change required (generic create/update)
│   ├── routes/
│   │   └── pedidos.js                    # add POST /pedidos/reservar (authenticated)
│   └── middleware/
│       └── auth.js                       # already enforces JWT
└── tests/
    ├── unit/PedidoService.test.js
    └── contract/pedidos.test.js

frontend/
├── src/
│   ├── screens/
│   │   └── GigDetailScreen.js            # open requirements + confirmation flow
│   ├── components/
│   │   ├── OrderRequirementsModal.js   # requirements input (new)
│   │   └── OrderConfirmationModal.js   # confirmation summary (new)
│   ├── services/
│   │   └── orderService.js               # add placeOrder() (new)
│   ├── hooks/
│   │   └── useCreateOrder.js             # place order hook (new)
│   └── models/
│       └── order.js                      # optional mapping helpers
└── tests/
    └── components/OrderRequirementsModal.test.js
```

**Structure Decision**: Use the existing two-tier structure defined in the constitution. Extend backend order domain/service/controller/route and add two small frontend components plus a service/hook pair. No new top-level projects or shared state changes required.

## Complexity Tracking

No constitution violations require justification.
