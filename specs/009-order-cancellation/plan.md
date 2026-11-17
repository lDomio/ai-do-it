# Implementation Plan: Order Cancellation by Client and Admin

**Branch**: `009-order-cancellation` | **Date**: 2026-07-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-order-cancellation/spec.md`

## Summary

Add the ability for the client who owns an order and for administrators to cancel an order at any time before it reaches the "Delivered" status. The implementation is confined to an existing Node.js + Express backend and a React Native (Expo) frontend, using in-memory persistence. The design validates cancellation eligibility and authorization in the backend service layer, records cancellation metadata, and notifies the client when an admin performs the cancellation.

## Technical Context

| Item | Value |
|------|-------|
| Language/Version | JavaScript/TypeScript (Node.js runtime for backend, React Native/Expo for frontend) |
| Primary Dependencies | Express (backend), React Native + React Navigation (frontend) |
| Storage | In-memory persistence (as per project constitution) |
| Testing | Jest-style unit and integration tests (`*.test.js` / `*.spec.js`) |
| Target Platform | Backend: Node.js server. Frontend: Android/iOS via Expo. |
| Project Type | Two-tier web/mobile application (backend + React Native frontend) |
| Performance Goals | Standard synchronous REST response times (< 500 ms for cancellation endpoint) |
| Constraints | In-memory storage; no transactions; race-condition window considered negligible for current scale. |
| Scale/Scope | Existing freelancer marketplace scope, supporting gig search, packages, orders, and chat. |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | How the plan complies | Violations |
|-----------|----------------------|------------|
| I. SRP | `OrderService` handles cancellation logic; controllers handle HTTP; repositories handle persistence; notification handler handles client notification. | None |
| II. OCP | New cancellation logic is added as new service method, route, and handler; existing order delivery or status code is not modified. | None |
| III. LSP | No inheritance introduced; repository interfaces remain stable. | None |
| IV. ISP | Controllers depend only on order-related service and repository interfaces; no fat interfaces. | None |
| V. DIP | `OrderService` depends on `OrderRepository` interface, not concrete in-memory store. | None |
| VI. Patterns | Repository and Observer patterns are used as required. No speculative patterns. | None |
| VII. Flexibility | Cancellation is isolated behind service and repository interfaces; future payment reversal can be added as a new handler. | None |
| VIII. Robustness | All inputs validated: existence, ownership, role, status. Error responses are user-friendly. | None |
| IX. Low Coupling | Notification is triggered by event; cancellation service does not know notification details. | None |
| X. Simplicity | No transactions, locks, or audit tables added beyond what is required. | None |
| XI. High Cohesion | All cancellation rules, metadata, and state transitions live with Order domain. | None |
| XII. DRY | Validation logic is centralized in the cancellation service; ownership/role checks are not duplicated in route code. | None |
| XIII. Concise Methods | Service methods will be decomposed into small helpers if they exceed 30 lines. | None |
| XIV. No God Classes | No class accumulates new responsibilities; `OrderService` stays focused on order operations. | None |
| XV. No Refused Bequest | No new inheritance introduced. | None |

## Project Structure

### Documentation (this feature)

```text
specs/009-order-cancellation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── cancel-order.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/
│   │   └── orderController.js        # Cancel endpoint handler
│   ├── services/
│   │   └── orderService.js         # Cancellation business logic
│   ├── repositories/
│   │   └── orderRepository.js      # Order persistence interface + in-memory impl
│   ├── models/
│   │   └── order.js                # Order domain entity / factory
│   ├── middleware/
│   │   └── auth.js                 # JWT/session auth + role extraction
│   ├── routes/
│   │   └── orders.js               # POST /orders/:id/cancel route
│   └── events/
│       └── orderEvents.js          # OrderCancelled event emitter
└── tests/
    ├── unit/
    │   ├── orderService.test.js
    │   └── orderController.test.js
    └── integration/
        └── orderCancellation.test.js

frontend/
├── src/
│   ├── screens/
│   │   └── OrderDetailScreen.js    # Cancel button + confirmation dialog
│   ├── components/
│   │   └── CancelOrderButton.js    # Reusable cancellation trigger
│   ├── services/
│   │   └── orderService.js         # API client for cancel endpoint
│   ├── hooks/
│   │   └── useCancelOrder.js       # Cancellation mutation hook
│   └── models/
│       └── order.js                # Frontend order types/status enum
└── tests/
    └── unit/
        └── CancelOrderButton.test.js
```

**Structure Decision**: The existing two-tier structure (backend + React Native frontend) defined in the constitution is reused. Cancellation fits entirely within the Order domain, so no new top-level directories are introduced.

## Complexity Tracking

> No constitution violations identified; complexity tracking table not needed.
