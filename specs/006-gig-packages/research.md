# Research: Gig Packages for Freelancers

**Date**: 2026-07-10

## Research Tasks

### R1: How should packages be structured in the existing Gig model?

**Decision**: Add a `Package` nested class inside `models/gig.js` with fields: `id`, `name`, `price`, `deliveryDays`, `features[]`.

**Rationale**: The existing `Gig` class already has a `paquetes[]` array. Adding a `Package` class with `static fromJSON()` follows the same pattern as `Gig` and `Categoria`. The Spanish field names (`nombre`, `precio`, `diasEntrega`, `caracteristicas`) map to English aliases at the service layer, consistent with the existing `Gig.fromJSON()` approach.

**Alternatives considered**:
- Separate `models/package.js` file: Rejected because Package is a value object owned by Gig, not an independent entity. Keeping it nested maintains cohesion.
- TypeScript interface only: Rejected because the codebase is plain JavaScript with ES6 classes.

### R2: How should package tabs be rendered on GigDetailScreen?

**Decision**: Create a new `PackageTabBar` component that accepts `packages[]` and `selectedIndex`, and a `PackageCard` component that renders the selected package details.

**Rationale**: The existing `GigDetailScreen.js` already has a package selector section (lines with "Básico / Estándar / Premium" tabs). Extracting this into reusable components follows the Constitution's SRP and DRY principles. The tab bar is config-driven (accepts array of packages), supporting OCP.

**Alternatives considered**:
- Inline rendering in GigDetailScreen: Rejected because it would violate SRP and prevent reuse in other screens (e.g., a future "preview gig" screen).
- Using a third-party tab library: Rejected because YAGNI — the existing UI already implements tabs manually.

### R3: How should gig creation with packages be persisted in mock mode?

**Decision**: Add a `POST /gigs` route handler in `mockData.js` that accepts a gig object with packages, generates an ID, and pushes to `mockGigs[]`. The `useCreateGig` hook will call `apiClient.post('/gigs', gigData)`.

**Rationale**: The existing mock layer uses `mockRouteHandlers` map with handler functions. Adding a POST handler follows the same pattern. The hook pattern (`useGigs`, `useOrders`) is already established.

**Alternatives considered**:
- Direct mutation of mockGigs from the screen: Rejected because it bypasses the service layer and violates DIP.
- AsyncStorage persistence: Rejected because the spec explicitly states "in-memory persistence for this phase."

### R4: What validation rules should be enforced?

**Decision**: Frontend validation before submission:
- Gig title: required, non-empty string
- At least 1 package required
- Each package: name required, price ≥ 0, deliveryDays ≥ 0, at least 1 feature
- Maximum 3 packages per gig

**Rationale**: The spec defines FR-003 (min 1 package), FR-004 (min 1 feature per package), FR-011 (non-negative price), FR-012 (non-negative delivery days). Validation follows the Robustness principle (VIII) — all inputs validated before processing.

**Alternatives considered**:
- Server-side validation only: Not applicable — mock mode, no real backend.
- No validation: Rejected because it violates the Robustness principle.

### R5: How should the "Edit Gig" flow work?

**Decision**: Reuse `CreateGigScreen` with pre-filled data. Navigation passes the gig ID; the screen fetches existing data and populates the form. On submit, it calls `PUT /gigs/:id` instead of `POST /gigs`.

**Rationale**: The Constitution's DRY principle (XII) mandates reusing the form rather than duplicating it. The existing navigation pattern (`navigation.navigate('Crear servicio', { gigId })`) supports this.

**Alternatives considered**:
- Separate EditGigScreen: Rejected because it would duplicate 90% of the form logic.
- Modal-based editing: Rejected because the form is complex and benefits from a full screen.

### R6: What is the package tab switching behavior?

**Decision**: Tab selection updates local state; the `PackageCard` re-renders with the selected package's data. No network call — packages are already loaded with the gig.

**Rationale**: All package data is loaded with the gig detail (FR-006). Tab switching is a UI-only operation, keeping it instant (< 200ms per SC-004).

**Alternatives considered**:
- Lazy-loading package details: Rejected because YAGNI — all packages are small and loaded with the gig.
- Animating tab transitions: Rejected because it adds complexity without user value for v1.
