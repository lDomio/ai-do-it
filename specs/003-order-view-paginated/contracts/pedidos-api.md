# API Contract: Pedidos Paginados

**Feature**: 003-order-view-paginated
**Date**: 2026-07-09

## Endpoint: Get Orders by Client (Paginated)

### Request

```
GET /pedidos/cliente/:clienteId?page={page}
```

**Headers**:
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {token} | Yes |
| Accept | application/json | Yes |

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| clienteId | String | Client's user ID |

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Number | 1 | Page number (1-based) |

### Response

**Success (200 OK)**:

```json
{
  "items": [
    {
      "id": "1",
      "cliente": "client-123",
      "gig": "gig-456",
      "estado": "Confirmado",
      "total": 150.00,
      "fechaCreacion": "2026-07-01T10:00:00.000Z",
      "fechaConfirmacion": "2026-07-02T14:30:00.000Z",
      "puntuacion": 0,
      "mensajes": [],
      "diasEntregaRestantes": 3
    }
  ],
  "totalItems": 15,
  "currentPage": 1,
  "totalPages": 2
}
```

**Notes**:
- `diasEntregaRestantes` is ONLY included when `estado === 'Confirmado'`
- For non-confirmed orders, `diasEntregaRestantes` is omitted from the response
- If `diasEntregaRestantes <= 0`, the frontend displays "Entrega estimada hoy"
- Default page size is 10 items per page

**Error Responses**:

| Status | Body | Description |
|--------|------|-------------|
| 401 | `{ "error": "Token de autenticación requerido" }` | Missing or invalid auth token |
| 403 | `{ "error": "No tienes permiso para acceder a este recurso" }` | User lacks required role |
| 404 | `{ "error": "Pedido no encontrado" }` | Client ID not found (edge case) |

## Frontend Component Contracts

### OrderListScreen

**Props**: None (uses route params or context for clientId)

**State**:
- `pedidos`: Array of order objects
- `currentPage`: Number (current page)
- `totalPages`: Number (total pages)
- `totalItems`: Number (total orders)
- `loading`: Boolean
- `error`: String | null

**Behavior**:
- Fetches orders on mount and when page changes
- Displays paginated list of OrderCard components
- Shows PaginationControls at bottom
- Shows empty state when no orders exist

### OrderCard

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| pedido | Object | Order data (id, gig, estado, total, fechaCreacion, diasEntregaRestantes?) |

**Renders**:
- Order ID
- Service/gig name (or ID if name unavailable)
- Total amount
- StatusBadge
- Delivery estimate (if confirmed)

### StatusBadge

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| estado | String | Order status value from EstadoPedido |

**Renders**:
- Colored badge with Spanish label
- Color determined by status-to-color mapping

### PaginationControls

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| currentPage | Number | Current page number |
| totalPages | Number | Total number of pages |
| onPageChange | Function | Callback when page changes |

**Renders**:
- "Página X de Y" text
- "Anterior" button (disabled on page 1)
- "Siguiente" button (disabled on last page)
