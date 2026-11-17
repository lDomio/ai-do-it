# Tasks: Puntuación y Comentarios de Gigs

**Input**: Design documents from `/specs/010-gig-reviews-ratings/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included per project constitution: every service must have unit tests and critical user journeys must have integration/contract tests.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps to user stories from spec.md (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure existing project structure supports the new feature.

- [x] T001 Verify backend and frontend dependencies are installed and `npm test` runs in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend`
- [x] T002 [P] Confirm `EstadoPedido.js` already contains `'Entregado'` at `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/enums/EstadoPedido.js`
- [x] T003 [P] Verify existing `Opinion.js`, `OpinionService.js`, `OpinionRepository.js`, `OpinionController.js`, and `opiniones.js` routes at `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the shared `Opinion` domain and repository so all user stories can build on it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Extend `Opinion` domain in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/domain/Opinion.js` to include `pedido`, `puntuacion` validation (1-5), `detalle` validation (non-empty, max 1000 chars), and `fechaCreacion`
- [x] T005 [P] Update `OpinionRepository` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/repositories/OpinionRepository.js` to support `findByPedidoId(pedidoId)` and `findByGigId(gigId)`
- [x] T006 [P] Add unit tests for extended `Opinion` domain in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/domain/opinion.test.js`
- [x] T007 [P] Add unit tests for `OpinionRepository` query methods in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/unit/OpinionRepository.test.js`

**Checkpoint**: Foundation ready — `Opinion` can be created and queried by order and gig.

---

## Phase 3: User Story 1 - Calificar y comentar un pedido entregado (Priority: P1) 🎯 MVP

**Goal**: Allow a client to submit a numeric rating and written comment only when the associated order is in `Entregado` state.

**Independent Test**: Create a delivered order via API, submit a review, and verify the response contains the saved review with rating, comment and creation date.

### Tests for User Story 1

- [x] T008 [P] [US1] Write unit tests for review creation logic in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/unit/OpinionService.test.js` (delivered order required, one review per order)
- [x] T009 [P] [US1] Write contract test for `POST /opiniones` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/contract/opinion-create.test.js`

### Implementation for User Story 1

- [x] T010 [US1] Implement review creation rules in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/services/OpinionService.js`: validate order exists, is `Entregado`, belongs to client, and no review exists for that order
- [x] T011 [P] [US1] Inject `PedidoService` (or `PedidoRepository`) into `OpinionService` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/services/OpinionService.js` via constructor
- [x] T012 [US1] Update `OpinionController.create` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/controllers/OpinionController.js` to wrap errors with `next()` for consistent error handling
- [x] T013 [US1] Add JWT authentication to `POST /opiniones` route in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/routes/opiniones.js`
- [x] T014 [US1] Create `ReviewForm` component in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/components/ReviewForm.js` with star selector and multiline comment input
- [x] T015 [US1] Add review submission action to `OrderDetailScreen` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/screens/OrderDetailScreen.js` when `order.status === 'ENTREGADO'`
- [x] T016 [US1] Create `reviewService.js` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/services/reviewService.js` with `createReview(orderId, gigId, rating, comment)` using `useApiClient`
- [x] T017 [US1] Add mock handler for `POST /opiniones` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/services/mockData.js`

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Visualizar reseñas en la página del Gig (Priority: P2)

**Goal**: Display reviews and average rating on the Gig detail page so potential buyers can evaluate the service.

**Independent Test**: Request a Gig detail and its reviews endpoint; verify the response includes the review list, average rating, and review count. In the app, open a Gig with reviews and confirm the UI renders them.

### Tests for User Story 2

- [x] T018 [P] [US2] Write unit tests for average-rating calculation in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/unit/GigService-rating.test.js`
- [x] T019 [P] [US2] Write contract test for `GET /gigs/:id/reviews` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/contract/gig-reviews.test.js`
- [x] T020 [P] [US2] Write integration test for full review visibility flow in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/integration/opinion-gig-reviews.test.js`

### Implementation for User Story 2

