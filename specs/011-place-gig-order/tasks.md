# Tasks: Place Gig Order

**Input**: Design documents from `/specs/011-place-gig-order/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the feature branch.

- [x] T001 Create feature branch `011-place-gig-order` from `develop`
- [x] T002 [P] Update `.specify/feature.json` to point to `specs/011-place-gig-order`
- [x] T003 [P] Verify backend and frontend dev servers start cleanly on the branch

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend and frontend infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Extend `Pedido` domain model in `backend/src/domain/Pedido.js` to include `paqueteId` and `requerimientos` (preserves existing fields and serialization)
- [x] T005 Update `PedidoRepository.create` serialization path in `backend/src/repositories/PedidoRepository.js` if needed to store new fields (no breaking changes)
- [x] T006 [P] Add shared order validation constants in `backend/src/config/orderRules.js` (requirements min 20, max 2000 characters)
- [x] T007 Create frontend `frontend/src/services/orderService.js` with `placeOrder(gigId, paqueteId, requerimientos, idempotencyKey)` method (depends on existing `useApiClient` pattern)
- [x] T008 Create frontend `frontend/src/hooks/useCreateOrder.js` hook wrapping `orderService.placeOrder` with loading/error states

**Checkpoint**: Foundation ready — `Pedido` domain supports placement data, shared rules exist, and frontend has an order placement service/hook.

---

## Phase 3: User Story 1 - Select Package and Place Order (Priority: P1) 🎯 MVP

**Goal**: Allow a customer to select a package from a Gig, enter requirements, confirm, and create a pending order visible to both customer and freelancer.

**Independent Test**: `POST /pedidos/reservar` with valid `gigId`, `paqueteId`, and `requerimientos` returns `201` with `estado: "Pendiente"`; the order appears in `GET /pedidos/mis-pedidos` and `GET /pedidos/gig/:gigId`.

### Implementation for User Story 1

- [x] T009 [US1] Implement `PedidoService.placeOrder(clienteId, { gigId, paqueteId, requerimientos, idempotencyKey })` in `backend/src/services/PedidoService.js` with gig/package lookup, validation, total snapshot, idempotency guard, and repository create
- [x] T010 [US1] Add `PedidoController.place(req, res, next)` in `backend/src/controllers/PedidoController.js` to extract body + `req.user.id` and call `PedidoService.placeOrder`
- [x] T011 [US1] Register authenticated route `POST /pedidos/reservar` in `backend/src/routes/pedidos.js` with Swagger annotations
- [x] T012 [US1] Update `frontend/src/screens/GigDetailScreen.js` to open the requirements step from the "Continuar" button instead of showing the placeholder alert
- [x] T013 [P] [US1] Create `frontend/src/components/OrderRequirementsModal.js` for entering requirements (min/max counter, Next button)
- [x] T014 [P] [US1] Create `frontend/src/components/OrderConfirmationModal.js` for reviewing package, price, delivery time, and requirements before final submit
- [x] T015 [US1] Wire `OrderConfirmationModal` to call `useCreateOrder().placeOrder` and navigate to `OrdersScreen` on success
- [x] T016 [US1] Update `frontend/src/context/AppContext.js` (or `useOrders` refetch) so the new order appears in the customer's order history without requiring a manual refresh

**Checkpoint**: User Story 1 fully functional and testable independently. A customer can place an order end-to-end.

---

## Phase 4: User Story 2 - Prevent Submission with Missing or Invalid Data (Priority: P2)

**Goal**: Block order placement when no package is selected or requirements are invalid, and show clear error messages.

**Independent Test**: Submitting `POST /pedidos/reservar` without `paqueteId`, with empty requirements, or with requirements outside 20-2000 characters returns `400` and no order is created. The frontend displays the same validation errors.

### Implementation for User Story 2

- [x] T017 [US2] Add backend validation helpers in `backend/src/services/PedidoService.js`: `validarPaqueteSeleccionado`, `validarRequerimientos` (throws `ValidationError` with descriptive messages)
- [x] T018 [US2] Ensure `PedidoService.placeOrder` rejects unknown `paqueteId` or `paqueteId` not belonging to the Gig with `404`/`400`
- [x] T019 [US2] Add frontend validation in `frontend/src/components/OrderRequirementsModal.js`: disable Next until requirements length is valid, show inline error messages
- [x] T020 [US2] Add frontend validation in `frontend/src/components/OrderConfirmationModal.js`: block Confirm if selected package or requirements become invalid, display backend errors from `useCreateOrder`

**Checkpoint**: User Stories 1 and 2 both work independently; invalid submissions are rejected consistently on backend and frontend.

---

## Phase 5: User Story 3 - Review Order Before Confirming (Priority: P3)

**Goal**: Show a confirmation summary with package details, price, delivery time, and requirements, and allow returning to edit requirements.

**Independent Test**: The frontend confirmation step displays the selected package name, price, delivery days, and requirements; tapping "Edit" returns to the requirements step and updated text is reflected on the confirmation step.

### Implementation for User Story 3

- [x] T021 [US3] Ensure `OrderConfirmationModal` receives and displays the full selected package object (`name`, `price`, `deliveryDays`, `descripcion`/`features`) plus requirements
- [x] T022 [US3] Add "Edit requirements" action in `frontend/src/components/OrderConfirmationModal.js` that switches back to `OrderRequirementsModal` while preserving state
- [x] T023 [US3] Update `OrderRequirementsModal` to accept existing requirements as initial value when returning from confirmation
- [x] T024 [US3] Keep package selection state in `GigDetailScreen` while the requirements/confirmation flow is open so the user cannot accidentally switch packages mid-flow without explicit cancellation

**Checkpoint**: All user stories independently functional. Users can review, edit, and confirm orders.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality.

- [x] T025 [P] Add/Update backend unit tests for `PedidoService.placeOrder` in `backend/tests/unit/PedidoService.test.js` (happy path, validation failures, idempotency)
- [x] T026 [P] Add/Update contract tests for `POST /pedidos/reservar` in `backend/tests/contract/pedidos.test.js`
- [ ] T027 [P] Add frontend component tests for `OrderRequirementsModal` and `OrderConfirmationModal` in `frontend/tests/components/`
- [x] T028 Update Swagger docs in `backend/src/routes/pedidos.js` to include the new `PedidoPlace` request schema and response examples
- [x] T029 Add idempotency key cleanup/expiration logic in `PedidoService` or a lightweight in-memory store to avoid unbounded growth
- [ ] T030 Run the validation steps from `specs/011-place-gig-order/quickstart.md` and fix any discrepancies
- [x] T031 [P] Review code for constitution compliance (SRP, DRY, no God classes, concise methods)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
  - `T004` must complete before `T009`.
  - `T006` must complete before `T009` and `T017`.
  - `T007` and `T008` must complete before `T015`.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can proceed in parallel (if staffed), but ordered sequentially by priority is recommended for a solo developer.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories. Must complete first for MVP.
- **User Story 2 (P2)**: Can start after Foundational phase; extends US1 with validation.
- **User Story 3 (P3)**: Can start after Foundational phase; extends US1 with review/edit UI.

### Within Each User Story

- Domain/service before controller/route.
- Backend contract before frontend integration.
- Core UI components before screen wiring.

### Parallel Opportunities

- `T002`, `T003` can run in parallel.
- `T004`, `T006`, `T007`, `T008` can run in parallel after `T001`.
- `T013` and `T014` can be developed in parallel.
- `T025`, `T026`, `T027`, `T031` can run in parallel during Polish phase.

---

## Parallel Example: User Story 1

```bash
# Backend tasks can be implemented together:
Task: "Extend Pedido domain model in backend/src/domain/Pedido.js"
Task: "Implement PedidoService.placeOrder in backend/src/services/PedidoService.js"
Task: "Add PedidoController.place in backend/src/controllers/PedidoController.js"
Task: "Register POST /pedidos/reservar in backend/src/routes/pedidos.js"

# Frontend UI tasks can be implemented together:
Task: "Create OrderRequirementsModal in frontend/src/components/OrderRequirementsModal.js"
Task: "Create OrderConfirmationModal in frontend/src/components/OrderConfirmationModal.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test placing an order end-to-end via API and frontend.
5. Demo/deploy if ready.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. User Story 1 → Test independently → Deploy/Demo (MVP).
3. User Story 2 → Test validation independently.
4. User Story 3 → Test review/edit flow independently.
5. Polish phase → tests, docs, quickstart validation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 backend (T009–T011).
   - Developer B: User Story 1 frontend (T012–T016).
   - Developer C: User Story 2 backend validation (T017–T018).
3. Integrate and run quickstart validation.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid vague tasks, same-file conflicts, and cross-story dependencies that break independence.
