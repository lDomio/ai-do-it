# Tasks: Frontend Scaffolding and Initial Configuration

**Input**: Design documents from `/specs/001-frontend-scaffolding/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this feature; validation is manual per the Quickstart guide.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend workspace**: `frontend/`
- **Source code**: `frontend/src/`
- **Feature screens**: `frontend/src/features/<feature>/`
- **Shared primitives**: `frontend/src/shared/`
- **Cross-feature composites**: `frontend/src/components/`
- **Shared state providers**: `frontend/src/context/`
- **Pure business logic**: `frontend/src/domain/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the React Native frontend project and add only the dependencies needed for scaffolding and navigation.

- [x] T001 Create the Expo project under `frontend/` using `create-expo-app` with a blank template.
- [x] T002 [P] Install React Navigation dependencies in `frontend/package.json` (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`).
- [x] T003 [P] Add start/dev scripts to `frontend/package.json` so the project can be launched with a single documented command.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the cross-cutting providers and project entry point that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Create `frontend/src/context/ApiConfigContext.js` with a provider that exposes `baseUrl` and `timeoutMs` defaults.
- [x] T005 [P] Create `frontend/src/context/DemoRoleContext.js` with a provider that exposes `role` (`cliente` | `freelancer`) and `setRole`, and rejects invalid values.
- [x] T006 Update `frontend/App.js` to wrap the application in both context providers and render a placeholder root component.

**Checkpoint**: Foundation ready — context providers are wired and the app builds without errors.

---

## Phase 3: User Story 1 - Initialize Frontend Project (Priority: P1) 🎯 MVP

**Goal**: The frontend project is created, installable, and runnable on a local mobile device.

**Independent Test**: A teammate clones the repo, runs `cd frontend && npm install && npm start`, and sees the default application on a mobile device or emulator.

### Implementation for User Story 1

- [x] T007 Verify `frontend/package.json` has the correct React Native/Expo scripts and a runnable entry point.
- [x] T008 Run the project locally and confirm it launches on an emulator or physical device connected to the same network.
- [x] T009 Create `frontend/README.md` documenting install, start, device pairing (LAN IP / QR code), and how to verify the project runs.

**Checkpoint**: At this point, the project runs independently and the README is sufficient for a new teammate.

---

## Phase 4: User Story 2 - Establish Frontend Folder Structure (Priority: P1)

**Goal**: The source code is organized into the five requested folders, each with a demonstrable starter file, and the architecture is easy to explain.

**Independent Test**: A reviewer opens `frontend/src/` and confirms every file belongs to one of `features/`, `shared/`, `components/`, `context/`, or `domain/`, with no orphan files at the root of `src/`.

### Implementation for User Story 2

- [x] T010 [P] Create `frontend/src/shared/AppText.js`, `frontend/src/shared/AppButton.js`, and `frontend/src/shared/AppCard.js` as design-system primitives.
- [x] T011 [P] Create `frontend/src/components/RoleBadge.js` and `frontend/src/components/HealthStatus.js` as cross-feature composites built from `shared/` primitives.
- [x] T012 [P] Create `frontend/src/domain/ApiConfig.js`, `frontend/src/domain/DemoRole.js` and `frontend/src/domain/validateRole.js` as rich-domain classes with pure validation logic that rejects invalid demo roles.
- [x] T013 Create `frontend/src/features/home/HomeScreen.js` using only `shared/` and `components/` abstractions; it MUST NOT import from other feature folders.
- [x] T014 Update `frontend/App.js` to render `HomeScreen` from `features/home/HomeScreen.js` as the landing screen.

**Checkpoint**: At this point, the folder structure is demonstrable and every source file has a clear, single responsibility.

---

## Phase 5: User Story 3 - Configure API Client and Shared State (Priority: P2)

**Goal**: The backend base URL and demo role are configurable from a single source of truth, and a sample screen exercises both contexts.

**Independent Test**: A reviewer changes the backend URL in one file and toggles the demo role; the landing screen reflects both changes without individual edits to screens or services.

### Implementation for User Story 3

- [x] T015 Create a thin HTTP client module in `frontend/src/services/apiClient.js` that reads `baseUrl` from `ApiConfigContext` and performs JSON requests.
- [x] T016 [P] Add a sample health-check call in `frontend/src/features/home/HomeScreen.js` that displays the backend `/health` response or a friendly offline error.
- [x] T017 [P] Add a role selector and `RoleBadge` to `frontend/src/features/home/HomeScreen.js` that reads and updates `DemoRoleContext`; selecting the same role twice MUST be a no-op.
- [x] T018 Document the API configuration and role context contracts in `frontend/README.md`.

**Checkpoint**: All user stories are independently functional and the landing screen exercises both shared contexts.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation and validate the end-to-end quickstart.

- [x] T019 [P] Review all files for code smells (God files, >3 responsibilities, >5 parameters, duplicated logic) and move any shared logic to the correct folder.
- [x] T020 [P] Update `docs/tareas-frontend.md` to mark FE-0.x and FE-1.x setup tasks as completed and reference the new folder structure.
- [x] T021 Run the `specs/001-frontend-scaffolding/quickstart.md` validation steps on an emulator or physical device and record the result.
- [x] T022 [P] Add a root `.gitignore` entry for `frontend/node_modules/` and Expo build artifacts if not already present.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User Story 1 (P1) and User Story 2 (P1) can proceed in parallel once foundation is ready.
  - User Story 3 (P2) depends on the contexts and landing screen created in US1/US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories; may share `shared/` primitives with US3.
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) and after US1/US2 provide the entry point and shared primitives.

### Within Each User Story

- Core files before integration with `App.js` or `HomeScreen`.
- Shared primitives before composites; composites before screens.
- Domain helpers before context consumers that use them.
- Story complete before moving to the next priority.

### Parallel Opportunities

- T002 and T003 in Phase 1 can run in parallel.
- T004 and T005 in Phase 2 can run in parallel.
- T010, T011, T012, and T013 in Phase 4 can run in parallel once the foundation is ready.
- T016 and T017 in Phase 5 can run in parallel.
- T019, T020, and T022 in Phase 6 can run in parallel.

---

## Parallel Example: User Story 2

```bash
# Launch all folder-structure tasks together:
Task: "Create frontend/src/shared/Button.js, Text.js, Card.js"
Task: "Create frontend/src/components/RoleBadge.js and HealthStatus.js"
Task: "Create frontend/src/domain/validateRole.js"
Task: "Create frontend/src/features/home/HomeScreen.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories).
3. Complete Phase 3: User Story 1 — project runs and README exists.
4. Complete Phase 4: User Story 2 — folder structure is demonstrable.
5. **STOP and VALIDATE**: run the Quickstart guide end-to-end.
6. Continue to Phase 5 only after the foundation is solid.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Project runs on a device.
3. Add User Story 2 → Test independently → Folder structure is clean.
4. Add User Story 3 → Test independently → Contexts are wired and sample screen works.
5. Polish → Update docs and validate the full quickstart.

### Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
