# Implementation Plan: Gig Packages for Freelancers

**Branch**: `006-gig-packages` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-gig-packages/spec.md`

## Summary

Freelancers need to create Gigs with multiple tiered packages (Básico, Estándar, Premium), each with distinct pricing, delivery times, and feature lists. This allows buyers to compare and select the package that fits their budget. The implementation adds package CRUD operations to the existing CreateGigScreen, displays packages as selectable tabs on GigDetailScreen, and persists package data through the existing in-memory mock layer.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React Native 0.81.0, Expo SDK 54

**Primary Dependencies**: React Navigation v7, Expo, React Native Gesture Handler, React Native Screens

**Storage**: In-memory persistence via mock data (`services/mockData.js`); AsyncStorage for cache (`services/cacheService.js`)

**Testing**: Jest (Expo default), no test files exist yet

**Target Platform**: iOS/Android via Expo Go (390×844px iPhone frame)

**Project Type**: Mobile app (React Native + Expo)

**Performance Goals**: Tab switching < 200ms perceived; gig creation < 3 minutes; search results < 500ms

**Constraints**: In-memory persistence only (no real backend); mock-first development with `USE_MOCK = true`; Spanish UI text (Argentine locale)

**Scale/Scope**: ~8 screens, 8 domain components, 4 services, 4 hooks; this feature touches 2 screens (CreateGigScreen, GigDetailScreen), 2 services (mockData, gigService), and 1 model (Gig)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. SRP | ✅ PASS | Package logic isolated in GigService + CreateGigScreen; no mixed concerns |
| II. OCP | ✅ PASS | New package types added via data, not code changes; tab UI is config-driven |
| III. LSP | ✅ PASS | No inheritance hierarchies introduced |
| IV. ISP | ✅ PASS | Package-related props are specific to the components that need them |
| V. DIP | ✅ PASS | Screens depend on service interfaces (GigService, useApiClient), not implementations |
| VI. Patterns | ✅ PASS | Factory Pattern for Gig creation with packages; Repository Pattern via existing data access |
| VII. Flexibility | ✅ PASS | Package count is data-driven (up to 3), not hardcoded in UI |
| VIII. Robustness | ✅ PASS | Validation rules defined (min 1 package, min 1 feature, non-negative price) |
| IX. Low Coupling | ✅ PASS | Package state managed within CreateGigScreen; no cross-feature state pollution |
| X. Simplicity | ✅ PASS | No premature abstractions; follows existing patterns |
| XI. High Cohesion | ✅ PASS | Package-related code lives in GigService + CreateGigScreen |
| XII. DRY | ✅ PASS | Package tab rendering extracted as reusable pattern |
| XIII. Concise Methods | ✅ PASS | No methods exceed 30 lines |
| XIV. No God Classes | ✅ PASS | No class accumulates excessive responsibilities |
| XV. No Refused Bequest | ✅ PASS | No inheritance used |

**Gate Result (Pre-Phase 0)**: PASS — no violations detected.

**Gate Result (Post-Phase 1 Design)**: PASS — data model uses embedded Package (not independent entity), maintaining cohesion. API contracts follow existing mock pattern. No new abstractions introduced. Factory Pattern applied for Gig creation with packages per Constitution VI.

## Project Structure

### Documentation (this feature)

```text
specs/006-gig-packages/
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
│   ├── screens/
│   │   ├── CreateGigScreen.js    # MODIFY: add package CRUD forms
│   │   └── GigDetailScreen.js    # MODIFY: add package tab selector
│   ├── components/
│   │   ├── PackageTabBar.js      # NEW: tab selector for packages
│   │   └── PackageCard.js        # NEW: package detail display card
│   ├── services/
│   │   ├── mockData.js           # MODIFY: add createGig mock handler
│   │   └── gigService.js         # MODIFY: add createGig, updateGig methods
│   ├── models/
│   │   └── gig.js                # MODIFY: add Package nested class
│   └── hooks/
│       └── useGigs.js            # MODIFY: add useCreateGig hook
```

**Structure Decision**: Existing two-tier architecture (frontend/) is maintained. No backend changes required — all data operations go through the existing in-memory mock layer.
