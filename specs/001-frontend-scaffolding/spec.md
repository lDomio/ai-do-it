# Feature Specification: Frontend Scaffolding and Initial Configuration

**Feature Branch**: `[001-frontend-scaffolding]`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "quiero que implementemos el scaffolding del frontend y su configuración inicial"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initialize Frontend Project (Priority: P1)

As a developer, I want the mobile frontend project created and runnable on a local device so that I can verify the foundation before building any user-facing feature.

**Why this priority**: Without a runnable project, no screen, component, or service can be validated on a real mobile device. This is the blocking foundation for every other frontend story.

**Independent Test**: A teammate can clone the repository, run the documented install command, start the development server, and see the default application running on an emulator or physical mobile device.

**Acceptance Scenarios**:

1. **Given** the repository has just been cloned, **When** the developer installs dependencies and starts the development server, **Then** the application launches without errors and shows an initial screen.
2. **Given** the development server is running, **When** the developer opens the application on a mobile device connected to the same local network, **Then** the application renders and responds to touch input.

---

### User Story 2 - Establish Frontend Folder Structure (Priority: P1)

As a developer, I want the source code organized into `features/`, `shared/`, `components/`, `context/`, and `domain/` folders so that each file has a single, clear responsibility and the codebase remains teachable.

**Why this priority**: The requested layout directly supports the project's code-quality principles. Establishing it before the first feature prevents God files, reduces coupling between screens, and makes the architecture easy to explain in the demo video.

**Independent Test**: A reviewer can inspect `frontend/src/` and confirm that every file belongs to one of the five defined folders and that no file mixes UI, state, networking, or business logic.

**Acceptance Scenarios**:

1. **Given** the frontend project exists, **When** the documented folder structure is applied, **Then** `features/`, `shared/`, `components/`, `context/`, and `domain/` folders exist with a representative starter file in each.
2. **Given** a new screen needs to be added, **When** the developer creates it, **Then** there is exactly one folder where the screen belongs and clear guidance for when to place helper code in `domain/` instead of the screen file.

---

### User Story 3 - Configure API Client and Shared State (Priority: P2)

As a developer, I want a single place to configure the backend base URL and a single context to share the current demo role (client or freelancer) so that every feature uses the same conventions for data access and global state.

**Why this priority**: This avoids duplicated configuration strings and role-handling logic across screens. It also lets the demo video switch between client and freelancer perspectives with a single control.

**Independent Test**: A reviewer can change the backend URL or demo role in one file and observe that every sample request and role-aware component updates consistently.

**Acceptance Scenarios**:

1. **Given** the frontend project is running, **When** the backend URL is configured in the shared context, **Then** a sample health-check request reaches the backend and displays its response.
2. **Given** the role selector is toggled between client and freelancer, **When** a role-aware sample component renders, **Then** it reflects the selected role without reloading the application.

---

### Edge Cases

- What happens when the backend URL is unreachable? The application shows a clear, user-friendly error message and falls back to an offline-friendly state.
- What happens when the same role is selected twice? The shared state remains stable and does not trigger unnecessary re-renders.
- What happens when a file is placed in the wrong folder? The project guidelines (constitution + README) make the intended location explicit, and code review enforces the rule.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a runnable mobile frontend project under `frontend/` that can be started with a single documented command.
- **FR-002**: System MUST expose the project on the local network so a physical or emulated mobile device can reach it.
- **FR-003**: System MUST organize source code under `frontend/src/` using the folders `features/`, `shared/`, `components/`, `context/`, and `domain/`.
- **FR-004**: System MUST include at least one starter file in each of the five folders so the structure is demonstrable.
- **FR-005**: System MUST provide a shared context for the backend base URL configuration used by all API client modules.
- **FR-006**: System MUST provide a shared context for the demo user role (`cliente` or `freelancer`) used by role-aware screens.
- **FR-007**: System MUST display a default landing screen that confirms the project is running and links to the requested folder-structure documentation.
- **FR-008**: System MUST include a `frontend/README.md` that documents install, start, device pairing, and folder responsibilities.

### Key Entities

- **FrontendProject**: the React Native project under `frontend/`, including its dependencies, scripts, and configuration files.
- **SourceFolder**: one of `features/`, `shared/`, `components/`, `context/`, or `domain/` under `frontend/src/`.
- **ApiConfig**: shared configuration containing the backend base URL and HTTP client defaults.
- **DemoRole**: shared state representing the current user's role for demo purposes (`cliente` or `freelancer`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new developer can clone the repository and see the application running on a mobile device within 10 minutes of following the README.
- **SC-002**: 100% of source files under `frontend/src/` are placed in one of the five defined folders with no orphan files in the root of `src/`.
- **SC-003**: Every file in `frontend/src/shared/` is a design-system primitive usable by at least two other files without modification.
- **SC-004**: A single change to the backend base URL propagates to every API client module without requiring edits to individual screens or services.
- **SC-005**: The folder responsibilities are documented in `frontend/README.md` and understandable to a reviewer with no prior React Native experience.

## Clarifications

### Session 2026-07-07

- Q: Should frontend domain entities encapsulate state and behavior like the backend rich domain? → A: Yes, domain entities in `frontend/src/domain/` MUST encapsulate state, invariants, and behavior. The choice of language construct (e.g., ES6 classes, factory functions) is left to the implementation plan.

## Assumptions

- The frontend is implemented with React Native as required by the assignment brief; Expo is the recommended toolchain to minimize mobile-device setup friction.
- The project runs on a local network; the backend URL in development uses the machine's LAN IP rather than `localhost` so a physical device can reach it.
- No authentication is required at this stage; the role context is purely for demo switching.
- The folder structure aligns with the constitution's "Frontend Scaffolding Structure" section and the user's explicit request.
- Domain helpers and entities in `frontend/src/domain/` follow a rich-domain style that encapsulates state and validation logic, matching the architectural approach requested by the team.
