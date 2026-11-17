# Implementation Plan: Order Cancellation

**Branch**: `[008-order-cancellation]` | **Date**: 2026-07-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-order-cancellation/spec.md`

## Summary

Allow a client to cancel an order that has not yet been delivered, changing its status to `CANCELADO` and initiating a full refund. Cancellation must be blocked for `ENTREGADO` and `COMPLETADO` orders, require explicit client confirmation in the UI, and record the cancellation timestamp and acting user. The backend will enforce ownership and state rules in the domain layer while the frontend will expose a confirmation flow from the existing order detail screen.

## Technical Context

**Language/Version**: Node.js 20+ (backend), React Native 0.81 / Expo 54 (frontend).

**Primary Dependencies**: Express 4, JWT auth via `jsonwebtoken`, React Native with Expo.

**Storage**: In-memory repository pattern (`backend/src/repositories/*`). No external database is used; data is held in runtime maps and seeded on startup.

**Testing**: Jest + Supertest on the backend; frontend has no configured test runner beyond lint/format.

**Target Platform**: Android/iOS mobile app (Expo) plus a local Express REST API.

**Project Type**: Web-service backend + mobile frontend.

**Performance Goals**: Cancellation API round-trip under 500 ms in local/dev conditions; order detail screen reflects the new status immediately after confirmation.

**Constraints**: Must reuse existing auth middleware (`backend/src/middleware/auth.js`) and in-memory repositories; must keep frontend compatible with Expo SDK 54 / React Native 0.81. The project currently uses mock data mode in the frontend (`USE_MOCK = true`); the plan must support both mock handlers and a real backend client.

**Scale/Scope**: Single-course demo app; expected concurrent usage is low. No need for distributed transactions or persistent refund queues in this iteration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/.specify/memory/constitution.md`) applies the following principles:

1. **Single Responsibility (I)**: Order cancellation logic MUST live in `PedidoService` / `Pedido` domain, not in controllers, routes, or UI. Refund initiation for this iteration is handled by a private method inside `PedidoService` to keep the design simple (KISS/YAGNI). If a future flow requires freelancer/admin approval, this private method is the natural extraction point for a dedicated `PaymentService`.
2. **Open/Closed (II)**: State transition rules MUST be encapsulated in the `Pedido` domain object so adding a new terminal state later does not require modifying services or controllers.
3. **Dependency Inversion (V)**: `PedidoService` MUST depend on repository interfaces, not concrete implementations. This is already the case for repositories.
4. **Repository Pattern (VI)**: All persistence MUST go through `PedidoRepository`. Cancellation metadata (`cancelledAt`, `cancelledBy`) will be persisted by updating the existing `Pedido` aggregate.
5. **Robustness (VIII)**: Invalid cancellation attempts MUST return clear, user-facing errors with appropriate HTTP status codes and defensive checks.
6. **Simplicity (X)**: No partial refunds, dispute flows, or notification subsystems will be added. Only full refunds and status changes are in scope.
7. **Testing (XVIII)**: Backend contract/integration tests are required for all cancellation paths.

**Gate result**: All principles can be met with the current two-tier stack. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/008-order-cancellation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/
│   │   └── Pedido.js            # extend with cancellation metadata + state guard
│   ├── repositories/
│   │   └── PedidoRepository.js  # reuse update method; persist cancellation fields
│   ├── services/
│   │   └── PedidoService.js     # add cancelOrder(clientId, orderId) with private refund helper
│   ├── controllers/
│   │   └── PedidoController.js  # add cancel(req, res, next)
│   ├── routes/
│   │   └── pedidos.js           # add POST /pedidos/:id/cancel (authenticated)
│   └── middleware/
│       └── auth.js              # reuse JWT middleware
└── tests/
    ├── contract/                # add cancellation auth/state contract tests
    └── integration/             # add cancellation integration tests

frontend/
├── src/
│   ├── hooks/
│   │   └── useOrders.js         # add cancelOrder(orderId) helper
│   ├── screens/
│   │   └── OrderDetailScreen.js # add cancel button + confirmation Alert
│   ├── services/
│   │   ├── apiClient.js         # reuse existing client
│   │   └── mockData.js          # add mock handler for POST /orders/:id/cancel
│   └── components/
│       └── StatusBadge.js       # ensure CANCELADO renders with red badge
└── tests/                        # no test runner configured; validate manually
```

**Structure Decision**: The project already separates backend (`backend/`) and frontend (`frontend/`). Cancellation reuses existing layers: domain model `Pedido`, repository `PedidoRepository`, service `PedidoService`, controller `PedidoController`, and route `/pedidos/:id/cancel` under the existing `pedidos.js` router. Refund initiation is implemented as a private helper inside `PedidoService` to keep the design simple; this helper is the natural extraction point for a future `PaymentService` if cancellation approval flows are added. The frontend extends `useOrders` and `OrderDetailScreen` rather than adding new screens.

## Complexity Tracking

No constitution violations required; all complexity fits within the existing two-project structure. Refund handling is intentionally kept inside `PedidoService` via a private helper to satisfy KISS/YAGNI. The helper is clearly identified as the future extraction point for a `PaymentService` if approval-based cancellation is introduced.
