# Tasks: Gig Search & Browse

**Input**: Design documents from `/specs/005-gig-search-browse/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested — test tasks omitted.

**Organization**: Tasks separated by Backend and Frontend, each organized by user story. Frontend implements search via button press ("Realizar búsqueda") instead of real-time filtering.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

# BACKEND TASKS

## Phase 1: Backend — Setup

**Purpose**: Project initialization and basic structure

- [x] T001 Create Gig model with fields: id, title, description, categoryId, freelancerId, packages, averageRating, createdAt in `backend/src/models/gig.js`
- [x] T002 [P] Create Category model with fields: id, name in `backend/src/models/category.js`
- [x] T003 [P] Create Package model with fields: id, name, description, price, deliveryDays in `backend/src/models/package.js`

---

## Phase 2: Backend — Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Create GigRepository with findAll(), findById(), findByCategory() methods in `backend/src/repositories/gigRepository.js`
- [x] T005 [P] Create CategoryRepository with findAll() method in `backend/src/repositories/categoryRepository.js`
- [x] T006 [P] Create GigService with searchGigs({ search, category, sortBy }) method in `backend/src/services/gigService.js`
- [x] T007 [P] Create GigController with GET /gigs handler in `backend/src/controllers/gigController.js`
- [x] T008 [P] Create CategoryController with GET /categories handler in `backend/src/controllers/categoryController.js`
- [x] T009 [P] Register gig routes in `backend/src/routes/gigRoutes.js`
- [x] T010 [P] Register category routes in `backend/src/routes/categoryRoutes.js`
- [x] T011 Wire routes into Express app in `backend/src/app.js`
- [x] T012 Create seed data with 3+ Gigs, 3+ Categories, and Freelancer users in `backend/src/store/seed.js`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: Backend — User Story 1 — Text Search (Priority: P1) 🎯 MVP

**Goal**: Clients can search Gigs by text keywords matching title/description

**Independent Test**: Call `GET /gigs?search=logo` and verify matching Gigs are returned

### Implementation

- [x] T013 [US1] Implement text search logic in GigService: filter by search term matching title or description (case-insensitive, min 3 chars) in `backend/src/services/gigService.js`
- [x] T014 [US1] Add search query parameter parsing in GigController in `backend/src/controllers/gigController.js`
- [x] T015 [US1] Return error response for invalid search params (< 3 chars) in `backend/src/controllers/gigController.js`

**Checkpoint**: Text search functional — `GET /gigs?search=logo` returns matching Gigs

---

## Phase 4: Backend — User Story 2 — Browse by Category (Priority: P1)

**Goal**: Clients can browse Gigs filtered by category

**Independent Test**: Call `GET /gigs?category=1` and verify only Gigs in that category are returned

### Implementation

- [x] T016 [US2] Implement category filter logic in GigService: filter by categoryId in `backend/src/services/gigService.js`
- [x] T017 [US2] Add category query parameter parsing in GigController in `backend/src/controllers/gigController.js`
- [x] T018 [US2] Implement GET /categories endpoint returning all categories in `backend/src/controllers/categoryController.js`

**Checkpoint**: Category browsing functional — `GET /gigs?category=1` and `GET /categories` work

---

## Phase 5: Backend — User Story 3 — Combined Search + Category (Priority: P2)

**Goal**: Clients can combine text search with category filter

**Independent Test**: Call `GET /gigs?search=minimalista&category=1` and verify results match both criteria

### Implementation

- [x] T019 [US3] Extend GigService to apply both search and category filters simultaneously in `backend/src/services/gigService.js`
- [x] T020 [US3] Update GigController to handle combined query params in `backend/src/controllers/gigController.js`

**Checkpoint**: Combined filtering functional — both filters applied together

---

## Phase 6: Backend — User Story 4 — Sort Results (Priority: P2)

**Goal**: Clients can sort results by price, rating, or date

**Independent Test**: Call `GET /gigs?sortBy=price` and verify results are ordered correctly

### Implementation

- [x] T021 [US4] Create SortStrategy interface and PriceSort, RatingSort, DateSort implementations in `backend/src/services/sortStrategies.js`
- [x] T022 [US4] Integrate sort strategies into GigService.searchGigs() in `backend/src/services/gigService.js`
- [x] T023 [US4] Add sortBy query parameter parsing and validation in GigController in `backend/src/controllers/gigController.js`

**Checkpoint**: Sorting functional — `GET /gigs?sortBy=price|rating|date` returns ordered results

---

## Phase 7: Backend — User Story 5 — Gig Detail (Priority: P2)

**Goal**: Clients can view full Gig details including packages and reviews

**Independent Test**: Call `GET /gigs/:id` and verify complete Gig data is returned

### Implementation

- [x] T024 [US5] Add findById() method to GigRepository returning full Gig with packages in `backend/src/repositories/gigRepository.js`
- [x] T025 [US5] Implement getGigById() in GigService in `backend/src/services/gigService.js`
- [x] T026 [US5] Add GET /gigs/:id endpoint in GigController in `backend/src/controllers/gigController.js`
- [x] T027 [US5] Register detail route in gig routes in `backend/src/routes/gigRoutes.js`

**Checkpoint**: Gig detail functional — `GET /gigs/:id` returns full Gig data

---

## Phase 8: Backend — Polish

**Purpose**: Cross-cutting improvements

- [x] T028 [P] Add input validation middleware for query params in `backend/src/middleware/validateQuery.js`
- [x] T029 [P] Unify error response format `{ error, message }` across all endpoints in `backend/src/middleware/errorHandler.js`
- [x] T030 Run quickstart.md validation scenarios against backend

**Checkpoint**: Backend complete and validated

---

# FRONTEND TASKS

## Phase 9: Frontend — Setup

**Purpose**: Project initialization and basic structure

- [x] T031 Create Gig model types (id, title, description, category, freelancer, startingPrice, averageRating) in `frontend/src/models/gig.js`
- [x] T032 [P] Create Category model types (id, name) in `frontend/src/models/category.js`

---

## Phase 10: Frontend — Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T033 Create GigService with searchGigs({ search, category, sortBy }) and getCategories() methods calling backend API in `frontend/src/services/gigService.js`
- [x] T034 [P] Create GigCard component displaying title, category, freelancer name, price, rating in `frontend/src/components/GigCard.js`
- [x] T035 [P] Create CategoryChip component for selectable category filter in `frontend/src/components/CategoryChip.js`
- [x] T036 [P] Create SearchBar component with TextInput and "Realizar búsqueda" button in `frontend/src/components/SearchBar.js`
- [x] T037 [P] Create SortDropdown component with price/rating/date options in `frontend/src/components/SortDropdown.js`
- [x] T038 Create GigListScreen skeleton with navigation setup in `frontend/src/screens/GigListScreen.js`
- [x] T039 Register GigListScreen in navigation in `frontend/src/navigation/AppNavigator.js`

**Checkpoint**: Foundation ready — UI components and service layer available

---

## Phase 11: Frontend — User Story 1 — Text Search (Priority: P1) 🎯 MVP

**Goal**: Clients type keywords, press "Realizar búsqueda" button, and see matching Gigs

**Independent Test**: Type search term, press button, verify matching Gigs appear

**Key Change**: Search does NOT auto-execute on text input. User MUST press "Realizar búsqueda" button to trigger search.

### Implementation

- [x] T040 [US1] Implement search button handler in SearchBar: on press, call onSearch(text) callback in `frontend/src/components/SearchBar.js`
- [x] T041 [US1] Add search state management and API call in GigListScreen: store searchResults, call GigService.searchGigs() on button press in `frontend/src/screens/GigListScreen.js`
- [x] T042 [US1] Render GigCard list from searchResults in GigListScreen in `frontend/src/screens/GigListScreen.js`
- [x] T043 [US1] Show "No se encontraron Gigs para tu búsqueda" message when results are empty in `frontend/src/screens/GigListScreen.js`
- [x] T044 [US1] Add loading state while search is in progress in `frontend/src/screens/GigListScreen.js`

**Checkpoint**: Text search with button functional — type term, press button, see results

---

## Phase 12: Frontend — User Story 2 — Browse by Category (Priority: P1)

**Goal**: Clients can browse Gigs by selecting category chips

**Independent Test**: Select a category chip, verify only Gigs in that category are shown

### Implementation

- [x] T045 [US2] Fetch categories on screen mount and render CategoryChip list in `frontend/src/screens/GigListScreen.js`
- [x] T046 [US2] Implement category chip selection/deselection handler in `frontend/src/screens/GigListScreen.js`
- [x] T047 [US2] Call GigService.searchGigs({ category }) when category is selected in `frontend/src/screens/GigListScreen.js`
- [x] T048 [US2] Show "No hay Gigs en esta categoría todavía" when category has no results in `frontend/src/screens/GigListScreen.js`

**Checkpoint**: Category browsing functional — select chip, see filtered Gigs

---

## Phase 13: Frontend — User Story 3 — Combined Search + Category (Priority: P2)

**Goal**: Clients can combine text search with category filter

**Independent Test**: Select category + enter search term + press button, verify results match both

### Implementation

- [x] T049 [US3] Update GigListScreen to pass both search text and selected category to GigService in `frontend/src/screens/GigListScreen.js`
- [x] T050 [US3] Show "No se encontraron Gigs con esos criterios" when combined filters return empty in `frontend/src/screens/GigListScreen.js`

**Checkpoint**: Combined filtering functional — search + category work together

---

## Phase 14: Frontend — User Story 4 — Sort Results (Priority: P2)

**Goal**: Clients can sort results by price, rating, or date

**Independent Test**: Select sort option, verify Gig list reorders

### Implementation

- [x] T051 [US4] Render SortDropdown in GigListScreen and handle selection in `frontend/src/screens/GigListScreen.js`
- [x] T052 [US4] Call GigService.searchGigs({ sortBy }) when sort option changes in `frontend/src/screens/GigListScreen.js`
- [x] T053 [US4] Pass current sort state to SortDropdown for visual feedback in `frontend/src/screens/GigListScreen.js`

**Checkpoint**: Sorting functional — select sort option, Gigs reorder

---

## Phase 15: Frontend — User Story 5 — Gig Detail (Priority: P2)

**Goal**: Clients can tap Gig card and view full details

**Independent Test**: Tap Gig card, verify detail screen shows complete information

### Implementation

- [x] T054 [US5] Create GigDetailScreen with title, description, packages, freelancer info in `frontend/src/screens/GigDetailScreen.js`
- [x] T055 [US5] Add getGigById() method to GigService in `frontend/src/services/gigService.js`
- [x] T056 [US5] Implement navigation from GigCard tap to GigDetailScreen in `frontend/src/screens/GigListScreen.js`
- [x] T057 [US5] Register GigDetailScreen in navigation in `frontend/src/navigation/AppNavigator.js`
- [x] T058 [US5] Render packages list with price and delivery days in `frontend/src/screens/GigDetailScreen.js`

**Checkpoint**: Gig detail functional — tap card, see full Gig info

---

## Phase 16: Frontend — Polish

**Purpose**: Cross-cutting improvements

- [x] T059 [P] Add error handling with retry option for failed API calls in `frontend/src/screens/GigListScreen.js`
- [x] T060 [P] Add pull-to-refresh functionality in GigListScreen in `frontend/src/screens/GigListScreen.js`
- [x] T061 Run quickstart.md validation scenarios against frontend

**Checkpoint**: Frontend complete and validated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Backend Setup (Phase 1)**: No dependencies — can start immediately
- **Backend Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all backend user stories
- **Backend User Stories (Phases 3–7)**: Depend on Phase 2 — can proceed sequentially
- **Backend Polish (Phase 8)**: Depends on all backend user stories
- **Frontend Setup (Phase 9)**: No dependencies on backend — can start in parallel with backend
- **Frontend Foundational (Phase 10)**: Depends on Phase 9 — BLOCKS all frontend user stories
- **Frontend User Stories (Phases 11–15)**: Depend on Phase 10 — can proceed sequentially
- **Frontend Polish (Phase 16)**: Depends on all frontend user stories

### Recommended Execution Order

```
1. Backend Phase 1 + Phase 2 (setup + foundational)
2. Backend Phases 3–7 (user stories: search → category → combined → sort → detail)
3. Backend Phase 8 (polish)
4. Frontend Phase 9 + Phase 10 (setup + foundational)
5. Frontend Phases 11–15 (user stories: search → category → combined → sort → detail)
6. Frontend Phase 16 (polish)
```

### Parallel Opportunities

- Backend Phase 1: T002, T003 can run in parallel
- Backend Phase 2: T005, T006, T007, T008, T009, T010 can run in parallel
- Frontend Phase 9: T032 can run in parallel with T031
- Frontend Phase 10: T034, T035, T036, T037 can run in parallel
- Backend and Frontend Setup phases (1 and 9) can run in parallel

---

## Implementation Strategy

### MVP First (Text Search Only)

1. Complete Backend Phases 1–3 (setup → foundational → text search)
2. Complete Frontend Phases 9–11 (setup → foundational → text search with button)
3. **STOP and VALIDATE**: Test text search end-to-end
4. Deploy/demo if ready

### Incremental Delivery

1. Backend Setup + Foundational → Foundation ready
2. Backend Text Search (US1) → API functional
3. Backend Category Browse (US2) → API functional
4. Backend Combined + Sort + Detail (US3–5) → API complete
5. Frontend Setup + Foundational → UI components ready
6. Frontend Text Search with Button (US1) → MVP!
7. Frontend Category Browse (US2) → UI functional
8. Frontend Combined + Sort + Detail (US3–5) → Feature complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Frontend search requires button press ("Realizar búsqueda") — NOT real-time filtering
- Backend must be implemented before frontend can integrate with API
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
