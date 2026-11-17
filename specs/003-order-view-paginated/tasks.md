# Tasks: Visualización Paginada de Pedidos

**Input**: Design documents from `/specs/003-order-view-paginated/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/pedidos-api.md, research.md

**Tests**: Not explicitly requested in feature specification. Omitted per policy.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new setup required — project structure, dependencies, and configuration already exist

_(No tasks — skip to Phase 2)_

---

## Phase 2: Foundational (Backend Pagination Endpoint)

**Purpose**: Backend endpoint that returns paginated, client-filtered orders. ALL frontend user stories depend on this.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Add `findByCliente(clientId, page, pageSize)` method to `backend/src/repositories/PedidoRepository.js` — filter by `pedido.cliente === clientId`, slice for pagination, return `{ items, totalItems, currentPage, totalPages }`
- [x] T002 [P] Add `countByCliente(clientId)` method to `backend/src/repositories/PedidoRepository.js` — return total count of orders for a client
- [x] T003 Add `findByCliente(clientId, page, pageSize)` method to `backend/src/services/PedidoService.js` — delegate to repository, calculate `diasEntregaRestantes` for confirmed orders using `SLA_DAYS = 5`
- [x] T004 Add `findByCliente(req, res)` method to `backend/src/controllers/PedidoController.js` — extract `clienteId` from params, `page` from query, call service, handle errors
- [x] T005 Add `GET /cliente/:clienteId` route with `authenticate` middleware to `backend/src/routes/pedidos.js` — mount before existing `/:id` route to avoid param conflict

**Checkpoint**: Backend pagination endpoint functional — testable via curl with auth token

---

## Phase 3: User Story 1 — Paginated Order List (Priority: P1) 🎯 MVP

**Goal**: Client views paginated list of their orders with page navigation controls

**Independent Test**: Create 15+ test orders for a client, navigate to orders screen, verify 10 orders on page 1, navigate to page 2, verify remaining orders, verify empty state for client with no orders

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `getWithParams(path, params)` method in `frontend/src/services/apiClient.js` — extends existing `get` to support query parameters via URLSearchParams
- [x] T007 [P] [US1] Create `usePedidos(page)` hook in `frontend/src/hooks/usePedidos.js` — calls `GET /pedidos/mis-pedidos?page=N`, returns `{ pedidos, totalItems, totalPages, currentPage, loading, error, goToPage }`
- [x] T008 [P] [US1] Create `PaginationControls` component in `frontend/src/components/PaginationControls.js` — renders "Página X de Y" text, "Anterior"/"Siguiente" buttons with disabled states
- [x] T009 [P] [US1] Create `OrderCard` component in `frontend/src/components/OrderCard.js` — displays order ID, gig, total, creation date using `AppCard` and `AppText` primitives (no status badge yet)
- [x] T010 [US1] Create `OrderListScreen` in `frontend/src/features/orders/OrderListScreen.js` — uses `usePedidos` hook, renders list of `OrderCard` components, shows `PaginationControls`, handles loading/error/empty states
- [x] T011 [US1] Create orders feature directory `frontend/src/features/orders/` if not exists

**Checkpoint**: User Story 1 fully functional — client sees paginated orders with navigation

---

## Phase 4: User Story 2 — Status Badge Display (Priority: P2)

**Goal**: Each order displays a color-coded status badge matching its `EstadoPedido` value

**Independent Test**: Create orders in all 5 statuses, verify each displays correct badge color and Spanish label

### Implementation for User Story 2

- [x] T012 [P] [US2] Create `StatusBadge` component in `frontend/src/components/StatusBadge.js` — accepts `estado` prop, renders colored badge with Spanish label using status-to-color map
- [x] T013 [US2] Integrate `StatusBadge` into `OrderCard` component in `frontend/src/components/OrderCard.js` — add badge display below order info

**Checkpoint**: User Stories 1 AND 2 both functional — orders display with status badges

---

## Phase 5: User Story 3 — Delivery Estimate for Confirmed Orders (Priority: P3)

**Goal**: Confirmed orders display estimated delivery days; non-confirmed orders show no estimate

**Independent Test**: Create confirmed orders with different confirmation dates, verify delivery estimate text; verify no estimate on non-confirmed orders

### Implementation for User Story 3

- [x] T014 [US3] Add delivery estimate display to `OrderCard` in `frontend/src/components/OrderCard.js` — show "Entrega estimada en {N} días" or "Entrega estimada hoy" when `diasEntregaRestantes` is present in pedido data

**Checkpoint**: All 3 user stories functional — paginated list with badges and delivery estimates

---

## Phase 5B: Freelancer Gig Orders View (Shared Use Case)

**Goal**: Freelancer views paginated orders associated with a specific Gig, with status badges and time estimates

**Independent Test**: Create orders for a gig, call `GET /pedidos/gig/:gigId`, verify paginated results with status badges and delivery estimates

### Implementation for Freelancer View

- [x] T-F1 [P] Add `findByGig(gigId, page, pageSize)` method to `backend/src/repositories/PedidoRepository.js` — filter by `pedido.gig === gigId`, slice for pagination
- [x] T-F2 [P] Add `findByGig(gigId, page, pageSize)` method to `backend/src/services/PedidoService.js` — delegate to repository
- [x] T-F3 [P] Add `findByGig(req, res)` method to `backend/src/controllers/PedidoController.js` — extract `gigId` from params, use `#agregarEstimacion` helper
- [x] T-F4 Add `GET /gig/:gigId` route with `authenticate` middleware to `backend/src/routes/pedidos.js` — mount before `/:id` route

**Checkpoint**: Freelancer can query orders by Gig with same pagination/status/estimate features

---

## Phase 5C: Security — IDOR Prevention

**Goal**: Prevent users from querying other users' data by extracting IDs from JWT token instead of URL params

**Independent Test**: Client calls `GET /pedidos/mis-pedidos` — sees only their own orders; Freelancer calls `GET /pedidos/gig/:gigId` for a gig they don't own — gets 403

### Implementation for Security

- [x] T-S1 Add `vendedor` getter to `backend/src/domain/Gig.js` — expose private `#vendedor` field
- [x] T-S2 Inject `GigService` into `PedidoController` constructor — enable gig ownership validation
- [x] T-S3 Refactor `PedidoController.findByCliente` — read `req.user.id` from JWT instead of `req.params.clienteId`
- [x] T-S4 Refactor `PedidoController.findByGig` — validate `gig.vendedor === req.user.id`, return 403 if not owner
- [x] T-S5 Rename route `GET /cliente/:clienteId` → `GET /mis-pedidos` in `backend/src/routes/pedidos.js`
- [x] T-S6 Rename `#service` → `#pedidoService`, add `#gigService` in `PedidoController` — follow SRP

**Checkpoint**: IDOR prevention active — users can only access their own data

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Navigation integration and edge case handling

- [x] T015 Add navigation to OrderListScreen from HomeScreen in `frontend/src/features/home/HomeScreen.js` — add button or link to navigate to orders screen
- [x] T016 Verify empty state message "No tienes pedidos aún" displays correctly when client has no orders
- [x] T017 Verify edge case: text truncation for long order titles in `OrderCard` component

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skipped — project already initialized
- **Foundational (Phase 2)**: No dependencies — starts immediately. **BLOCKS all user stories**
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (backend endpoint)
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (OrderCard exists)
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (OrderCard exists)
- **Freelancer View (Phase 5B)**: Depends on Phase 2 completion (same backend infrastructure)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 3 — integrates into OrderCard from US1
- **User Story 3 (P3)**: Can start after Phase 3 — integrates into OrderCard from US1

### Within Each User Story

- Parallel tasks marked [P] create independent files
- Components before screen (dependencies flow bottom-up)
- Hook before screen (screen depends on hook)

### Parallel Opportunities

- **Phase 2**: T001 and T002 can run in parallel (different methods, same file — but separate concerns)
- **Phase 3**: T006, T007, T008, T009 can all run in parallel (different files, no dependencies)
- **Phase 4**: T012 can run independently
- **Phase 5**: T014 depends on T009 (OrderCard must exist)
- **Phase 5B**: T-F1, T-F2, T-F3, T-F4 can all run in parallel (different files, no dependencies)

---

## Parallel Example: User Story 1

```bash
# Launch all parallel US1 tasks together:
Task: "Create getWithParams method in frontend/src/services/apiClient.js"
Task: "Create usePedidos hook in frontend/src/hooks/usePedidos.js"
Task: "Create PaginationControls component in frontend/src/components/PaginationControls.js"
Task: "Create OrderCard component in frontend/src/components/OrderCard.js"

# Then sequential (depends on above):
Task: "Create OrderListScreen in frontend/src/features/orders/OrderListScreen.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (backend endpoint)
2. Complete Phase 3: User Story 1 (paginated list)
3. **STOP and VALIDATE**: Test via curl + frontend screen
4. Deploy/demo if ready

### Incremental Delivery

1. Phase 2 → Backend endpoint ready → Test via curl
2. Phase 3 → Paginated list screen → MVP deployable
3. Phase 4 → Status badges → Enhanced UX
4. Phase 5 → Delivery estimates → Full feature
5. Phase 6 → Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend `Pedido` domain model IS modified — delivery estimation logic lives in the domain (Principle I. SRP)
- Auth middleware (`authenticate`) is imported from existing `middleware/auth.js`
- Frontend uses existing `AppCard`, `AppText`, `AppButton` shared primitives
