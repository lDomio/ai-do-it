# Contract: Order Messages API

## Base URL

All endpoints are mounted under the existing backend base URL (e.g., `http://localhost:3000`).

## Endpoints

### `GET /pedidos/:id/messages`

List all chat messages for a specific order, in chronological order.

**Authentication**: Required (JWT bearer token).

**Authorization**: The caller must be either the order's client (`Pedido.cliente`) or the gig's seller (`Gig.vendedor`).

**Path parameters**:

| Name | Type | Description |
|------|------|-------------|
| `id` | string | Order identifier. |

**Query parameters**: none.

**Response** `200 OK`:

```json
{
  "messages": [
    {
      "id": "msg-1",
      "pedidoId": "order-1",
      "senderId": "cliente-1",
      "senderType": "CLIENTE",
      "content": "Hola, ¿cuándo estará listo el diseño?",
      "status": "ENVIADO",
      "createdAt": "2026-07-10T14:30:00.000Z"
    },
    {
      "id": "msg-2",
      "pedidoId": "order-1",
      "senderId": "freelancer-1",
      "senderType": "FREELANCER",
      "content": "Te lo envío mañana antes del mediodía.",
      "status": "ENVIADO",
      "createdAt": "2026-07-10T14:32:00.000Z"
    }
  ],
  "unreadCount": 0
}
```

**Error responses**:

- `401 Unauthorized` — missing or invalid JWT.
- `403 Forbidden` — caller is not a party to the order.
- `404 Not Found` — order does not exist.

### `POST /pedidos/:id/messages`

Send a new message inside an order chat.

**Authentication**: Required (JWT bearer token).

**Authorization**: The caller must be either the order's client or the gig's seller, and the order must not be in a terminal state (`COMPLETADO` or `CANCELADO`).

**Path parameters**:

| Name | Type | Description |
|------|------|-------------|
| `id` | string | Order identifier. |

**Request body**:

```json
{
  "content": "Te lo envío mañana antes del mediodía."
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `content` | string | yes | Non-empty after trim; max 2,000 characters. |

**Response** `201 Created`:

```json
{
  "id": "msg-3",
  "pedidoId": "order-1",
  "senderId": "freelancer-1",
  "senderType": "FREELANCER",
  "content": "Te lo envío mañana antes del mediodía.",
  "status": "ENVIADO",
  "createdAt": "2026-07-10T14:35:00.000Z"
}
```

**Error responses**:

- `400 Bad Request` — missing/empty content or content exceeds 2,000 characters.
- `401 Unauthorized` — missing or invalid JWT.
- `403 Forbidden` — caller is not a party to the order, or the order is read-only.
- `404 Not Found` — order does not exist.

## Domain values

### `senderType`

| Value | Meaning |
|-------|---------|
| `CLIENTE` | Message sent by the order's client. |
| `FREELANCER` | Message sent by the gig's seller. |

### `status`

| Value | Meaning |
|-------|---------|
| `ENVIADO` | Message persisted successfully. |
| `PENDIENTE` | Client-side optimistic status before server confirmation. |
| `FALLIDO` | Send failed; user can retry. |

## Authentication

Send a valid JWT in the `Authorization` header as provided by the existing `/auth/login` flow:

```text
Authorization: Bearer <token>
```
