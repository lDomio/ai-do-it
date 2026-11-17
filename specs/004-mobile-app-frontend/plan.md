# Implementation Plan: Mobile App Frontend

**Branch**: `004-mobile-app-frontend` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-mobile-app-frontend/spec.md`

## Summary

Implement the mobile app frontend for the Sweet Medical health insurance platform based on the Figma design. The app allows patients to search for medical appointments, view coverage details, book appointments, manage their appointments list, communicate with doctors via chat, and view their profile. The frontend is built with React Native (Expo) following the existing project architecture.

## Technical Context

**Language/Version**: JavaScript (ES2022+) with React Native 0.86.0 (Expo 57)

**Primary Dependencies**: React Navigation 7.x, Expo SDK 57, React 19.2.3

**Storage**: In-memory persistence (backend), AsyncStorage for local cache

**Testing**: Jest (configured in Expo), React Native Testing Library

**Target Platform**: iOS 15+ and Android 10+ via Expo

**Project Type**: Mobile app (patient-facing)

**Performance Goals**: 60fps UI rendering, <2s API response handling, offline viewing of cached data

**Constraints**: Offline-capable for viewing previously loaded appointments, graceful error handling for network failures

**Scale/Scope**: 6 screens (Home, Search, Appointment Detail, My Appointments, Appointment Detail with Chat, Profile), 5 reusable components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Checked Principles:

✅ **I. Single Responsibility (SRP)**: Each screen will handle only UI rendering; business logic delegated to hooks and services

✅ **II. Open/Closed (OCP)**: Components will accept props for configuration; new screens can be added without modifying existing ones

✅ **III. Liskov Substitution (LSP)**: N/A - no inheritance hierarchy planned

✅ **IV. Interface Segregation (ISP)**: Component props will include only what each component needs

✅ **V. Dependency Inversion (DIP)**: Screens will depend on service interfaces via hooks, not concrete implementations

✅ **VI. Design Patterns**: Repository pattern for data access, Observer pattern for real-time updates, Strategy pattern for sorting/filtering

✅ **VII. Flexibility**: New features addable via new screens/components without modifying stable code

✅ **VIII. Robustness**: All API calls will have error handling; inputs validated before processing

✅ **IX. Low Coupling**: Communication through well-defined interfaces and Context API

✅ **X. Simplicity (YAGNI + KISS)**: Only building what's in current requirements

✅ **XI. High Cohesion**: Related functionality grouped in feature modules

✅ **XII. No Code Duplication (DRY)**: Shared components in shared/ directory

✅ **XIII. Concise Methods**: Methods will be <30 lines, functions <4 parameters

✅ **XIV. No God Classes**: No component will exceed 200 lines

✅ **XV. No Refused Bequest**: Using composition over inheritance

**Result**: All principles pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/004-mobile-app-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── screens/                    # React Native screens
│   │   ├── HomeScreen.js           # Patient home dashboard
│   │   ├── SearchScreen.js         # Appointment search
│   │   ├── AppointmentDetailScreen.js  # Appointment detail & booking
│   │   ├── MyAppointmentsScreen.js # Patient's appointments list
│   │   ├── AppointmentChatScreen.js # Chat with doctor
│   │   └── ProfileScreen.js        # Patient profile
│   ├── components/                 # Reusable UI components
│   │   ├── AppointmentCard.js      # Appointment display card
│   │   ├── CoverageBadge.js        # Coverage level indicator
│   │   ├── DoctorInfo.js           # Doctor information display
│   │   ├── FilterPanel.js          # Search filters
│   │   └── StatusStepper.js        # Appointment status progression
│   ├── shared/                     # Shared UI primitives
│   │   ├── AppButton.js            # Button component
│   │   ├── AppCard.js              # Card container
│   │   ├── AppText.js              # Text component
│   │   └── AppInput.js             # Input component
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAppointments.js      # Appointment CRUD operations
│   │   ├── useSearch.js            # Search & filter logic
│   │   └── useChat.js              # Chat messaging
│   ├── services/                   # API client
│   │   └── apiClient.js            # HTTP client configuration
│   ├── context/                    # React Context
│   │   ├── AuthContext.js          # Authentication state
│   │   └── AppContext.js           # App-wide state (appointments, etc.)
│   └── navigation/                 # React Navigation setup
│       └── AppNavigator.js         # Screen navigation configuration
└── tests/
    ├── components/                 # Component tests
    └── screens/                    # Screen tests
```

**Structure Decision**: Extending the existing frontend structure with new screens, components, hooks, and navigation. Following the feature-based organization pattern already established in the project.
