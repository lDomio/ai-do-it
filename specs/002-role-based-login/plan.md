# Implementation Plan: Role-Based Login with JWT Authentication

**Branch**: `002-role-based-login` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-role-based-login/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement JWT-based authentication with 1-hour access tokens and token rotation (refresh token pattern) for the AI Do It platform. Users will authenticate via email/password, receive short-lived access tokens and long-lived refresh tokens. Token rotation ensures each refresh token is used only once, enhancing security. Role-based access control will restrict features based on user roles (admin, client, freelancer).

## Technical Context

**Language/Version**: JavaScript/TypeScript (Node.js 20+)

**Primary Dependencies**: Express, jsonwebtoken, bcryptjs, cors

**Storage**: In-memory persistence (as per project requirements)

**Testing**: Jest (already configured), with unit and integration tests

**Target Platform**: Node.js server backend, React Native (Expo) frontend

**Project Type**: Web application (frontend + backend)

**Performance Goals**: Standard web application performance (< 200ms response time for auth endpoints)

**Constraints**: In-memory storage (no external databases), must comply with SOLID principles and project constitution

**Scale/Scope**: Small-scale educational project (single-user development, not production-grade)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principles Evaluation

1. **SRP (Single Responsibility)**: ✅ AuthService handles authentication only, middleware handles token verification separately.
2. **OCP (Open/Closed)**: ✅ Authentication method can be extended (e.g., OAuth) without modifying existing login logic.
3. **LSP (Liskov Substitution)**: ✅ Not applicable (no inheritance hierarchy yet).
4. **ISP (Interface Segregation)**: ✅ Auth interfaces are focused (login, register, refresh, logout).
5. **DIP (Dependency Inversion)**: ✅ AuthService depends on repository abstraction, not concrete implementation.

### Design Patterns
- **Repository Pattern**: ✅ Already implemented (UsuarioRepository)
- **Strategy Pattern**: ✅ Can be used for different token generation strategies
- **Observer Pattern**: ✅ Can be used for token expiration events (future)

### Quality Attributes
- **Flexibility**: ✅ Token rotation pattern allows easy adjustment of expiration times
- **Robustness**: ✅ Will implement proper error handling for token validation failures
- **Low Coupling**: ✅ Auth module decoupled from business logic via middleware
- **Simplicity**: ✅ JWT implementation follows standard patterns without over-engineering
- **High Cohesion**: ✅ Auth-related functions grouped in dedicated module

**Gate Status**: PASS - No violations detected. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-role-based-login/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/     # HTTP request/response handling
│   ├── services/        # Business logic (AuthService, etc.)
│   ├── repositories/    # Data access (UsuarioRepository)
│   ├── models/          # Domain entities (Usuario)
│   ├── middleware/       # Express middleware (auth, validation, errorHandler)
│   ├── routes/          # API route definitions
│   ├── enums/           # Enumerations (RolUsuario)
│   └── errors/          # Custom error classes
└── tests/

frontend/
├── src/
│   ├── screens/         # React Native screens (Login, Dashboard)
│   ├── components/      # Reusable UI components
│   ├── services/        # API client + business logic
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # React Navigation setup
│   ├── context/         # React context (DemoRoleContext)
│   └── domain/          # Domain logic (validateRole, etc.)
└── tests/
```

**Structure Decision**: The project follows a two-tier architecture with clear separation between backend (Node.js/Express) and frontend (React Native). Authentication will be implemented in backend services with middleware for token verification. Frontend will store tokens securely and handle token refresh.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |