# Tasks: Mobile App Frontend

**Input**: Design documents from `/specs/004-mobile-app-frontend/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the feature specification - excluded from task generation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/`
- **Screens**: `frontend/src/screens/`
- **Components**: `frontend/src/components/`
- **Hooks**: `frontend/src/hooks/`
- **Services**: `frontend/src/services/`
- **Context**: `frontend/src/context/`
- **Navigation**: `frontend/src/navigation/`
- **Shared**: `frontend/src/shared/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create navigation directory structure in frontend/src/navigation/
- [X] T002 [P] Create screens directory structure in frontend/src/screens/
- [X] T003 [P] Create hooks directory structure in frontend/src/hooks/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create AppContext for global state management in frontend/src/context/AppContext.js
- [X] T005 [P] Create AppInput shared component in frontend/src/shared/AppInput.js
- [X] T006 [P] Create theme configuration with colors and typography in frontend/src/theme.js
- [X] T007 [P] Extend apiClient.js with appointment-related API methods in frontend/src/services/apiClient.js
- [X] T008 [P] Create AppNavigator with basic screen structure in frontend/src/navigation/AppNavigator.js
- [X] T009 [P] Create CoverageBadge component in frontend/src/components/CoverageBadge.js
- [X] T010 [P] Create StatusBadge component for appointment statuses in frontend/src/components/StatusBadge.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Patient Home Dashboard (Priority: P1) 🎯 MVP

**Goal**: Patient sees personalized home screen with upcoming appointments and quick actions

**Independent Test**: Login as patient, verify greeting, upcoming appointments list, and navigation buttons work

### Implementation for User Story 1

- [X] T011 [P] [US1] Create useAppointments hook for fetching patient appointments in frontend/src/hooks/useAppointments.js
- [X] T012 [P] [US1] Create AppointmentCard component in frontend/src/components/AppointmentCard.js
- [X] T013 [US1] Implement HomeScreen with greeting, upcoming appointments, and action buttons in frontend/src/screens/HomeScreen.js
- [X] T014 [US1] Integrate HomeScreen with AppNavigator navigation in frontend/src/navigation/AppNavigator.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Appointment Search (Priority: P1)

**Goal**: Patient can search for available appointments by specialty, date, and location

**Independent Test**: Navigate to search, apply filters, verify results display correctly with coverage info

### Implementation for User Story 2

- [X] T015 [P] [US2] Create useSearch hook for search logic and filters in frontend/src/hooks/useSearch.js
- [X] T016 [P] [US2] Create FilterPanel component for specialty/date/location filters in frontend/src/components/FilterPanel.js
- [X] T017 [US2] Implement SearchScreen with filters and results list in frontend/src/screens/SearchScreen.js
- [X] T018 [US2] Integrate SearchScreen with AppNavigator navigation in frontend/src/navigation/AppNavigator.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Appointment Detail and Booking (Priority: P1)

**Goal**: Patient views appointment details and books available appointments

**Independent Test**: Select appointment from search, view details, complete booking flow, verify confirmation

### Implementation for User Story 3

- [X] T019 [P] [US3] Create DoctorInfo component for doctor details display in frontend/src/components/DoctorInfo.js
- [X] T020 [US3] Implement AppointmentDetailScreen with doctor info, coverage, and booking in frontend/src/screens/AppointmentDetailScreen.js
- [X] T021 [US3] Add booking functionality with validation and error handling in frontend/src/screens/AppointmentDetailScreen.js
- [X] T022 [US3] Integrate AppointmentDetailScreen with AppNavigator navigation in frontend/src/navigation/AppNavigator.js

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - My Appointments List (Priority: P2)

**Goal**: Patient views all their appointments (active and past) with status

**Independent Test**: Navigate to My Appointments, verify active/history tabs, appointment cards with status

### Implementation for User Story 4

- [X] T023 [P] [US4] Create StatusStepper component for appointment status progression in frontend/src/components/StatusStepper.js
- [X] T024 [US4] Implement MyAppointmentsScreen with active/history tabs in frontend/src/screens/MyAppointmentsScreen.js
- [X] T025 [US4] Add appointment cancellation functionality with 1-hour validation in frontend/src/screens/MyAppointmentsScreen.js
- [X] T026 [US4] Integrate MyAppointmentsScreen with AppNavigator navigation in frontend/src/navigation/AppNavigator.js

**Checkpoint**: User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Appointment Detail with Chat (Priority: P2)

**Goal**: Patient communicates with doctor through chat interface on appointment detail

**Independent Test**: Open appointment with chat, send message, verify message appears in conversation

### Implementation for User Story 5

- [X] T027 [P] [US5] Create useChat hook for chat messaging logic in frontend/src/hooks/useChat.js
- [X] T028 [US5] Add chat tab and messaging interface to AppointmentDetailScreen in frontend/src/screens/AppointmentDetailScreen.js
- [X] T029 [US5] Add status stepper to AppointmentDetailScreen in frontend/src/screens/AppointmentDetailScreen.js

**Checkpoint**: User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Patient Profile (Priority: P3)

**Goal**: Patient views and manages their profile information and stats

**Independent Test**: Navigate to Profile, verify patient info, stats, and recent appointments display

### Implementation for User Story 6

- [X] T030 [P] [US6] Create ProfileScreen with patient info and stats in frontend/src/screens/ProfileScreen.js
- [X] T031 [US6] Add recent appointments list to ProfileScreen in frontend/src/screens/ProfileScreen.js
- [X] T032 [US6] Integrate ProfileScreen with AppNavigator navigation in frontend/src/navigation/AppNavigator.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T033 [P] Add offline caching with AsyncStorage for appointments in frontend/src/services/cacheService.js
- [X] T034 [P] Add error handling and loading states to all screens
- [X] T035 [P] Add input validation to all forms
- [X] T036 Update App.js to use AppNavigator in frontend/App.js
- [X] T037 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 (P1) can proceed in parallel after Foundational
  - US4, US5 (P2) can proceed after US1-US3 or in parallel if staffed
  - US6 (P3) can proceed after Foundational or in parallel
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Uses US2 search results
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Uses US3 appointment detail
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Extends US3 appointment detail
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Independent

### Within Each User Story

- Core components before screens
- Hooks before screens that use them
- Screens before navigation integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, US1, US2, US3 can start in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create useAppointments hook for fetching patient appointments in frontend/src/hooks/useAppointments.js"
Task: "Create AppointmentCard component in frontend/src/components/AppointmentCard.js"

# Then implement screen:
Task: "Implement HomeScreen with greeting, upcoming appointments, and action buttons in frontend/src/screens/HomeScreen.js"

# Finally integrate navigation:
Task: "Integrate HomeScreen with AppNavigator navigation in frontend/src/navigation/AppNavigator.js"
```

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks together:
Task: "Create AppContext for global state management in frontend/src/context/AppContext.js"
Task: "Create AppInput shared component in frontend/src/shared/AppInput.js"
Task: "Create theme configuration with colors and typography in frontend/src/theme.js"
Task: "Extend apiClient.js with appointment-related API methods in frontend/src/services/apiClient.js"
Task: "Create AppNavigator with basic screen structure in frontend/src/navigation/AppNavigator.js"
Task: "Create CoverageBadge component in frontend/src/components/CoverageBadge.js"
Task: "Create StatusBadge component for appointment statuses in frontend/src/components/StatusBadge.js"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Home Dashboard)
4. Complete Phase 4: User Story 2 (Search)
5. Complete Phase 5: User Story 3 (Booking)
6. **STOP and VALIDATE**: Test booking flow end-to-end
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo (Complete booking flow!)
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Home)
   - Developer B: User Story 2 (Search)
   - Developer C: User Story 3 (Booking)
3. Stories complete and integrate independently
4. Then:
   - Developer A: User Story 4 (My Appointments)
   - Developer B: User Story 5 (Chat)
   - Developer C: User Story 6 (Profile)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Total tasks: 37
- Tasks per story: US1 (4), US2 (4), US3 (4), US4 (4), US5 (3), US6 (3)
