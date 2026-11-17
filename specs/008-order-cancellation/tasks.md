# Tasks: Order Cancellation

**Input**: Design documents from `/specs/008-order-cancellation/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Backend contract tests are required per the implementation plan. Frontend validation is manual via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure the local environment is ready and existing project structure is confirmed for the cancellation feature.

- [x] T001 Verify Node.js 20+ and installed dependencies in `backend/` and `frontend/` per `quickstart.md` prerequisites
- [x] T002 Confirm backend runs at the configured base URL (`backend/src/server.js` and `frontend/src/context/ApiConfigContext.js`)
- [x] T003 Verify existing authentication endpoints (`backend/src/routes/auth.js`) can produce JWT tokens for test users

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the shared backend domain and repository for order cancellation before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Extend `EstadoPedido` enum in `backend/src/enums/EstadoPedido.js` to include `COMPLETADO` if not already present
- [x] T005 [P] Extend `Pedido` domain model in `backend/src/domain/Pedido.js` with `canceladoAt`, `canceladoPor`, and `reembolso` fields plus `puedeCancelar()` and `cancelar(clienteId)` methods
- [x] T006 [P] Update `PedidoRepository` in `backend/src/repositories/PedidoRepository.js` to persist cancellation metadata through the existing `update` method
- [x] T007 Add order ownership helper in `backend/src/services/PedidoService.js` to assert the authenticated user is the order's client
- [x] T008 Configure error handling for cancellation-specific failures (`404 Not Found`, `403 Forbidden`, `400 Bad Request`) using existing `backend/src/middleware/errorHandler.js`

**Checkpoint**: Foundation ready - domain, repository, and authorization primitives exist and are unit-testable independently.

---

## Phase 3: User Story 1 - Cancel an active order (Priority: P1) 🎯 MVP

**Goal**: A client viewing an order that has not been delivered can cancel it, changing the order status to `CANCELADO`.

**Independent Test**: `curl POST /pedidos/{orderId}/cancel` with a client token returns `200 OK`; the response body has `estado: 'Cancelado'`, `canceladoAt`, and `canceladoPor` equal to the client ID. The same call on an already-cancelled order returns the same order without re-processing. Calling it on `ENTREGADO`/`COMPLETADO` returns `400 Bad Request`.

### Tests for User Story 1

- [x] T009 [P] [US1] Write contract test `backend/tests/contract/cancel-order.test.js` asserting client can cancel a `PENDIENTE` order and response matches the API contract
- [x] T010 [P] [US1] Write contract test `backend/tests/contract/cancel-order-states.test.js` asserting cancellation is rejected for `ENTREGADO` and `COMPLETADO` orders
- [x] T011 [P] [US1] Write contract test `backend/tests/contract/cancel-order-auth.test.js` asserting unauthenticated and unauthorized users cannot cancel an order
- [x] T012 [P] [US1] Write contract test `backend/tests/contract/cancel-order-idempotent.test.js` asserting duplicate cancellation requests return the same order without creating a new refund

### Implementation for User Story 1

- [x] T013 [P] [US1] Implement `Pedido.puedeCancelar()` and `Pedido.cancelar(clienteId)` in `backend/src/domain/Pedido.js`
- [x] T014 [P] [US1] Implement private `#iniciarReembolso(pedido)` helper in `backend/src/services/PedidoService.js`
- [x] T015 [US1] Implement `PedidoService.cancelOrder(clientId, orderId)` in `backend/src/services/PedidoService.js` enforcing ownership, state rules, and refund creation
- [x] T016 [US1] Add `POST /pedidos/:id/cancel` route in `backend/src/routes/pedidos.js` wired to `PedidoController.cancel` with `authenticate` middleware
- [x] T017 [US1] Implement `PedidoController.cancel` in `backend/src/controllers/PedidoController.js` to extract `req.user.id`, call the service, and return the updated order
- [x] T018 [P] [US1] Add `cancelOrder(orderId)` helper in `frontend/src/hooks/useOrders.js` calling `apiClient.post('/orders/{orderId}/cancel', {})`
- [x] T019 [P] [US1] Add mock handler for `POST /orders/:id/cancel` in `frontend/src/services/mockData.js` validating ownership and state
- [x] T020 [US1] Add "Cancelar pedido" button and confirmation `Alert` in `frontend/src/screens/OrderDetailScreen.js` for eligible orders
- [x] T021 [US1] Update `frontend/src/screens/OrderDetailScreen.js` to hide the cancel button when order status is `ENTREGADO`, `COMPLETADO`, or `CANCELADO`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently via backend contract tests and the mobile quickstart scenario.

---

## Phase 4: User Story 2 - Receive a full refund on cancellation (Priority: P1)

**Goal**: When a paid order is cancelled, a full refund is initiated and visible to the client.

**Independent Test**: Cancel a paid order as the client. `curl POST /pedidos/{orderId}/cancel` returns an order with `reembolso.monto === total` and `reembolso.estado === 'INICIADO'`. For a zero-price order, no `reembolso` object is present.

### Tests for User Story 2

- [x] T022 [P] [US2] Write contract test `backend/tests/contract/cancel-order-refund.test.js` asserting paid orders receive a full refund record and zero-price orders do not

### Implementation for User Story 2

