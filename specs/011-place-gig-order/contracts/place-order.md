# API Contract: Place Order

## Endpoint

`POST /pedidos/reservar`

## Description

Allows an authenticated customer to place an order for a specific package of a Gig, providing the requirements for the freelancer.

## Authentication

Requires a valid JWT bearer token. The authenticated user's ID is used as the order's `cliente`.

## Request

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | yes | `Bearer {jwt}` |
| `Content-Type` | yes | `application/json` |
| `Idempotency-Key` | no | Client-generated UUID to prevent duplicate submissions. Recommended for final confirmation calls. |

### Body

```json
{
  "gigId": "string (required)",
  "paqueteId": "string (required)",
  "requerimientos": "string (required, 20-2000 characters)"
}
```

### Validation

- `gigId`: must reference an existing Gig.
- `paqueteId`: must reference a package that belongs to the referenced Gig.
- `requerimientos`: trimmed length must be between 20 and 2000 characters.

## Responses

### 201 Created

Returns the newly created order.

```json
{
  "id": "1",
  "cliente": "cliente-1",
  "gig": "gig-1",
  "paqueteId": "paquete-1",
  "requerimientos": "Necesito un logo minimalista en blanco y negro...",
  "total": 50,
  "estado": "Pendiente",
  "fechaCreacion": "2026-07-10T12:00:00.000Z",
  "fechaConfirmacion": null,
  "puntuacion": 0,
  "mensajes": [],
  "canceladoAt": null,
  "canceladoPor": null,
  "canceladoPorRol": null,
  "reembolso": null
}
```

### 400 Bad Request

Returned when validation fails. Response follows the existing error schema.

```json
{
  "error": {
    "message": "Los requerimientos deben tener entre 20 y 2000 caracteres",
    "code": "VALIDATION_ERROR"
  }
}
```

### 401 Unauthorized

Returned when the request does not include a valid JWT.

### 404 Not Found

Returned when the Gig or the selected package does not exist.

```json
{
  "error": {
    "message": "Paquete no encontrado en el gig",
    "code": "NOT_FOUND"
  }
}
```

### 409 Conflict

Returned when the same `Idempotency-Key` has already been processed. Returns the existing order with status 200 or 409 depending on convention; this contract uses 409 with the existing order ID for clarity.

```json
{
  "error": {
    "message": "Pedido ya registrado con esta clave de idempotencia",
    "code": "DUPLICATE_ORDER",
    "orderId": "1"
  }
}
```

## Notes

- The order `total` is a snapshot of the package price at creation time.
- The response does not include embedded Gig or package objects; clients already have those details from the Gig detail view.
- This endpoint is distinct from the existing `POST /pedidos` generic creation endpoint.
