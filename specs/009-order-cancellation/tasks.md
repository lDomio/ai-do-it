# Tasks: Order Cancellation by Client and Admin

**Input**: Design documents from `/specs/009-order-cancellation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks are included per project constitution Testing Discipline (every service class must have unit tests; critical user journeys must have end-to-end/integration tests).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add minimal shared infrastructure required for the cancellation feature within the existing project.

- [x] T001 Add `OrderStatus` enum values in `backend/src/enums/orderStatus.js` (ensure `cancelled` exists alongside existing statuses)
- [x] T002 Add cancellation-specific error classes in `backend/src/errors/orderErrors.js` (`OrderAlreadyDeliveredError`, `OrderAlreadyCancelledError`, `OrderNotFoundError`, `OrderCancellationForbiddenError`)
- [x] T003 [P] Create `OrderCancelled` domain event definition in `backend/src/events/orderEvents.js`
- [x] T004 Wire the `OrderCancelled` event emitter into the existing event bus or as a standalone module in `backend/src/events/index.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend components that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 [P] Extend `Order` model/factory in `backend/src/models/order.js` to support `cancelledBy`, `cancelledByRole`, and `cancelledAt` fields
- [x] T006 [P] Extend `OrderRepository` interface and in-memory implementation in `backend/src/repositories/orderRepository.js` to update an order with cancellation metadata
- [x] T007 Add order ownership and role helper in `backend/src/services/orderService.js` or dedicated `backend/src/domain/orderPermissions.js`
- [x] T008 Implement `cancelOrder` core logic in `backend/src/services/orderService.js` covering status check, authorization, metadata recording, and event emission
- [x] T009 Add `POST /orders/:id/cancel` route in `backend/src/routes/orders.js` using existing auth middleware
- [x] T010 Add `cancelOrder` controller action in `backend/src/controllers/orderController.js` mapping service errors to HTTP responses per contract

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Client cancels an order before delivery (Priority: P1) 🎯 MVP

**Goal**: A client who owns an order can cancel it when the order status is not `delivered`.

**Independent Test**: A client authenticates, calls `POST /orders/:id/cancel` for their own non-delivered order, receives `200 OK` with `status: cancelled` and `cancelledByRole: client`. Calling the same endpoint on a delivered order returns `400 OrderAlreadyDelivered`.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation.**

- [x] T011 [P] [US1] Unit test for `orderService.cancelOrder` success when client owns a pending order in `backend/tests/unit/orderService.test.js`
- [x] T012 [P] [US1] Unit test for `orderService.cancelOrder` rejection when order status is `delivered` in `backend/tests/unit/orderService.test.js`
- [x] T013 [P] [US1] Unit test for `orderController.cancelOrder` mapping to success and error responses in `backend/tests/unit/orderController.test.js`
- [x] T014 [US1] Integration test for client cancellation success and delivered-order rejection in `backend/tests/integration/orderCancellation.test.js`

### Implementation for User Story 1

- [x] T015 [P] [US1] Add `CancelOrderButton` component in `frontend/src/components/CancelOrderButton.js`
- [x] T016 [P] [US1] Add `useCancelOrder` hook in `frontend/src/hooks/useCancelOrder.js` calling the backend cancel endpoint (cubierto por `useOrder` existente)
- [x] T017 [US1] Add cancel action and error handling to `OrderDetailScreen.js` in `frontend/src/screens/OrderDetailScreen.js`
- [x] T018 [US1] Add cancel endpoint method to `frontend/src/services/orderService.js` (cubierto por `useOrder` / `apiClient` existente)
- [x] T019 [US1] Display cancellation metadata (who cancelled, when) on `OrderDetailScreen.js` for cancelled orders

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Admin cancels any non-delivered order (Priority: P1)

**Goal**: An administrator can cancel any non-delivered order, and the order's client is notified when this happens.

**Independent Test**: An admin authenticates, calls `POST /orders/:id/cancel` for an order owned by another client, receives `200 OK` with `status: cancelled` and `cancelledByRole: admin`, and the client receives a notification.

### Tests for User Story 2 ⚠️

- [x] T020 [P] [US2] Unit test for `orderService.cancelOrder` success when caller is admin in `backend/tests/unit/orderService.test.js`
- [x] T021 [P] [US2] Unit test for notification handler being invoked when admin cancels in `backend/tests/unit/orderService.test.js`
- [x] T022 [US2] Integration test for admin cancellation and client notification in `backend/tests/integration/orderCancellation.test.js`

