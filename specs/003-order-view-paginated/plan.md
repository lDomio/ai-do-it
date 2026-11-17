# Implementation Plan: Visualización Paginada de Pedidos

**Branch**: `003-order-view-paginated` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-order-view-paginated/spec.md`

## Summary

Add paginated order list view for clients with status badges (color-coded per `EstadoPedido`) and delivery estimate display for confirmed orders. Backend already has full CRUD for `Pedido` — requires adding pagination endpoint and auth middleware. Frontend has no order screens — requires new feature screen, order list component, status badge component, and pagination controls.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js 18+ / React Native (Expo SDK 57)

**Primary Dependencies**: Backend: Express 4.21, jsonwebtoken 9.0.2, bcryptjs 2.4.3 | Frontend: React Native 0.76+, React Navigation 7.3

**Storage**: In-memory (Map-based repositories, no database)

**Testing**: Jest 30.4 (backend), no test framework configured for frontend yet

**Target Platform**: Web (backend API) + Mobile/Tablet (React Native Expo)

**Project Type**: Web application (two-tier: REST API backend + React Native frontend)

**Performance Goals**: Order list loads within 2 seconds; pagination response under 500ms

**Constraints**: In-memory storage; no database; existing CRUD patterns must be followed; auth middleware exists but is not applied to pedidos routes

**Scale/Scope**: Single-page order list with 3 new frontend components, 2 modified backend files, 1 new backend service method

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. SRP | ✅ PASS | Each new component handles one concern: OrderListScreen (layout), OrderCard (display), StatusBadge (status display), PedidoService (business logic) |
| II. OCP | ✅ PASS | New functionality added via new files; existing PedidoController/Service/Repository extended, not modified |
| III. LSP | ✅ PASS | No new type hierarchies introduced |
| IV. ISP | ✅ PASS | Each component has a focused interface; API response only includes fields the client needs |
| V. DIP | ✅ PASS | OrderListScreen depends on service interface; backend service depends on repository interface |
| VI. Patterns | ✅ PASS | Repository Pattern already in use; no new patterns needed |
| VII. Flexibility | ✅ PASS | Delivery SLA is configurable constant; page size is parameterized |
| VIII. Robustness | ✅ PASS | Empty state handled; error states handled; null checks on API responses |
| IX. Low Coupling | ✅ PASS | New feature is isolated; no changes to unrelated modules |
| X. Simplicity | ✅ PASS | Straightforward CRUD extension; no speculative infrastructure |
| XI. High Cohesion | ✅ PASS | Order-related code lives in feature directory; no utility sprawl |
| XII. DRY | ✅ PASS | Status badge logic in one component; pagination logic in one hook/component |
| XIII. Concise Methods | ✅ PASS | All methods under 30 lines; controller methods are thin |
| XIV. No God Classes | ✅ PASS | No class exceeds 200 lines or 3 responsibilities |
| XV. No Refused Bequest | ✅ PASS | No inheritance hierarchies introduced |

**GATE RESULT**: ✅ All principles satisfied. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/003-order-view-paginated/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── pedidos-api.md   # API contract for paginated orders
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Backend (existing — modified files marked with *)
backend/
├── src/
│   ├── controllers/
│   │   └── PedidoController.js      # * Add findByCliente method
│   ├── services/
│   │   └── PedidoService.js         # * Add findByCliente with pagination logic
│   ├── repositories/
│   │   └── PedidoRepository.js      # * Add findByCliente and countByCliente methods
│   ├── domain/
│   │   └── Pedido.js                # (no changes — domain model not integrated)
│   ├── enums/
│   │   └── EstadoPedido.js          # (no changes)
│   ├── middleware/
│   │   └── auth.js                  # (no changes — already exports authenticate)
│   └── routes/
│       ├── pedidos.js               # * Add GET /cliente/:clienteId route
│       └── index.js                 # (no changes — pedidos already mounted)
└── tests/

# Frontend (new files)
frontend/
├── src/
│   ├── features/
│   │   ├── home/
│   │   │   └── HomeScreen.js        # * Add navigation to orders screen
│   │   └── orders/                  # NEW feature directory
│   │       └── OrderListScreen.js   # NEW: Main screen with pagination
│   ├── components/
│   │   ├── OrderCard.js             # NEW: Individual order display card
│   │   ├── StatusBadge.js           # NEW: Colored status badge
│   │   └── PaginationControls.js    # NEW: Page navigation buttons
│   ├── hooks/
│   │   └── usePedidos.js            # NEW: Data fetching hook with pagination
│   ├── services/
│   │   └── apiClient.js             # * Add getWithParams method for query params
│   ├── shared/
│   │   ├── AppCard.js               # (no changes)
│   │   ├── AppText.js               # (no changes)
│   │   └── AppButton.js             # (no changes)
│   └── context/
│       └── ApiConfigContext.js       # (no changes)
└── tests/
```

**Structure Decision**: Two-tier architecture (backend API + React Native frontend) per constitution XVI. New frontend code follows feature-based organization (`features/orders/`). Backend extends existing `Pedido` layer with minimal changes (no new files, only method additions).

## Complexity Tracking

> No constitution violations to justify. All principles satisfied.
