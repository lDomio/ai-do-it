# API Contract: Reviews

**Feature**: Puntuación y Comentarios de Gigs  
**Date**: 2026-07-10  
**Base path**: `/api/v1` (mounted by backend app)  
**Data model**: [../data-model.md](../data-model.md)

## Endpoints

### POST /opiniones

Create a review for a delivered order.

**Authentication**: JWT Bearer token required.  
**Scope**: Only the client who owns the referenced order can create a review.

#### Request

```json
{
  "cliente": "usr_001",
  "gig": "gig_002",
  "pedido": "ord_004",
  "puntuacion": 5,
  "detalle": "Excelente trabajo, cumplió con todo lo acordado."
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| cliente | string | yes | ID of the reviewer (must match order.cliente) |
| gig | string | yes | ID of the Gig being reviewed |
| pedido | string | yes | ID of the delivered order |
| puntuacion | integer | yes | 1 ≤ value ≤ 5 |
| detalle | string | yes | Non-empty after trim, max 1000 chars |

#### Success Response: 201 Created

```json
{
  "id": "rev_003",
  "cliente": "usr_001",
  "gig": "gig_002",
  "pedido": "ord_004",
  "puntuacion": 5,
  "detalle": "Excelente trabajo, cumplió con todo lo acordado.",
  "fechaCreacion": "2026-07-10T12:34:56.789Z"
}
```

#### Error Responses

| Status | Condition | Body example |
|--------|-----------|--------------|
| 400 | Pedido not in `Entregado` state | `{ "error": "El pedido debe estar entregado para dejar una reseña" }` |
| 400 | Invalid rating or comment | `{ "error": "La puntuacion debe estar entre 1 y 5" }` |
| 403 | Reviewer is not the order client | `{ "error": "No tienes permiso para reseñar este pedido" }` |
| 404 | Order or Gig not found | `{ "error": "Pedido no encontrado" }` |
| 409 | Order already reviewed | `{ "error": "El pedido ya tiene una reseña" }` |

---

### GET /opiniones

List all reviews. Primarily for administrative/debug purposes.

**Authentication**: Optional (project convention allows unauthenticated GET on many resources).  
**Query params**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| gig | string | - | Filter by Gig ID |
| pedido | string | - | Filter by Order ID |
| cliente | string | - | Filter by client ID |
| page | integer | 1 | Page number |
| pageSize | integer | 10 | Items per page (max 100) |

#### Success Response: 200 OK

```json
{
  "reviews": [
    {
      "id": "rev_001",
      "cliente": "usr_001",
      "gig": "gig_002",
      "pedido": "ord_004",
      "puntuacion": 5,
      "detalle": "Excelente trabajo!",
      "fechaCreacion": "2026-06-22T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

---

### GET /gigs/:id/reviews

List reviews for a specific Gig, including derived summary.

**Authentication**: Optional.  
**Path params**:

| Param | Type | Description |
|-------|------|-------------|
| id | string | Gig ID |

**Query params**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 10 | Items per page |

#### Success Response: 200 OK

```json
{
  "gigId": "gig_002",
  "rating": 4.8,
  "reviewCount": 189,
  "reviews": [
    {
      "id": "rev_001",
      "cliente": "usr_001",
      "puntuacion": 5,
      "detalle": "Excelente trabajo!",
      "fechaCreacion": "2026-06-22T10:00:00.000Z"
    }
  ],
  "total": 189,
  "page": 1,
  "pageSize": 10,
  "totalPages": 19
}
```

#### Error Responses

| Status | Condition | Body example |
|--------|-----------|--------------|
| 404 | Gig not found | `{ "error": "Gig no encontrado" }` |

---

### GET /gigs/:id

Existing endpoint enhanced to include derived `rating` and `reviewCount`.

#### Success Response: 200 OK (relevant fields)

```json
{
  "id": "gig_002",
  "nombre": "Desarrollo de landing page moderna con React y animaciones",
  "rating": 4.8,
  "reviewCount": 189,
  ...
}
```

## Notes

- `rating` is rounded to one decimal place in responses.
- `reviewCount` reflects total published reviews for the Gig.
- Reviewer identity is exposed as `cliente` ID; the frontend may resolve name/avatar from the user cache.