- [x] T023 [US2] Ensure `PedidoService.cancelOrder` creates a `reembolso` record in `backend/src/services/PedidoService.js` only when `total > 0`
- [x] T024 [US2] Update `Pedido.toJSON` in `backend/src/domain/Pedido.js` to expose `reembolso` when present
- [x] T025 [US2] Display refund information in `frontend/src/screens/OrderDetailScreen.js` when the order has a `reembolso` object
- [x] T026 [US2] Update mock handler in `frontend/src/services/mockData.js` to include `reembolso` in the cancelled order response

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently; refunds are created and displayed correctly.

---

## Phase 5: User Story 3 - Prevent cancellation after delivery (Priority: P1)

**Goal**: The system blocks cancellation for orders in `ENTREGADO` or `COMPLETADO` status, both in the API and in the UI.

**Independent Test**: Create orders with `ENTREGADO` and `COMPLETADO` statuses. `curl POST /pedidos/{orderId}/cancel` as the client returns `400 Bad Request` for both. In the app, the cancel button is hidden for both statuses.

### Tests for User Story 3

- [x] T027 [P] [US3] Write contract test `backend/tests/contract/cancel-order-terminal.test.js` asserting `ENTREGADO` and `COMPLETADO` orders cannot be cancelled

### Implementation for User Story 3

- [x] T028 [US3] Ensure `Pedido.puedeCancelar()` in `backend/src/domain/Pedido.js` returns `false` for `ENTREGADO` and `COMPLETADO` statuses
- [x] T029 [P] [US3] Verify `StatusBadge` component in `frontend/src/components/StatusBadge.js` renders `ENTREGADO` and `COMPLETADO` without showing a cancel action
- [x] T030 [US3] Confirm `frontend/src/screens/OrderDetailScreen.js` hides the cancel button for `ENTREGADO` and `COMPLETADO` orders
- [x] T031 [US3] Update mock handler in `frontend/src/services/mockData.js` to reject cancellation attempts on `ENTREGADO`/`COMPLETADO` orders

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve reliability, error handling, and consistency across all user stories.

- [x] T032 [P] Add Swagger documentation for `POST /pedidos/:id/cancel` in `backend/src/routes/pedidos.js`
- [x] T033 [P] Run backend linter and formatter: `cd backend && npm run lint && npm run format:check`
- [x] T034 [P] Run frontend linter and formatter: `cd frontend && npm run lint && npm run format:check`
- [x] T035 Execute all backend tests: `cd backend && npm test`
- [x] T036 Execute quickstart.md scenarios 1-7 with `curl` and the mobile simulator/device; mark the checklist in `specs/008-order-cancellation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed) because each has its own independent test criteria.
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Depends on US1 only because the cancellation flow must exist before refund display; however, the refund helper is independently testable by unit tests.
- **User Story 3 (P1)**: Can start after Foundational (Phase 2). Depends on US1 only because the cancellation guard must exist before testing blocked states.

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation.
- Models before services.
- Services before endpoints/controllers.
- Backend endpoints before frontend hook alignment.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational phase completes, US1, US2, and US3 can start in parallel if team capacity allows.
- All contract tests for a user story marked [P] can run in parallel.
- Backend service/controller tasks and frontend hook/screen tasks within the same story can run in parallel because they touch different files.

---

## Parallel Example: User Story 1

```bash
# Launch all contract tests for User Story 1 together:
Task: "T009 [P] [US1] Write contract test backend/tests/contract/cancel-order.test.js"
Task: "T010 [P] [US1] Write contract test backend/tests/contract/cancel-order-states.test.js"
Task: "T011 [P] [US1] Write contract test backend/tests/contract/cancel-order-auth.test.js"
Task: "T012 [P] [US1] Write contract test backend/tests/contract/cancel-order-idempotent.test.js"

# Launch backend and frontend implementation tasks together:
Task: "T013 [P] [US1] Implement Pedido.puedeCancelar() and Pedido.cancelar() in backend/src/domain/Pedido.js"
Task: "T014 [P] [US1] Implement private #iniciarReembolso helper in backend/src/services/PedidoService.js"
Task: "T015 [US1] Implement PedidoService.cancelOrder in backend/src/services/PedidoService.js"
Task: "T016 [US1] Add POST /pedidos/:id/cancel route in backend/src/routes/pedidos.js"
Task: "T017 [US1] Implement PedidoController.cancel in backend/src/controllers/PedidoController.js"
Task: "T018 [P] [US1] Add cancelOrder helper in frontend/src/hooks/useOrders.js"
Task: "T019 [P] [US1] Add mock handler in frontend/src/services/mockData.js"
Task: "T020 [US1] Add cancel button and Alert in frontend/src/screens/OrderDetailScreen.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1 (basic cancellation flow with state guards and idempotency).
4. **STOP and VALIDATE**: Run contract tests and quickstart scenario 1.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Add User Story 3 → Test independently → Deploy/Demo.
5. Complete Polish phase → final lint, tests, and quickstart validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (backend cancellation + frontend button)
   - Developer B: User Story 2 (refund record + UI display)
   - Developer C: User Story 3 (terminal state blocking)
3. Stories complete and integrate independently; final Polish phase is shared.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Verify contract tests fail before implementing.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid vague tasks, same-file conflicts, and cross-story dependencies that break independence.
