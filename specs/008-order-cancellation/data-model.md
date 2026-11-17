# Data Model: Order Cancellation

## Overview

Cancellation is a state transition on the existing `Pedido` aggregate. When a client cancels an eligible order, the order status moves to `CANCELADO`, the system records when and who cancelled it, and a refund record is attached. All changes are persisted within the existing in-memory `PedidoRepository`.

## Entities

### `Pedido` (extended)

The existing order aggregate with additional cancellation metadata.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | yes | Unique order identifier. |
| `cliente` | string | yes | ID of the client who placed the order. |
| `gig` | string | yes | ID of the gig purchased. Used to resolve the freelancer via `Gig.vendedor`. |
| `estado` | enum | yes | Current order status. |
| `total` | number | yes | Total amount paid or payable for the order. |
| `fechaCreacion` | ISO timestamp | yes | When the order was created. |
| `fechaConfirmacion` | ISO timestamp | no | When the order was confirmed (if applicable). |
| `canceladoAt` | ISO timestamp | no | When the order was cancelled (if `estado === CANCELADO`). |
| `canceladoPor` | string | no | ID of the user who cancelled the order (must equal `cliente`). |
| `reembolso` | object | no | Refund summary attached after cancellation. |

#### `reembolso` object

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `monto` | number | yes | Refund amount, equal to `Pedido.total` at cancellation time. |
| `estado` | enum | yes | `INICIADO`, `COMPLETADO`, or `FALLIDO`. |
| `fechaInicio` | ISO timestamp | yes | When the refund was initiated. |

**Validation rules**:
- `canceladoAt` and `canceladoPor` must be present when `estado === CANCELADO`.
- `canceladoPor` must equal `Pedido.cliente`.
- `reembolso.monto` must equal the order `total` and must be non-negative.
- Cancellation is only allowed when `estado` is `PENDIENTE`, `CONFIRMADO`, `EN_REVISION`, or already `CANCELADO`.

### `EstadoPedido` (existing)

| Value | Description |
|-------|-------------|
| `PENDIENTE` | Order created, not yet confirmed. |
| `CONFIRMADO` | Order confirmed and in progress. |
| `EN_REVISION` | Work delivered and under client review. |
| `ENTREGADO` | Work delivered, not yet approved/completed. |
| `COMPLETADO` | Order approved/completed. |
| `CANCELADO` | Order cancelled by the client. |

> Note: `EstadoPedido.js` currently lacks `COMPLETADO`. The plan assumes it will be added by the feature implementation or already exists through another feature. If not present, the implementation must extend the enum.

### `PedidoService` refund helper (internal)

| Method | Input | Output | Description |
|--------|-------|--------|-------------|
| `#iniciarReembolso(pedido)` | `pedido`: Pedido | `reembolso` object | Creates a refund record for the cancelled order. Returns `{ monto, estado: INICIADO, fechaInicio }`. |

**Validation rules**:
- `pedido.total` must be non-negative.
- If `pedido.total === 0`, no refund record is created (the order is simply marked cancelled).

## Relationships

```text
Pedido * --1 Gig (via gig ID)
Pedido * --1 Usuario (cliente)
Gig * --1 Usuario (vendedor / freelancer)
Pedido 1 --0..1 Refund (via reembolso field)
```

A `Pedido` belongs to exactly one client and one gig. A cancellation may have exactly one refund record attached to the order.

## State Transitions

### Order status transitions relevant to cancellation

```text
PENDIENTE    ──cancel──▶ CANCELADO
CONFIRMADO   ──cancel──▶ CANCELADO
EN_REVISION  ──cancel──▶ CANCELADO
CANCELADO    ──cancel──▶ CANCELADO   (idempotent, no side effects)
ENTREGADO    ──cancel──▶ (blocked)
COMPLETADO   ──cancel──▶ (blocked)
```

### Refund status

```text
INICIADO → COMPLETADO (when payment provider confirms)
INICIADO → FALLIDO    (when payment provider rejects or fails)
```

For this iteration the payment provider is simulated, so the refund record is created with status `INICIADO`. Actual completion/failure tracking is out of scope.

## Notes

- The existing in-memory store does not support relations or foreign keys; ownership and existence checks are performed in the service layer.
- Timestamps are stored as ISO strings (`new Date().toISOString()`) to match existing domain patterns.
- Client identity is never accepted from the request body; it is always derived from `req.user.id` provided by the JWT middleware.
