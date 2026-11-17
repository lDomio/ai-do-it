# Contract: Cancel Order

## Endpoint

`POST /orders/:id/cancel`

## Description

Cancels an existing order as long as it is not already delivered. The caller must be either the client who owns the order or an administrator.

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` | yes |
| Authorization | Bearer token identifying the authenticated user | yes |

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Order identifier |

### Body

No request body is required. The actor is derived from the authorization token.

## Response

### Success (200 OK)

```json
{
  "id": "order-123",
  "clientId": "client-456",
  "status": "cancelled",
  "cancelledBy": "client-456",
  "cancelledByRole": "client",
  "cancelledAt": "2026-07-10T20:30:00.000Z",
  "createdAt": "2026-07-10T18:00:00.000Z",
  "updatedAt": "2026-07-10T20:30:00.000Z"
}
```

### Error: Order already delivered (400 Bad Request)

```json
{
  "error": "OrderAlreadyDelivered",
  "message": "Delivered orders cannot be cancelled."
}
```

### Error: Order already cancelled (400 Bad Request)

```json
{
  "error": "OrderAlreadyCancelled",
  "message": "The order is already cancelled."
}
```

### Error: Unauthorized (403 Forbidden)

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to cancel this order."
}
```

### Error: Order not found (404 Not Found)

```json
{
  "error": "OrderNotFound",
  "message": "Order not found."
}
```

## Domain Events

- `OrderCancelled` event emitted on successful cancellation.
- Event payload includes `orderId`, `clientId`, `cancelledBy`, `cancelledByRole`, and `cancelledAt`.
- A notification handler listens to this event and notifies the client when `cancelledByRole` is `admin`.
