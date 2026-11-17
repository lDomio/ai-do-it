# Research: Visualización Paginada de Pedidos

**Feature**: 003-order-view-paginated
**Date**: 2026-07-09

## Research Items

### 1. Pagination Strategy for In-Memory Storage

**Decision**: Server-side pagination with `page` query parameter and fixed `pageSize=10`. Response includes `items`, `totalItems`, `currentPage`, `totalPages`.

**Rationale**: In-memory Map has no native pagination. `Array.from()` + `slice()` is the simplest approach. Server-side pagination avoids transferring all orders to the client — aligns with FR-001 and FR-003.

**Alternatives considered**:
- Client-side pagination (fetch all, paginate in UI): Rejected — wasteful for large datasets, violates FR-001.
- Cursor-based pagination: Overkill for in-memory storage; offset-based is sufficient and simpler.

### 2. Order Filtering by Client

**Decision**: Add `findByCliente(clientId, page, pageSize)` method to `PedidoRepository`. Filter by `pedido.cliente === clientId`. The `PedidoController` will read `req.user.id` from the JWT payload (set by `authenticate` middleware).

**Rationale**: FR-004 requires client-scoped filtering. The `authenticate` middleware already sets `req.user = { id, email, rol }`. The `Pedido` model has a `cliente` field (set at creation). Filtering at repository level keeps service layer thin.

**Alternatives considered**:
- Filtering in service layer: Adds unnecessary code; repository already owns data access.
- Adding a separate query parameter for clientId: Less secure — client shouldn't be able to query other clients' orders.

### 3. Auth Middleware Application to Pedidos Routes

**Decision**: Apply `authenticate` middleware to the new `GET /pedidos/cliente/:clienteId` route only. Do NOT apply to existing CRUD routes (to avoid breaking changes).

**Rationale**: The existing CRUD routes are unprotected (all entities). Adding auth to the new route follows the constitution's robustness principle (VIII) without breaking existing functionality. Future work can add auth to other routes.

**Alternatives considered**:
- Apply to all pedidos routes: Would break existing behavior; other features depend on unauthenticated CRUD.
- Skip auth entirely: Violates FR-004 (client-scoped filtering requires authentication).

### 4. Delivery Estimate Calculation

**Decision**: Calculate as `SLA_DAYS - daysSinceConfirmation`, where `SLA_DAYS = 5` (configurable constant). If result <= 0, show "Entrega estimada hoy". Stored as constant in `PedidoService`.

**Rationale**: FR-009 specifies fixed SLA from confirmation date. The `Pedido` domain model has `fechaConfirmacion` (or equivalent timestamp). Calculation is simple arithmetic — no external service needed.

**Alternatives considered**:
- Configurable per gig/package: Overkill for current requirements; YAGNI (Principle X).
- External delivery service integration: Not specified in requirements; out of scope.

### 5. Frontend Data Fetching Pattern

**Decision**: Create `usePedidos(clientId, page)` custom hook that calls `GET /pedidos/cliente/:clienteId?page=N` via `useApiClient`. Returns `{ pedidos, totalItems, totalPages, currentPage, loading, error }`.

**Rationale**: Follows existing pattern (`useApiClient` hook for API calls). Custom hook encapsulates pagination state. Constitution Principle I (SRP) — data fetching separated from UI rendering.

**Alternatives considered**:
- Redux/Context for state: Overkill for a single screen; local state in hook is sufficient.
- Direct fetch in component: Violates Principle I (components must not contain API calls).

### 6. Status Badge Color Mapping

**Decision**: Use color map constant: `{ Pendiente: '#f59e0b', Confirmado: '#3b82f6', 'En revisión': '#8b5cf6', Entregado: '#22c55e', Cancelado: '#ef4444' }`. Follows common UI conventions.

**Rationale**: FR-006 specifies distinct colors. The `EstadoPedido` enum values are human-readable Spanish strings. Color map in component keeps mapping centralized.

**Alternatives considered**:
- Dynamic color from backend: Would require API changes; unnecessary coupling.
- Configurable colors per user: YAGNI; not in requirements.

## Open Questions Resolved

| Question | Answer |
|----------|--------|
| What is the SLA for delivery? | 5 business days from confirmation (configurable constant) |
| How many orders per page? | 10 (configurable) |
| Who can see orders? | Authenticated client sees only their own orders |
| Where does confirmation date come from? | From the `Pedido` record (set when status changes to CONFIRMADO) |
| How to handle empty state? | Show "No tienes pedidos aún" message |
