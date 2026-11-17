# Data Model: Visualización Paginada de Pedidos

**Feature**: 003-order-view-paginated
**Date**: 2026-07-09

## Entities

### Pedido (Order)

Represents a client's order for a gig/service.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | String | auto | Auto-incrementing identifier (e.g., "1", "2") |
| cliente | String | yes | Client ID (user reference) |
| gig | String | yes | Gig ID (service reference) |
| estado | String | yes | Current status from `EstadoPedido` enum |
| total | Number | yes | Order total amount |
| fechaCreacion | String (ISO 8601) | yes | Timestamp when order was created |
| fechaConfirmacion | String (ISO 8601) | no | Timestamp when order was confirmed (set when status = CONFIRMADO) |
| puntuacion | Number | no | Rating (0-5), default 0 |
| mensajes | Array | no | Messages associated with order, default [] |

**Validation Rules**:
- `cliente` MUST be a non-empty string
- `gig` MUST be a non-empty string
- `estado` MUST be one of the `EstadoPedido` enum values
- `total` MUST be a non-negative number
- `fechaConfirmacion` MUST be set when `estado` changes to `CONFIRMADO`

### EstadoPedido (Order Status Enum)

| Value | Spanish Label | Badge Color |
|-------|---------------|-------------|
| Pendiente | Pendiente | #f59e0b (amber) |
| Confirmado | Confirmado | #3b82f6 (blue) |
| En revisión | En Revisión | #8b5cf6 (purple) |
| Entregado | Entregado | #22c55e (green) |
| Cancelado | Cancelado | #ef4444 (red) |

**State Transitions** (existing in `Pedido.actualizarEstado()`):
- Pendiente → Confirmado (order accepted by freelancer)
- Pendiente → Cancelado (order cancelled before acceptance)
- Confirmado → En revisión (work in progress)
- Confirmado → Cancelado (order cancelled after confirmation)
- En revisión → Entregado (work completed)

### PaginationResult

API response structure for paginated queries.

| Field | Type | Description |
|-------|------|-------------|
| items | Array<Pedido> | Orders for the current page |
| totalItems | Number | Total count of orders matching the query |
| currentPage | Number | Current page number (1-based) |
| totalPages | Number | Total number of pages |

## Relationships

```
Usuario (1) ──── (N) Pedido
   │                   │
   │ cliente           │ gig
   │                   │
   └───────────────────┘
                     Gig (1)
```

- A **Usuario** (client) can have many **Pedidos**
- A **Pedido** belongs to one **Usuario** (client) and one **Gig**
- A **Gig** can have many **Pedidos**

## Delivery Estimate Calculation

For orders with `estado === 'Confirmado'`:

```
daysRemaining = SLA_DAYS - daysSince(fechaConfirmacion)
```

Where:
- `SLA_DAYS = 5` (configurable constant)
- `daysSince(date) = floor((now - date) / 86400000)`
- If `daysRemaining <= 0` → display "Entrega estimada hoy"
- If `daysRemaining > 0` → display "Entrega estimada en {N} días"

## Scope of Changes

This feature does NOT modify the data model structure — it only adds:
1. `fechaConfirmacion` field usage (already implicitly available in the stored object)
2. New query methods on `PedidoRepository` for client-filtered pagination
3. No schema changes needed for in-memory storage
