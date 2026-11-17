# API Contract: Order Cancellation

This document defines the REST contract for cancelling an order from the mobile frontend. The contract is technology-agnostic in description; the concrete backend uses Express and the frontend uses an HTTP client wrapper.

## Endpoint

```text
POST /pedidos/{orderId}/cancel
```

### Description

Cancels an order owned by the authenticated client if the order has not been delivered. The order status changes to `CANCELADO`, cancellation metadata is recorded, and a full refund is initiated for the total order amount. Cancellation is idempotent: calling the endpoint again for an already-cancelled order returns the same order without re-processing the refund.

### Authentication

Requires a valid JWT bearer token. The token MUST identify the order's client; otherwise the request is rejected with `403 Forbidden`.

### Request

**Headers**:

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {jwt}` | yes |
| `Content-Type` | `application/json` | yes |

**Path parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | string | ID of the order to cancel. |

**Body**: empty object (`{}`) or omitted. The action and the acting user are inferred from the endpoint and JWT token.

### Response

#### 200 OK — Cancellation succeeded or was already cancelled

```json
{
  "id": "123",
  "cliente": "cliente-1",
  "gig": "gig-1",
  "estado": "Cancelado",
  "total": 5000,
  "fechaCreacion": "2026-07-01T10:00:00.000Z",
  "fechaConfirmacion": null,
  "canceladoAt": "2026-07-10T15:30:00.000Z",
  "canceladoPor": "cliente-1",
  "reembolso": {
    "monto": 5000,
    "estado": "INICIADO",
    "fechaInicio": "2026-07-10T15:30:00.000Z"
  }
}
```

#### 400 Bad Request — Order is not in a cancellable state

```json
{
  "error": "El pedido no puede cancelarse en estado Entregado"
}
```

#### 401 Unauthorized — Missing or invalid JWT

```json
{
  "error": "No autenticado"
}
```

#### 403 Forbidden — Authenticated user is not the order's client

```json
{
  "error": "No tienes permiso para cancelar este pedido"
}
```

#### 404 Not Found — Order does not exist

```json
{
  "error": "Pedido no encontrado"
}
```

### Success criteria mapping

| Spec criterion | Verified by endpoint behavior |
|----------------|------------------------------|
| SC-001 | Client can call the endpoint and receive an updated order in one request from the order detail screen. |
| SC-002 | Paid orders include a `reembolso` object with `monto === total` and `estado: INICIADO`. |
| SC-003 | Requests for `ENTREGADO`/`COMPLETADO` orders return `400 Bad Request`. |
| SC-004 | Successful cancellation sets `estado` to `Cancelado` and `canceladoAt`/`canceladoPor` fields. |
| SC-005 | Non-client users receive `403 Forbidden`. |

## Frontend usage

The mobile app calls the endpoint through the existing `apiClient` helper:

```javascript
await apiClient.post(`/orders/${orderId}/cancel`, {});
```

When `USE_MOCK` is `true`, a mock handler intercepts `POST /orders/:id/cancel`, validates ownership/state, and returns an updated order object matching the contract above.
