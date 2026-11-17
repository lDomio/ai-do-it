# API Contracts: AI Do It Freelance Platform

## Overview

This document defines the API contracts for the frontend mock data layer. The frontend communicates with a mock API client that simulates backend responses.

## Base URL

```
http://localhost:3000
```

## Authentication

All requests include header:
```
Authorization: Bearer <demo-token>
```

---

## Endpoints

### Users

#### GET /users/profile
Returns the current user's profile.

**Response**:
```json
{
  "id": "usr_001",
  "name": "Alex Rodríguez",
  "email": "alex@example.com",
  "avatar": "https://i.pravatar.cc/150?u=usr_001",
  "role": "BOTH",
  "stats": {
    "completed": 12,
    "active": 3,
    "spent": 45000,
    "earned": 180000
  },
  "createdAt": "2024-01-15T00:00:00Z"
}
```

---

### Gigs

#### GET /gigs
List gigs with optional filters.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Full-text search |
| `category` | string | Filter by category |
| `sort` | string | Sort by: relevance, price_asc, price_desc, rating, date |
| `featured` | boolean | Only featured gigs |
| `trending` | boolean | Only trending gigs |

**Response**:
```json
{
  "gigs": [
    {
      "id": "gig_001",
      "title": "Diseño de logo profesional",
      "description": "...",
      "category": "DISENO",
      "tags": ["logo", "branding"],
      "seller": {
        "id": "usr_002",
        "name": "María González",
        "avatar": "https://i.pravatar.cc/150?u=usr_002"
      },
      "packages": [...],
      "rating": 4.9,
      "reviewCount": 342,
      "images": ["https://placehold.co/600x400"],
      "isFeatured": true,
      "priceFrom": 5000
    }
  ],
  "total": 6,
  "page": 1,
  "hasMore": false
}
```

#### GET /gigs/:id
Get gig details.

**Response**:
```json
{
  "id": "gig_001",
  "title": "Diseño de logo profesional con identidad de marca completa",
  "description": "Creo logos únicos y memorables...",
  "category": "DISENO",
  "tags": ["logo", "branding", "identidad visual"],
  "seller": {
    "id": "usr_002",
    "name": "María González",
    "avatar": "https://i.pravatar.cc/150?u=usr_002",
    "rating": 4.9,
    "reviewCount": 342
  },
  "packages": [
    {
      "id": "pkg_001",
      "name": "BASICO",
      "price": 5000,
      "deliveryDays": 3,
      "features": ["2 conceptos iniciales", "2 revisiones"]
    }
  ],
  "rating": 4.9,
  "reviewCount": 342,
  "images": ["https://placehold.co/600x400"],
  "reviews": [
    {
      "id": "rev_001",
      "buyer": {
        "id": "usr_001",
        "name": "Alex Rodríguez",
        "avatar": "https://i.pravatar.cc/150?u=usr_001"
      },
      "rating": 5,
      "comment": "Excelente trabajo!",
      "createdAt": "2026-07-06T15:00:00Z"
    }
  ],
  "createdAt": "2024-06-01T00:00:00Z"
}
```

#### GET /gigs/categories
List all categories.

**Response**:
```json
{
  "categories": [
    { "id": "DISENO", "name": "Diseño", "icon": "palette" },
    { "id": "DESARROLLO", "name": "Desarrollo", "icon": "code" },
    { "id": "MARKETING", "name": "Marketing", "icon": "trending-up" },
    { "id": "REDACCION", "name": "Redacción", "icon": "edit-3" },
    { "id": "VIDEO", "name": "Video", "icon": "video" },
    { "id": "DATOS", "name": "Datos", "icon": "bar-chart" },
    { "id": "MUSICA", "name": "Música", "icon": "music" },
    { "id": "IA", "name": "IA", "icon": "cpu" }
  ]
}
```

#### POST /gigs
Create a new gig (freelancer only).

**Request Body**:
```json
{
  "title": "Mi nuevo gig",
  "description": "Descripción del servicio...",
  "category": "DISENO",
  "tags": ["tag1", "tag2"],
  "packages": [
    {
      "name": "BASICO",
      "price": 5000,
      "deliveryDays": 3,
      "features": ["Feature 1"]
    }
  ],
  "images": ["https://placeholder.com/image.jpg"]
}
```

**Response**:
```json
{
  "id": "gig_002",
  "title": "Mi nuevo gig",
  ...
}
```

---

### Orders

#### GET /orders
List orders for current user.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `role` | string | Filter by role: buyer, seller |