- [x] T021 [US2] Add `calcularRating(gigId)` helper in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/services/OpinionService.js` to compute average and count
- [x] T022 [US2] Expose `GET /gigs/:id/reviews` endpoint in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/routes/gigs.js` returning paginated reviews plus summary
- [x] T023 [US2] Enrich `GigService.findById` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/services/GigService.js` to include `rating` and `reviewCount` derived fields
- [x] T024 [US2] Create `useReviews(gigId)` hook in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/hooks/useReviews.js` to fetch reviews and summary
- [x] T025 [US2] Update `GigDetailScreen` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/screens/GigDetailScreen.js` to display `ReviewSummary` and list `ReviewCard` components
- [x] T026 [US2] Add mock handler for `GET /gigs/:id/reviews` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/services/mockData.js` using existing `mockReviews`
- [x] T027 [US2] Update mock `GET /gigs/:id` handler in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/services/mockData.js` to return dynamic `rating` and `reviewCount` from `mockReviews`

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Evitar reseñas duplicadas o abusivas (Priority: P3)

**Goal**: Ensure data integrity by blocking duplicate reviews per order and rejecting empty comments.

**Independent Test**: Attempt to submit a second review for the same order and send an empty comment; verify both are rejected with clear error messages.

### Tests for User Story 3

- [x] T028 [P] [US3] Add unit tests for duplicate-review prevention in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/unit/OpinionService.test.js`
- [x] T029 [P] [US3] Add unit tests for empty/whitespace comment rejection in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/domain/opinion.test.js`
- [x] T030 [P] [US3] Add contract test for rejection scenarios in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/tests/contract/opinion-create.test.js`

### Implementation for User Story 3

- [x] T031 [US3] Enforce duplicate-review check in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/services/OpinionService.js` using `OpinionRepository.findByPedidoId`
- [x] T032 [US3] Enforce empty/whitespace comment rejection in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/domain/Opinion.js` constructor
- [x] T033 [US3] Add client-side validation in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/components/ReviewForm.js` before enabling the submit button
- [x] T034 [US3] Disable review action in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend/src/screens/OrderDetailScreen.js` when the order already has a review (track via order payload or local state)

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T035 [P] Update Swagger documentation for `POST /opiniones` and new `GET /gigs/:id/reviews` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/routes/opiniones.js` and `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend/src/routes/gigs.js`
- [x] T036 [P] Run backend lint and format in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend` with `npm run lint` and `npm run format:check`
- [x] T037 [P] Run frontend lint and format in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend` with `npm run lint` and `npm run format:check`
- [x] T038 [P] Execute all backend tests with `npm test` in `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend`
- [ ] T039 Run quickstart validation scenarios from `/home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/specs/010-gig-reviews-ratings/quickstart.md`
- [ ] T040 [P] Update `docs/tareas-backend.md` and `docs/tareas-frontend.md` if they contain task lists affected by this feature (optional, only if referenced in project docs)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational.
  - US1 must be completed before US2 can be integration-tested with real reviews, but US2 UI can be scaffolded in parallel.
  - US3 extends rules already built in US1; can be implemented in parallel with US2.
- **Polish (Phase 6)**: Depends on all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories. Delivers the core create-review capability.
- **User Story 2 (P2)**: Depends on US1 for creating sample reviews during integration tests; UI and backend read logic can be built in parallel.
- **User Story 3 (P3)**: Depends on US1 creation flow; strengthens validation rules.

### Within Each User Story

- Tests (when listed) should be written before or alongside implementation.
- Domain/Repository before Service.
- Service before Controller/Routes.
- Backend API before frontend service/hook/screen.

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel.
- All Foundational tasks (T004-T007) can run in parallel.
- US1 backend and frontend tasks (T010-T017) can mostly run in parallel once T004-T007 are done.
- US2 backend and frontend tasks (T021-T027) can mostly run in parallel once US1 API is available.
- US3 backend and frontend validation tasks (T031-T034) can run in parallel.
- Polish tasks (T035-T040) can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together:
Task: "Write unit tests for review creation logic in backend/tests/unit/OpinionService.test.js"
Task: "Write contract test for POST /opiniones in backend/tests/contract/opinion-create.test.js"

# Launch all US1 frontend tasks together:
Task: "Create ReviewForm component in frontend/src/components/ReviewForm.js"
Task: "Add review submission action to frontend/src/screens/OrderDetailScreen.js"
Task: "Create reviewService.js in frontend/src/services/reviewService.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1 (create review).
4. **STOP and VALIDATE**: Run backend tests and manual quickstart scenario.
5. Demo the review submission flow in the frontend.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. US1 → Test independently → Deploy/Demo (MVP!).
3. US2 → Test independently → Deploy/Demo.
4. US3 → Test independently → Deploy/Demo.
5. Polish → Lint, tests, documentation.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: US1 backend (T010-T013).
   - Developer B: US1 frontend (T014-T017).
   - Developer C: US2 backend + rating calculation (T021-T023).
3. US3 can be picked up by any developer after US1 backend is merged.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Verify backend tests pass after each phase.
- Avoid cross-story file conflicts; prefer adding new methods/components over heavy refactors.
