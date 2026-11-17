# Implementation Plan: Order Delivery Chat

**Branch**: `[007-order-delivery-chat]` | **Date**: 2026-07-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-order-delivery-chat/spec.md`

## Summary

Add an order-scoped chat so the client and freelancer can exchange text messages from within the order detail screen. The backend will store messages tied to a `Pedido`, enforce that only the two parties can read or write, and expose REST endpoints for listing and creating messages. The mobile frontend already has a partial chat UI and hook (`useOrderChat` / `OrderDetailScreen`) that will be aligned with the new contract and completed with validation, loading states, and graceful error handling. Real-time updates are out of scope for this plan; polling or refresh is acceptable per the spec's P3 story.

## Technical Context

**Language/Version**: Node.js 20+ (backend), React Native 0.81 / Expo 54 (frontend).

**Primary Dependencies**: Express 4, JWT auth via `jsonwebtoken`, React Native with Expo.

**Storage**: In-memory repository pattern (`backend/src/repositories/*`). No external database is used; data is held in runtime maps and seeded on startup.

**Testing**: Jest + Supertest on the backend; frontend has no configured test runner beyond lint/format.

**Target Platform**: Android/iOS mobile app (Expo) plus a local Express REST API.

**Project Type**: Web-service backend + mobile frontend.

**Performance Goals**: Chat list loads in under 1 second for typical order histories (< 200 messages); message send round-trip under 500 ms in local/dev conditions.

**Constraints**: Must reuse existing auth middleware (`backend/src/middleware/auth.js`) and in-memory repositories; must keep frontend compatible with Expo SDK 54 / React Native 0.81.

**Scale/Scope**: Single-course demo app; expected concurrent usage is low. No need for horizontal scaling, WebSockets, or persistent queues in this iteration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No `.specify/memory/constitution.md` file exists, so no project-specific constitution gates apply. The following self-imposed guardrails are used:

1. **Reuse existing architecture**: Chat must fit into the current service/repository/domain layering and in-memory store; do not introduce a database or message broker.
2. **No production-only tech**: Do not add WebSockets, Redis, or push notifications because the project stack and scope do not support them.
3. **Auth-first**: All chat endpoints must be authenticated and authorization-checked against the order's client and freelancer.
4. **Frontend alignment**: Use the existing `useOrderChat` hook and `OrderDetailScreen` layout; extend rather than rewrite.
5. **Testing**: Backend contract tests are required; frontend validation is manual via the quickstart scenarios.

All guardrails can be met with the current stack.

## Project Structure

### Documentation (this feature)

```text
specs/007-order-delivery-chat/
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
│   │   └── Mensaje.js            # extend to support pedido, timestamps, senderType
│   ├── repositories/
│   │   └── MensajeRepository.js  # add findByPedidoId, create scoped to pedido
│   ├── services/
│   │   └── MensajeService.js     # add order-scoped send/list with auth checks
│   ├── controllers/
│   │   └── MensajeController.js  # add endpoints for pedido messages
│   ├── routes/
│   │   └── pedidos.js            # add /pedidos/:id/messages routes
│   └── middleware/
│       └── auth.js               # reuse JWT middleware
└── tests/
    └── contract/                 # add message contract tests

frontend/
├── src/
│   ├── hooks/
│   │   └── useOrderChat.js       # align with backend contract + error/retry states
│   ├── screens/
│   │   └── OrderDetailScreen.js  # complete chat UI (loading, empty, retry)
│   └── services/
│       └── apiClient.js          # reuse existing HTTP client
└── tests/                        # no test runner configured; validate manually
```

**Structure Decision**: The project already separates backend (`backend/`) and frontend (`frontend/`). Chat reuses existing layers: domain model `Mensaje`, repository `MensajeRepository`, service `MensajeService`, controller `MensajeController`, and route `/pedidos/:id/messages` under the existing `pedidos.js` router. The frontend already has `useOrderChat` and `OrderDetailScreen` chat UI, so the plan extends those files rather than adding new screens.

## Complexity Tracking

No constitution violations required; all complexity fits within the existing two-project structure.