### Implementation for User Story 2

- [x] T023 [US2] Add admin notification handler listening to `OrderCancelled` event in `backend/src/events/handlers/notifyClientOnAdminCancellation.js`
- [x] T024 [US2] Register the admin-cancellation notification handler in the event wiring file `backend/src/events/index.js`
- [x] T025 [US2] Expose admin-facing cancel button on `OrderDetailScreen.js` when the current user has role `admin`
- [x] T026 [US2] Add admin-specific confirmation copy in `frontend/src/components/CancelOrderButton.js`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Order owner and role are validated (Priority: P2)

**Goal**: Only the order owner or an admin can cancel an order; other users are rejected.

**Independent Test**: A different client authenticates, calls `POST /orders/:id/cancel` for an order they do not own, and receives `403 Forbidden` with the contract error payload.

### Tests for User Story 3 ⚠️

- [x] T027 [P] [US3] Unit test for `orderService.cancelOrder` rejection when caller is neither owner nor admin in `backend/tests/unit/orderService.test.js`
- [x] T028 [P] [US3] Unit test for `orderController.cancelOrder` returning `403 Forbidden` on authorization failure in `backend/tests/unit/orderController.test.js`
- [x] T029 [US3] Integration test for unauthorized cancellation attempt in `backend/tests/integration/orderCancellation.test.js`

### Implementation for User Story 3

- [x] T030 [US3] Ensure the existing auth middleware attaches user id and role to the request in `backend/src/middleware/auth.js`
- [x] T031 [US3] Hide or disable the cancel button in `frontend/src/components/CancelOrderButton.js` when the current user is neither the order owner nor an admin
- [x] T032 [US3] Add frontend error handling in `frontend/src/hooks/useCancelOrder.js` for `403 Forbidden` responses (cubierto por `useOrder` / `CancelOrderButton`)

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure production readiness.

- [x] T033 [P] Run quickstart validation steps from `specs/009-order-cancellation/quickstart.md`
- [ ] T034 [P] Add/update frontend tests for `CancelOrderButton` behavior in `frontend/tests/unit/CancelOrderButton.test.js` (pendiente - no hay infraestructura de tests frontend configurada)
- [x] T035 Update project documentation or README if cancellation endpoint usage changed
- [x] T036 Run backend test suite and fix any regressions
- [x] T037 Verify cancellation metadata is visible in order list/order detail screens
- [x] T038 [P] Code review check: ensure no service method exceeds 30 lines and no function exceeds 4 parameters

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed).
  - Or sequentially in priority order (US1 → US2 → US3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories. This is the MVP.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Depends on the same `cancelOrder` service used by US1.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Reuses the auth and permission checks already exercised by US1/US2.

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD encouraged).
- Models/repositories before service logic.
- Service logic before controller and route.
- Route before frontend service/hook/screen.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks (T001-T004) marked [P] can run in parallel.
- Foundational model, repository, route, controller, and service tasks (T005-T010) can be worked on in parallel once interfaces are agreed.
- All tests for a single user story marked [P] can run in parallel.
- Backend work for US1 and US2 can be done in parallel after the foundational service method supports both roles.
- Frontend work for US1 and US2 can proceed in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all backend tests for User Story 1 together:
Task: "T011 Unit test for orderService.cancelOrder success when client owns a pending order"
Task: "T012 Unit test for orderService.cancelOrder rejection when order status is delivered"
Task: "T013 Unit test for orderController.cancelOrder mapping"
Task: "T014 Integration test for client cancellation success and delivered-order rejection"

# Launch all frontend models/components for User Story 1 together:
Task: "T015 Add CancelOrderButton component"
Task: "T016 Add useCancelOrder hook"
Task: "T018 Add cancel endpoint method to frontend orderService.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1 (client cancels own non-delivered order).
4. **STOP and VALIDATE**: Run quickstart steps 1, 3, and 5.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo.
4. Add User Story 3 → Test independently → Deploy/Demo.
5. Complete Polish phase.
6. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 frontend + integration tests.
   - Developer B: User Story 2 notification handler + admin UI.
   - Developer C: User Story 3 authorization edge cases + frontend guards.
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story is independently completable and testable.
- Verify tests fail before implementing.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