**Response**:
```json
{
  "orders": [
    {
      "id": "ord_001",
      "gig": {
        "id": "gig_001",
        "title": "Diseño de logo profesional",
        "images": ["https://placehold.co/600x400"]
      },
      "seller": {
        "id": "usr_002",
        "name": "María González",
        "avatar": "https://i.pravatar.cc/150?u=usr_002"
      },
      "package": {
        "name": "ESTANDAR",
        "price": 12000
      },
      "status": "CONFIRMADO",
      "totalPrice": 12000,
      "createdAt": "2026-07-01T10:00:00Z",
      "deliveryDeadline": "2026-07-06T10:00:00Z",
      "daysRemaining": 2
    }
  ],
  "activeCount": 3,
  "completedCount": 12
}
```

#### GET /orders/:id
Get order details.

**Response**:
```json
{
  "id": "ord_001",
  "gig": {
    "id": "gig_001",
    "title": "Diseño de logo profesional",
    "images": ["https://placehold.co/600x400"]
  },
  "buyer": {
    "id": "usr_001",
    "name": "Alex Rodríguez",
    "avatar": "https://i.pravatar.cc/150?u=usr_001"
  },
  "seller": {
    "id": "usr_002",
    "name": "María González",
    "avatar": "https://i.pravatar.cc/150?u=usr_002"
  },
  "package": {
    "name": "ESTANDAR",
    "price": 12000,
    "deliveryDays": 5,
    "features": ["4 conceptos", "5 revisiones"]
  },
  "status": "CONFIRMADO",
  "totalPrice": 12000,
  "createdAt": "2026-07-01T10:00:00Z",
  "deliveryDeadline": "2026-07-06T10:00:00Z",
  "daysRemaining": 2
}
```

#### POST /orders
Create a new order.

**Request Body**:
```json
{
  "gigId": "gig_001",
  "packageId": "pkg_002",
  "requirements": "Requerimientos específicos del pedido..."
}
```

**Response**:
```json
{
  "id": "ord_001",
  "status": "PENDIENTE",
  ...
}
```

#### PUT /orders/:id/cancel
Cancel an order.

**Request Body**:
```json
{
  "reason": "Ya no necesito el servicio"
}
```

**Response**:
```json
{
  "id": "ord_001",
  "status": "CANCELADO",
  "cancelledAt": "2026-07-02T10:00:00Z"
}
```

#### PUT /orders/:id/deliver
Mark order as delivered (seller only).

**Response**:
```json
{
  "id": "ord_001",
  "status": "ENTREGADO",
  "deliveredAt": "2026-07-05T15:00:00Z"
}
```

#### PUT /orders/:id/confirm
Confirm delivery (buyer only).

**Response**:
```json
{
  "id": "ord_001",
  "status": "COMPLETADO",
  "completedAt": "2026-07-06T10:00:00Z"
}
```

---

### Messages

#### GET /orders/:orderId/messages
Get messages for an order.

**Response**:
```json
{
  "messages": [
    {
      "id": "msg_001",
      "senderId": "usr_001",
      "senderType": "BUYER",
      "content": "Hola! Me gustaría que el logo tenga tonos azules.",
      "createdAt": "2026-07-01T10:30:00Z"
    }
  ],
  "unreadCount": 2
}
```

#### POST /orders/:orderId/messages
Send a message.

**Request Body**:
```json
{
  "content": "Perfecto, lo tengo en cuenta!"
}
```

**Response**:
```json
{
  "id": "msg_002",
  "senderId": "usr_002",
  "senderType": "FREELANCER",
  "content": "Perfecto, lo tengo en cuenta!",
  "createdAt": "2026-07-01T11:00:00Z"
}
```

---

### Reviews

#### POST /reviews
Create a review for a completed order.

**Request Body**:
```json
{
  "orderId": "ord_001",
  "rating": 5,
  "comment": "Excelente trabajo! Muy profesional."
}
```

**Response**:
```json
{
  "id": "rev_001",
  "orderId": "ord_001",
  "gigId": "gig_001",
  "rating": 5,
  "comment": "Excelente trabajo! Muy profesional.",
  "createdAt": "2026-07-06T15:00:00Z"
}
```

---

### Search

#### GET /search
Full-text search for gigs.

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query |
| `category` | string | Filter by category |
| `sort` | string | Sort order |

**Response**:
```json
{
  "results": [
    {
      "id": "gig_001",
      "title": "Diseño de logo profesional",
      ...
    }
  ],
  "total": 6
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Error Codes**:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |
