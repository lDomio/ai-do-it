# Research: Order Delivery Chat

## Unknowns Resolved

### 1. How should messages be associated with orders?

**Decision**: Each message belongs to exactly one `Pedido`. The existing `Pedido` domain already has a `mensajes` array, and the repository stores orders in memory, so the simplest approach is to extend `Mensaje` with `pedidoId` and keep an order-scoped query method in `MensajeRepository`.

**Rationale**: This matches the spec requirement that chat is "inside the order" and visible only to the order's client and freelancer. It also reuses the existing `Pedido` aggregate and avoids a separate global message collection that would need cross-references.

**Alternatives considered**:
- Store messages inside the `Pedido` aggregate only: rejected because it would bloat order read/write paths and complicate independent message listing.
- Store messages in a separate global repository keyed by `pedidoId`: selected in spirit; `MensajeRepository` already exists and can be extended to query by `pedidoId`.

### 2. Should chat be allowed after the order is completed or cancelled?

**Decision**: Allow read-only access after the order reaches a terminal state (`COMPLETADO` or `CANCELADO`). Sending new messages is blocked with a clear error.

**Rationale**: This is a safe default that preserves context for disputes or reference while preventing abuse of closed orders. It aligns with the edge case in the spec asking what happens when messaging after completion/cancellation.

**Alternatives considered**:
- Hide chat entirely after completion: rejected because users may need to review past delivery conversations.
- Allow messages forever: rejected because it extends scope beyond active order management.

### 3. How should real-time updates be handled?

**Decision**: Use client-side polling with a 5-second refresh interval for this iteration. WebSockets or Server-Sent Events are out of scope.

**Rationale**: The spec explicitly rates real-time updates as P3 and says messages can still be read on reload or polling. Polling is trivial to implement with the existing REST API and `useOrderChat` hook, requires no new dependencies, and satisfies the measurable outcome of "95% of messages visible within 5 seconds."

**Alternatives considered**:
- WebSockets via `socket.io`: rejected because it adds a dependency and runtime complexity not justified for a demo app.
- Server-Sent Events: rejected because Express/CORS setup changes and mobile client support add complexity.

### 4. What is the maximum message length?

**Decision**: 2,000 characters.

**Rationale**: Long enough for detailed delivery instructions, short enough to prevent abuse or layout breakage. The backend and frontend will enforce the same limit.

**Alternatives considered**:
- 500 characters: rejected as too limiting for real-world delivery instructions.
- 10,000 characters: rejected as unnecessary and risky for mobile UI.

### 5. How is the authenticated sender identified?

**Decision**: Use the existing JWT auth middleware. The `req.user` payload contains the authenticated user ID, which is compared against the order's `cliente` and the gig's `vendedor` (freelancer). The frontend does not send a `senderId`; the backend derives it from the token.

**Rationale**: Prevents spoofing and reuses the current auth model. The frontend already sends a token via the `apiClient` helper.

**Alternatives considered**:
- Accept sender ID from request body: rejected because it is insecure and bypasses authentication.

## Research Summary

All unknowns can be resolved within the existing Express + React Native/Expo stack without adding databases, message brokers, or WebSockets. The implementation will:

1. Extend `Mensaje` with `pedidoId`, `senderType` (`CLIENTE` / `FREELANCER`), `timestamp`, and `status`.
2. Add order-scoped endpoints under `/pedidos/:id/messages` protected by JWT and authorization checks.
3. Keep terminal-order chats read-only.
4. Use 5-second polling on the frontend for near-real-time updates.
5. Enforce a 2,000-character message limit and non-empty validation on both ends.
