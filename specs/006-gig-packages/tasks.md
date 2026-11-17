# Tasks: Gig Packages for Freelancers

**Input**: Design documents from `/specs/006-gig-packages/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

---

## Phase 1: Foundational (Shared Infrastructure)

**Purpose**: Package model, mock data handlers, and GigService methods that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Add `Package` nested class to `frontend/src/models/gig.js` with fields: id, nombre, precio, diasEntrega, caracteristicas[] and `static fromJSON()` method
- [x] T002 [P] Add `POST /gigs` mock handler to `frontend/src/services/mockData.js` — accepts gig object with packages, generates ID, pushes to `mockGigs[]`, returns created gig
- [x] T003 [P] Add `PUT /gigs/:id` mock handler to `frontend/src/services/mockData.js` — updates gig fields and packages array
- [x] T004 [P] Add `DELETE /gigs/:id/packages/:packageId` mock handler to `frontend/src/services/mockData.js` — removes package, validates min 1 remains
- [x] T005 Add `createGig(gigData)` method to `frontend/src/services/gigService.js` — calls `apiClient.post('/gigs', gigData)`
- [x] T006 Add `updateGig(id, gigData)` method to `frontend/src/services/gigService.js` — calls `apiClient.put(\`/gigs/${id}\`, gigData)`
- [x] T007 Add `useCreateGig()` hook to `frontend/src/hooks/useGigs.js` — wraps GigService.createGig with loading/error state

**Checkpoint**: Mock CRUD for gigs with packages is functional. User stories can now begin.

---

## Phase 2: User Story 1 — Create Gig with Multiple Packages (Priority: P1) 🎯 MVP

**Goal**: Freelancer can create a gig by filling in title, description, category, tags, and defining 1-3 packages with name, price, delivery days, and features.

**Independent Test**: Create a gig with 3 packages via the form → verify data persists in mock and appears on gig detail.

### Implementation

- [x] T008 [P] [US1] Create `PackageCard` component at `frontend/src/components/PackageCard.js` — renders editable form fields: nombre, precio, diasEntrega, caracteristicas[] (text input list with add/remove). Uses AppInput, AppButton, AppText shared primitives.
- [x] T009 [US1] Update `CreateGigScreen.js` at `frontend/src/screens/CreateGigScreen.js` — add state for `paquetes[]` array (max 3). Render PackageCard for each package. Add "Agregar paquete" button (hidden when 3 packages). Add validation: min 1 package, min 1 feature per package, non-negative price/days.
- [x] T010 [US1] Add validation error display to `CreateGigScreen.js` — show inline errors below each invalid field. Block submission until all validations pass.
- [x] T011 [US1] Wire form submission in `CreateGigScreen.js` — call `useCreateGig` hook on submit. Navigate to GigDetail screen on success. Show error toast on failure.
- [x] T012 [US1] Add "Editar" navigation from `ProfileScreen.js` — pass `{ gigId }` to CreateGigScreen. On load, fetch gig by ID and pre-fill form fields.

**Checkpoint**: Freelancer can create and edit a gig with packages. Form validates correctly.

---

## Phase 3: User Story 2 — View Gig with Packages (Priority: P2)

**Goal**: Buyer sees package tabs on gig detail page, can switch between them, and sees price/delivery/features update.

**Independent Test**: Open a gig with 3 packages → tap each tab → verify correct details display.

### Implementation

- [x] T013 [P] [US2] Create `PackageTabBar` component at `frontend/src/components/PackageTabBar.js` — renders horizontal tab bar from `packages[]` array. Accepts `selectedIndex` and `onTabChange` callback. Highlights selected tab using theme primary color.
- [x] T014 [US2] Update `GigDetailScreen.js` at `frontend/src/screens/GigDetailScreen.js` — replace hardcoded package tabs with `PackageTabBar` component. Add `selectedPackageIndex` state. Render `PackageCard` (read-only variant) showing price, delivery days, and features of selected package.
- [x] T015 [US2] Handle edge cases in `GigDetailScreen.js` — price = 0 shows "Gratis"; diasEntrega = 0 shows "Entrega el mismo día"; missing image shows placeholder.

**Checkpoint**: Buyer can browse gig packages via tab switching. All edge cases handled.

---

## Phase 4: User Story 3 & 4 — Edit & Delete Packages (Priority: P3)

**Goal**: Freelancer can edit existing package fields and delete individual packages (min 1 required).

**Independent Test**: Edit a gig → change a price → save → verify update persists. Delete a package → verify gig has fewer packages.

### Implementation

- [x] T016 [P] [US3] Add package editing support to `CreateGigScreen.js` — when `route.params.gigId` exists, fetch gig data and pre-fill all package forms. Allow adding new packages (up to 3) and editing existing ones.
- [x] T017 [P] [US4] Add "Eliminar" button to each `PackageCard` in `CreateGigScreen.js` — confirm dialog before deletion. Block deletion when only 1 package remains with error message.
- [x] T018 [US3] Wire update submission in `CreateGigScreen.js` — when editing, call `GigService.updateGig(id, data)` instead of `createGig`. Navigate back on success.

**Checkpoint**: Full CRUD for gig packages is functional.

---

## Phase 5: Swagger Backend Documentation

**Purpose**: Add OpenAPI/Swagger documentation to the backend API so all endpoints are documented interactively.

### Implementation

- [x] T019 Install Swagger dependencies in `backend/` — `npm install swagger-jsdoc swagger-ui-express`
- [x] T020 Create Swagger configuration at `backend/src/config/swagger.js` — define OpenAPI 3.0 info (title: "AI Do It API", version: "1.0.0", description), server URL (`http://localhost:3000`), component schemas for Gig, Paquete, Usuario, Pedido, etc.
- [x] T021 Mount Swagger UI in `backend/src/app.js` — `app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))`. Serve raw JSON at `/api-docs.json`.
- [x] T022 [P] Add JSDoc annotations to `backend/src/routes/gigs.js` — document GET /gigs (search, filter, sort, pagination params), GET /gigs/:id, POST /gigs, PUT /gigs/:id, DELETE /gigs/:id with request/response schemas.
- [x] T023 [P] Add JSDoc annotations to `backend/src/routes/paquetes.js` — document all CRUD endpoints for packages with schemas.
- [x] T024 [P] Add JSDoc annotations to `backend/src/routes/pedidos.js` — document all endpoints including authenticated ones.
- [x] T025 [P] Add JSDoc annotations to `backend/src/routes/auth.js` — document login, register, refresh, logout with rate limit notes.
- [x] T026 [P] Add JSDoc annotations to remaining routes — `usuarios.js`, `categorias.js`, `opiniones.js`, `mensajes.js`.
- [x] T027 Add reusable component schemas to `backend/src/config/swagger.js` — Paquete, Gig, Usuario, Pedido, Opinion, Mensaje, Categoria, error responses, pagination.
- [x] T028 Test Swagger UI loads correctly — navigate to `http://localhost:3000/api-docs`, verify all endpoints render, test "Try it out" for GET /gigs.

**Checkpoint**: All backend endpoints are documented and browsable at `/api-docs`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and final verification

- [x] T029 Run quickstart.md validation — follow all 6 scenarios in `specs/006-gig-packages/quickstart.md` end-to-end
- [x] T030 [P] Verify Constitution compliance — review all new/modified files against SOLID principles, DRY, SRP, method length limits
- [x] T031 [P] Code cleanup — remove any console.log statements, ensure consistent formatting, verify no hardcoded colors (use theme tokens)
- [x] T032 Update `frontend/src/services/mockData.js` seed data — add at least 1 gig created via the new POST handler to verify end-to-end persistence

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — starts immediately. BLOCKS all user stories.
- **Phase 2 (US1 — Create)**: Depends on Phase 1 completion.
- **Phase 3 (US2 — View)**: Depends on Phase 1 completion. Can run parallel to Phase 2.
- **Phase 4 (US3/US4 — Edit/Delete)**: Depends on Phase 2 (reuses CreateGigScreen).
- **Phase 5 (Swagger)**: Independent of frontend phases. Can run in parallel with Phases 2-4.
- **Phase 6 (Polish)**: Depends on all other phases complete.

### Within Each Phase

- Tasks marked [P] can run in parallel
- Components before screens (model → component → screen)
- Services before screens (service → hook → screen)
- Mock handlers before hooks (handler → service method → hook)

### Parallel Opportunities

```
Phase 1: T001, T002, T003, T004 (all parallel)
Phase 2+3: T008+T013 (parallel — different components), T009+T014 (parallel — different screens)
Phase 5: T022-T026 (all parallel — different route files)
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All UI text must be in Spanish (Argentine locale)
- All icons use Feather icon family from `@expo/vector-icons`
- Colors must use theme.js tokens (Violet #6D28D9 primary, Amber #F59E0B accent)
