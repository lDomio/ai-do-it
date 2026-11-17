# Tasks: Order Delivery Chat

**Input**: Design documents from `/specs/007-order-delivery-chat/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Backend contract tests are required per the implementation plan. Frontend validation is manual via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure the local environment is ready and existing project structure is confirmed for the chat feature.

- [x] T001 Verify Node.js 20+ and installed dependencies in `backend/` and `frontend/` per `quickstart.md` prerequisites
- [x] T002 Confirm backend runs at the configured base URL (`backend/src/server.js` and `frontend/src/context/ApiConfigContext.js`)
- [x] T003 Verify existing authentication endpoints (`backend/src/routes/auth.js`) can produce JWT tokens for test users

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the shared backend domain and repository for order-scoped messages before any user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Extend `Mensaje` domain model in `backend/src/domain/Mensaje.js` to include `pedidoId`, `senderId`, `senderType`, `content`, `status`, and `createdAt`
- [x] T005 [P] Add `findByPedidoId(pedidoId)` and pedido-scoped `create` to `backend/src/repositories/MensajeRepository.js`
- [x] T006 Add order-scoped authorization helper in `backend/src/services/MensajeService.js` that resolves `Pedido.cliente` and `Gig.vendedor` and rejects non-parties
- [x] T007 Define shared message validation rules (non-empty after trim, max 2,000 characters) in `backend/src/services/MensajeService.js` or a shared validator
- [x] T008 Configure error handling for chat-specific failures (`404 Not Found`, `403 Forbidden`, `400 Bad Request`) using existing `backend/src/middleware/errorHandler.js`

**Checkpoint**: Foundation ready - domain, repository, and authorization primitives exist and unit-testable independently.

---

## Phase 3: User Story 1 - Send a message inside an order (Priority: P1) 🎯 MVP

**Goal**: A client or freelancer can open an active order, type a text message, send it, and see it appear in the chat history attributed to the sender.

**Independent Test**: `curl POST /pedidos/{orderId}/messages` with a client token returns `201 Created`; `curl GET /pedidos/{orderId}/messages` returns the message with `senderType: CLIENTE`. Repeat with a freelancer token and verify `senderType: FREELANCER`. Empty or whitespace-only content returns `400 Bad Request`.

### Tests for User Story 1

- [x] T009 [P] [US1] Write contract test `backend/tests/contract/messages-create.test.js` asserting client can create a message and response matches the API contract
- [x] T010 [P] [US1] Write contract test `backend/tests/contract/messages-validation.test.js` asserting empty/whitespace and oversized content return `400 Bad Request`
- [x] T011 [P] [US1] Write contract test `backend/tests/contract/messages-auth.test.js` asserting unauthenticated and unauthorized users cannot create messages

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement `sendMessage(pedidoId, senderUser, content)` in `backend/src/services/MensajeService.js` with validation, auth, and read-only terminal-order check
- [x] T013 [US1] Add `POST /pedidos/:id/messages` route in `backend/src/routes/pedidos.js` wired to `MensajeController.createForPedido` with `authenticate` middleware
- [x] T014 [US1] Implement `createForPedido` in `backend/src/controllers/MensajeController.js` to extract `req.user`, call the service, and return `201 Created`
- [x] T015 [P] [US1] Align `frontend/src/hooks/useOrderChat.js` with the new contract: call `POST /orders/${orderId}/messages` or `POST /pedidos/${orderId}/messages` using the configured path, trim and validate `content` locally
- [x] T016 [US1] Update `frontend/src/screens/OrderDetailScreen.js` to disable the send button and show a hint when input is empty or exceeds 2,000 characters
- [x] T017 [US1] Ensure sent messages appear immediately in the local chat list in `frontend/src/screens/OrderDetailScreen.js` before server confirmation (optimistic UI)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently via backend contract tests and the mobile quickstart scenario.

---

## Phase 4: User Story 2 - View conversation history inside an order (Priority: P2)

**Goal**: Either party can open an order and see the full chronologically-ordered chat history, or an empty state when no messages exist.

**Independent Test**: Seed two messages for an order via `POST /pedidos/{orderId}/messages` (one client, one freelancer). `GET /pedidos/{orderId}/messages` returns both in `createdAt` order. For an order with no messages, `GET` returns an empty `messages` array and the frontend shows an empty-state label.

### Tests for User Story 2

- [x] T018 [P] [US2] Write contract test `backend/tests/contract/messages-list.test.js` asserting chronological order and correct attribution for a seeded thread
- [x] T019 [P] [US2] Write contract test `backend/tests/contract/messages-list-auth.test.js` asserting only client or freelancer can list messages for an order

### Implementation for User Story 2

- [x] T020 [P] [US2] Implement `listMessagesForPedido(pedidoId, user)` in `backend/src/services/MensajeService.js` returning messages sorted by `createdAt` ascending
- [x] T021 [US2] Add `GET /pedidos/:id/messages` route in `backend/src/routes/pedidos.js` wired to `MensajeController.findByPedido` with `authenticate` middleware
- [x] T022 [US2] Implement `findByPedido` in `backend/src/controllers/MensajeController.js` returning `{ messages, unreadCount }`
- [x] T023 [US2] Update `frontend/src/hooks/useOrderChat.js` to fetch history on mount and expose `loading`/`empty` states
- [x] T024 [US2] Add empty-state UI in `frontend/src/screens/OrderDetailScreen.js` when `messages.length === 0`
- [x] T025 [US2] Render sender name and timestamp per message bubble in `frontend/src/screens/OrderDetailScreen.js` using `senderType` and `createdAt`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently; history is visible and attributed.

---

## Phase 5: User Story 3 - Receive real-time chat updates (Priority: P3)

**Goal**: While both parties have the same order chat open, a message sent by one party appears automatically for the other within a few seconds without manual refresh.

**Independent Test**: Open the order chat on two simulated devices. Send a message from the client device. Within approximately 5 seconds, the freelancer device shows the new message without pulling to refresh.

### Tests for User Story 3

- [x] T026 [P] [US3] Write manual QA script in `specs/007-order-delivery-chat/quickstart.md` recording the two-device polling observation steps and expected 5-second latency

### Implementation for User Story 3

- [x] T027 [US3] Add 5-second polling interval in `frontend/src/hooks/useOrderChat.js` to refresh messages while the order detail screen is focused
- [x] T028 [US3] Pause polling when the `OrderDetailScreen` loses focus and resume on focus to avoid unnecessary requests in `frontend/src/hooks/useOrderChat.js`
- [x] T029 [US3] Dedupe incoming messages in `frontend/src/hooks/useOrderChat.js` so polling does not duplicate already-rendered optimistic messages

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve reliability, error handling, and consistency across all user stories.

- [x] T030 [P] Implement delivery failure handling in `frontend/src/hooks/useOrderChat.js`: mark optimistic message as `FALLIDO`, preserve content, and expose a retry function
- [x] T031 [P] Add retry button and error label on failed message bubbles in `frontend/src/screens/OrderDetailScreen.js`
- [x] T032 [P] Update Swagger documentation for `GET /pedidos/:id/messages` and `POST /pedidos/:id/messages` in `backend/src/routes/pedidos.js`
- [x] T033 [P] Run backend linter and formatter: `cd backend && npm run lint && npm run format:check`
- [x] T034 [P] Run frontend linter and formatter: `cd frontend && npm run lint && npm run format:check`
- [x] T035 Execute all backend tests: `cd backend && npm test`
- [x] T036 Execute quickstart.md scenarios 1-5 with `curl` and scenario 6 on a simulator/device; mark the checklist in `specs/007-order-delivery-chat/quickstart.md`

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2). Depends on US1 only because sending messages is required to seed history; however, the list endpoint itself is independently testable by seeding via tests.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) and after US1/US2 because polling relies on send and list working.

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation.
- Models/repository before services.
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
Task: "T009 [P] [US1] Write contract test backend/tests/contract/messages-create.test.js"
Task: "T010 [P] [US1] Write contract test backend/tests/contract/messages-validation.test.js"
Task: "T011 [P] [US1] Write contract test backend/tests/contract/messages-auth.test.js"

# Launch backend and frontend implementation tasks together:
Task: "T012 [P] [US1] Implement sendMessage in backend/src/services/MensajeService.js"
Task: "T013 [US1] Add POST /pedidos/:id/messages route in backend/src/routes/pedidos.js"
Task: "T014 [US1] Implement createForPedido in backend/src/controllers/MensajeController.js"
Task: "T015 [P] [US1] Align frontend/src/hooks/useOrderChat.js with the new contract"
Task: "T016 [US1] Update frontend/src/screens/OrderDetailScreen.js validation UI"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1 (send message from either party, basic validation).
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
   - Developer A: User Story 1 (backend send + frontend validation)
   - Developer B: User Story 2 (backend list + frontend history UI)
   - Developer C: User Story 3 (frontend polling)
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
