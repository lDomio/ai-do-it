# Data Model: Frontend Scaffolding and Initial Configuration

This feature does not introduce domain entities such as `Gig`, `Order`, or `Review`. Instead, it introduces the **configuration and shared-state objects** that every later feature will consume. The in-memory data lives in React Context providers.

## Entities

### ApiConfig

Shared configuration object for backend communication.

| Field | Type | Description |
|-------|------|-------------|
| `baseUrl` | string | Full URL of the backend API, e.g. `http://192.168.1.42:3000`. |
| `timeoutMs` | number | Default request timeout in milliseconds. |

### DemoRole

Shared state object representing the active persona during the demo.

| Field | Type | Description |
|-------|------|-------------|
| `role` | enum (`cliente` \| `freelancer`) | Current demo role. |
| `setRole` | function | Setter exposed by the context provider to toggle the role. |

### SourceFolder

Project-structure concept, not a runtime entity. Each source file under `frontend/src/` belongs to exactly one of:

- `features/` — screens and feature-local helpers.
- `shared/` — primitive UI components.
- `components/` — reusable composite UI components.
- `context/` — shared-state providers.
- `domain/` — pure business logic with no React Native or UI imports.

## Validation Rules

- `baseUrl` MUST be a non-empty string and SHOULD contain a protocol and host.
- `role` MUST be either `cliente` or `freelancer`; any other value is rejected with an explicit error.

## State Transitions

- `DemoRole` can transition freely between `cliente` and `freelancer` at any time. Toggling to the same role MUST be a no-op to avoid unnecessary re-renders.
