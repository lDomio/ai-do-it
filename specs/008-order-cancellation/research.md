# Research: Order Cancellation

## Unknowns Resolved

### 1. What happens to the order data model when an order is cancelled?

**Decision**: Extend the existing `Pedido` domain object with `canceladoAt` (ISO timestamp) and `canceladoPor` (user ID) fields. The status changes to `CANCELADO` via the existing `actualizarEstado` method.

**Rationale**: The spec requires recording the cancellation timestamp and acting user (FR-006). The existing domain already supports status transitions, so adding two metadata fields is the minimal change. The `Pedido.toJSON` method will expose these fields when present.

**Alternatives considered**:
- Create a separate `Cancelacion` aggregate: rejected because it adds a new repository and entity for a single state transition, violating YAGNI and simplicity.
- Store cancellation data in a generic `auditLog` array: rejected because it introduces a collection for one field pair and complicates the read path.

### 2. Where should the refund responsibility live?

**Decision**: Keep refund initiation inside `PedidoService` as a private helper method (`#iniciarReembolso(pedido)`). `PedidoService.cancelOrder(clientId, orderId)` will call this helper after validating ownership and state.

**Rationale**: For the current feature, the refund is a simple simulated side-effect (generate a `reembolso` record with `monto === total` and `estado: INICIADO`). Creating a separate `PaymentService` would be over-engineering (KISS/YAGNI). The private helper isolates the refund creation logic so that, if a future flow requires freelancer/admin approval before issuing the refund, this helper becomes the natural extraction point for a dedicated `PaymentService`.

**Alternatives considered**:
- Introduce a separate `PaymentService` now: rejected because there is no real payment provider or approval flow yet, and it adds unnecessary indirection for this iteration.
- Skip the refund implementation entirely: rejected because FR-007 and SC-002 explicitly require full refund initiation.

### 3. Which order statuses allow cancellation?

**Decision**: Cancellation is allowed from `PENDIENTE`, `CONFIRMADO`, `EN_REVISION`, and `CANCELADO` (idempotent). Cancellation is blocked from `ENTREGADO` and `COMPLETADO`.

**Rationale**: This matches the user's clarification: "pedidos que no esten en estado Entregado". The domain method `pedido.puedeCancelar()` will centralize this rule so services and tests share the same logic.

**Alternatives considered**:
- Allow cancellation from any status before `COMPLETADO`: rejected because `ENTREGADO` was explicitly excluded by the user.
- Allow cancellation from `PENDIENTE` and `CONFIRMADO` only: rejected because `EN_REVISION` is still an active, non-delivered state.

### 4. How should the frontend obtain and display refund information?

**Decision**: The backend returns the order object with `estado`, `canceladoAt`, `canceladoPor`, and `reembolso` ({ `monto`, `estado` }). The frontend displays this in `OrderDetailScreen` without storing refund state locally.

**Rationale**: The order aggregate already carries all metadata the UI needs. A single source of truth in the backend simplifies the frontend and avoids sync issues.

**Alternatives considered**:
- Create a separate `/refunds` endpoint: rejected because it adds unnecessary complexity for a single refund per order.
- Store refund status only in the frontend after cancellation: rejected because it would not survive screen reloads.

### 5. What should the cancellation endpoint semantics be?

**Decision**: Use `POST /pedidos/:id/cancel` (or `POST /orders/:id/cancel` from the frontend perspective). The body is empty because the action is inferred and the client is derived from the JWT token. The response is the updated order object.

**Rationale**: `POST` clearly signals a side-effect. Empty body keeps the contract simple. JWT-derived client ID prevents spoofing and reuses existing auth middleware.

**Alternatives considered**:
- `PUT /pedidos/:id` with `{ estado: 'Cancelado' }`: rejected because it exposes a generic state update that bypasses business rules and refund logic.
- `DELETE /pedidos/:id`: rejected because the order must remain visible, not removed.

## Research Summary

All unknowns can be resolved within the existing Express + React Native/Expo stack without adding databases, external payment providers, or message queues. The implementation will:

1. Extend `Pedido` with `canceladoAt`, `canceladoPor`, and `reembolso` fields, plus a `puedeCancelar()` guard and `cancelar(clienteId)` method.
2. Add `PedidoService.cancelOrder(clientId, orderId)` to enforce ownership, state rules, and create the refund record through a private `#iniciarReembolso(pedido)` helper.
3. Expose `POST /pedidos/:id/cancel` protected by JWT and authorized to the order's client only.
4. Extend the frontend `useOrders` hook and `OrderDetailScreen` with a cancel button and confirmation alert.
5. Add contract and integration tests for happy path, unauthorized access, invalid states, and duplicate cancellation.

> Future extraction point: if cancellation approval by freelancer/admin is added, the `#iniciarReembolso` helper in `PedidoService` should be extracted into a `PaymentService` that is called only after approval.
