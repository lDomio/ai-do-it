# Tasks: Role-Based Login with JWT Authentication

**Input**: Design documents from `/specs/002-role-based-login/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. The user did not request tests, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths based on existing project structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for token rotation

- [X] T001 [P] Install cookie-parser dependency in backend
- [X] T002 [P] Configure cookie-parser middleware in Express app
- [X] T003 [P] Create environment variables for refresh token secret (REFRESH_TOKEN_SECRET)
- [X] T004 [P] Update auth.js middleware to export generateRefreshToken function

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create RefreshTokenRepository in backend/src/repositories/RefreshTokenRepository.js
- [X] T006 Create RefreshTokenService in backend/src/services/RefreshTokenService.js (depends on T005)
- [X] T007 Implement rate limiting middleware in backend/src/middleware/rateLimiter.js
- [X] T008 Update AuthService to include refresh token generation on login/register (depends on T006)
- [X] T009 Create token cleanup service for expired refresh tokens in backend/src/services/TokenCleanupService.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Basic Login Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can login with email/password and receive JWT access token + refresh token

**Independent Test**: Can be fully tested by creating a test user account, logging in with valid credentials, and verifying both tokens are returned. Delivers secure access to the system.

### Implementation for User Story 1

- [X] T010 [P] [US1] Update login endpoint to return refresh token in httpOnly cookie
- [X] T011 [P] [US1] Update register endpoint to return refresh token in httpOnly cookie
- [X] T012 [US1] Modify AuthService.login to generate refresh token and store in repository
- [X] T013 [US1] Modify AuthService.register to generate refresh token and store in repository
- [X] T014 [US1] Update AuthController to handle cookie setting for refresh token
- [X] T015 [US1] Add cookie configuration (httpOnly, secure, sameSite, path, maxAge)
- [X] T016 [US1] Update frontend login screen to handle token refresh flow

**Checkpoint**: At this point, User Story 1 should be fully functional - users can login and receive both tokens

---

## Phase 4: User Story 2 - Role-Based Access After Login (Priority: P2)

**Goal**: Different interface options based on user role (admin, client, freelancer)

**Independent Test**: Can be tested by logging in with different role accounts and verifying that each sees appropriate menu options and screens. Delivers role-tailored user experience.

### Implementation for User Story 2

- [X] T017 [P] [US2] Create role-based navigation component in frontend/src/components/RoleBasedNavigation.js
- [X] T018 [P] [US2] Create admin dashboard screen in frontend/src/screens/AdminDashboard.js
- [X] T019 [P] [US2] Create client dashboard screen in frontend/src/screens/ClientDashboard.js
- [X] T020 [P] [US2] Create freelancer dashboard screen in frontend/src/screens/FreelancerDashboard.js
- [X] T021 [US2] Implement role-based routing in frontend/src/navigation/AppNavigator.js
- [X] T022 [US2] Add role-based access control to protected routes using existing requireRole middleware
- [X] T023 [US2] Update frontend to display role-specific menu options after login

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Session Management (Priority: P3)

**Goal**: Session persistence with token rotation and secure logout

**Independent Test**: Can be tested by logging in, using the app for a period, verifying session persists, then logging out and verifying session is terminated. Delivers balanced security and convenience.

### Implementation for User Story 3

- [X] T024 [P] [US3] Implement POST /auth/refresh endpoint in backend/src/routes/auth.js
- [X] T025 [P] [US3] Implement POST /auth/logout endpoint in backend/src/routes/auth.js
- [X] T026 [US3] Add refresh token rotation logic in RefreshTokenService
- [X] T027 [US3] Implement token reuse detection and family revocation
- [X] T028 [US3] Update AuthController with refresh and logout methods
- [X] T029 [US3] Add automatic token refresh interceptor in frontend API client
- [X] T030 [US3] Implement logout functionality in frontend (clear tokens, redirect to login)
- [X] T031 [US3] Add session expiration handling (30 minutes inactivity)
- [X] T032 [US3] Implement rate limiting on auth endpoints (5 attempts/min for login, 10/min for refresh)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T033 [P] Update error handling for token-related errors
- [X] T034 [P] Add logging for authentication events (login, refresh, logout)
- [X] T035 [P] Implement token cleanup scheduled job (daily removal of expired tokens)
- [X] T036 Update quickstart.md validation guide with actual implementation details
- [X] T037 Run quickstart.md validation scenarios to verify end-to-end flow
- [X] T038 Update documentation for new auth endpoints

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tasks for User Story 1 together:
Task: "Update login endpoint to return refresh token in httpOnly cookie"
Task: "Update register endpoint to return refresh token in httpOnly cookie"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence