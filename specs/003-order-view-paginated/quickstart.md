# Quickstart: Visualización Paginada de Pedidos

**Feature**: 003-order-view-paginated
**Date**: 2026-07-09

## Prerequisites

- Backend running on `http://localhost:3000`
- Frontend running via Expo (`npx expo start`)
- At least one test user with role `cliente` and several test orders

## Validation Scenarios

### Scenario 1: Paginated Order List

1. **Setup**: Create 15 test orders for client user "client-1"
2. **Action**: Navigate to the orders screen in the frontend
3. **Expected**: First 10 orders displayed; "Página 1 de 2" shown
4. **Action**: Tap "Siguiente"
5. **Expected**: Remaining 5 orders displayed; "Página 2 de 2" shown
6. **Action**: Tap "Anterior"
7. **Expected**: Returns to page 1 with first 10 orders

**API Validation**:
```bash
curl -H "Authorization: Bearer {token}" http://localhost:3000/pedidos/cliente/client-1?page=1
# Expected: { items: [...10 orders...], totalItems: 15, currentPage: 1, totalPages: 2 }

curl -H "Authorization: Bearer {token}" http://localhost:3000/pedidos/cliente/client-1?page=2
# Expected: { items: [...5 orders...], totalItems: 15, currentPage: 2, totalPages: 2 }
```

### Scenario 2: Status Badge Display

1. **Setup**: Create orders with each status: Pendiente, Confirmado, En Revisión, Entregado, Cancelado
2. **Action**: View the order list
3. **Expected**: Each order shows a distinct colored badge:
   - Pendiente → amber/yellow badge
   - Confirmado → blue badge
   - En Revisión → purple badge
   - Entregado → green badge
   - Cancelado → red badge

### Scenario 3: Delivery Estimate for Confirmed Orders

1. **Setup**: Create a confirmed order with `fechaConfirmacion` set to 3 days ago
2. **Action**: View the order list
3. **Expected**: Confirmed order shows "Entrega estimada en 2 días"

4. **Setup**: Create a confirmed order with `fechaConfirmacion` set to today
5. **Action**: View the order list
6. **Expected**: Confirmed order shows "Entrega estimada hoy"

7. **Setup**: Create a non-confirmed order (Pendiente)
8. **Action**: View the order list
9. **Expected**: No delivery estimate shown

### Scenario 4: Empty State

1. **Setup**: Create a client user with no orders
2. **Action**: Navigate to the orders screen
3. **Expected**: "No tienes pedidos aún" message displayed

### Scenario 5: Authentication Required

1. **Action**: Call `GET /pedidos/cliente/client-1` without auth token
2. **Expected**: 401 response with error message

## Key Files to Verify

| Component | File | What to Check |
|-----------|------|---------------|
| Backend route | `backend/src/routes/pedidos.js` | New route `GET /cliente/:clienteId` exists |
| Backend controller | `backend/src/controllers/PedidoController.js` | `findByCliente` method handles pagination params |
| Backend service | `backend/src/services/PedidoService.js` | `findByCliente` calculates delivery estimate |
| Backend repository | `backend/src/repositories/PedidoRepository.js` | `findByCliente` filters and paginates |
| Frontend screen | `frontend/src/features/orders/OrderListScreen.js` | Renders paginated list with loading/error states |
| Frontend component | `frontend/src/components/OrderCard.js` | Displays order info with badge and estimate |
| Frontend component | `frontend/src/components/StatusBadge.js` | Renders correct color per status |
| Frontend component | `frontend/src/components/PaginationControls.js` | Page navigation works correctly |
| Frontend hook | `frontend/src/hooks/usePedidos.js` | Fetches paginated data, manages state |
