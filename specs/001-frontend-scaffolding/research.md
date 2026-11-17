# Research: Frontend Scaffolding and Initial Configuration

**Feature**: Frontend Scaffolding and Initial Configuration
**Date**: 2026-07-07

## Unknowns and Decisions

### 1. Mobile framework toolchain

- **Decision**: Use Expo with `create-expo-app` as the React Native bootstrap.
- **Rationale**: The user has no prior React Native experience but knows React/Angular. Expo removes native-build complexity, ships a dev client that runs on emulators and physical devices over the LAN, and provides `npx expo start` which scans a QR code from a phone. This satisfies SC-001 (runnable within 10 minutes) and the constitution's Stack-First principle for React Native.
- **Alternatives considered**:
  - Bare React Native CLI — gives more control but requires Android SDK/Xcode setup and longer onboarding; rejected because it conflicts with the 10-minute success criterion.
  - React Native Community template — similar to bare CLI; rejected for the same reason.

### 2. Dependency management and minimal runtime dependencies

- **Decision**: Use the dependencies shipped by `create-expo-app` and add only `react-native-safe-area-context` and a HTTP client (`axios` or hand-rolled `fetch`).
- **Rationale**: Expo already bundles React Native, React, metro, and the dev server. Adding axios is a common industry default for interceptors, but a thin `fetch` wrapper is enough for the assignment and aligns with the Simplicity principle. The final implementation will use the simplest option that supports a base URL and JSON parsing.
- **Alternatives considered**:
  - Apollo/GraphQL client — overkill; the back-end is REST/JSON.
  - React Query/SWR — useful but adds a runtime dependency and learning curve for a first React Native project; rejected at scaffolding stage.
  - Redux/Zustand — global state is handled by React Context per the user's request; rejected to keep state management explicit and simple.

### 3. Folder structure

- **Decision**: Adopt the structure defined in the constitution:
  - `frontend/src/features/` — screens + feature-local hooks/components.
  - `frontend/src/shared/` — design-system primitives (`Button`, `Text`, `Input`, `Card`, `Spacer`, `Theme`).
  - `frontend/src/components/` — cross-feature composites (`GigCard`, `OrderStatusBadge`, `MessageBubble`).
  - `frontend/src/context/` — React Context providers (`ApiConfigContext`, `DemoRoleContext`).
  - `frontend/src/domain/` — rich domain models. Pure business helpers and entities (validation, date math, rating average, configuration objects) with no React Native imports, implemented as ES6 classes to encapsulate state and behavior.
- **Rationale**: The user explicitly requested this layout and a class-based rich domain, which maps cleanly to SOLID/FRASCo goals and mirrors the backend architecture. It prevents God files by design.
- **Alternatives considered**:
  - Standard Expo `App.js` + assets only — too flat; rejected because it cannot demonstrate architecture.
  - `atomic-design` folders (atoms/molecules/organisms) — common in industry but adds vocabulary overhead for a learner; rejected in favor of the user's requested names.
  - Plain function/objects for domain logic — simpler but does not demonstrate the rich-domain, object-oriented style requested by the team; rejected.

### 4. TypeScript vs. JavaScript

- **Decision**: Use TypeScript templates (`--template blank-typescript`) if `create-expo-app` offers it; otherwise plain JavaScript with JSDoc-style types.
- **Rationale**: The user knows React/Angular and the assignment does not require TypeScript. TypeScript improves robustness but adds compile-time friction for a first React Native build. If the Expo TypeScript template works out of the box, use it; otherwise stay with JavaScript to keep the demo path simple and match the existing backend (plain JS).
- **Alternatives considered**:
  - Strict TypeScript with typed API contracts — valuable later; deferred to the typed-API-client industry-alternative investigation.

### 5. Navigation

- **Decision**: Install `@react-navigation/native` and the stack navigator once the Expo project exists.
- **Rationale**: The assignment brief and `docs/tareas-frontend.md` call for tab + stack navigation. Setting up the dependency now lets later feature stories focus on screens rather than wiring.
- **Alternatives considered**:
  - Expo Router — newer, file-system based; useful but less documented in the existing task list. Stick with React Navigation because it is explicitly mentioned in `docs/tareas-frontend.md`.

## Open Investigations

- **Industry alternative: typed API client** — investigate `zod` or plain TypeScript interfaces to keep front-end types aligned with backend contracts. This is deferred to a later feature because scaffolding should not add runtime validation dependencies.
- **Industry alternative: WebSockets for chat** — documented in the constitution as a candidate. No decision needed for scaffolding; the chat feature spec will evaluate REST polling vs. WebSockets.
