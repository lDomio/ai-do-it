# Quickstart: Order Cancellation Validation

This guide documents runnable validation scenarios that prove the order cancellation feature works end-to-end. It does not contain implementation code; see `tasks.md` for implementation details.

## Prerequisites

1. Node.js 20+ installed.
2. Backend dependencies installed:
   ```bash
   cd backend && npm install
   ```
3. Frontend dependencies installed:
   ```bash
   cd frontend && npm install
   ```
4. A running backend:
   ```bash
   cd backend && npm run dev
   ```
   The API should be available at `http://localhost:3000` (or the value configured in the frontend's `ApiConfigContext`).
5. Expo CLI / mobile simulator or device for manual frontend validation.

## Scenario 1: Client cancels a pending order

### Steps

1. Start the backend and seed it (seed runs automatically on startup).
2. Log in as a client via the existing `/auth/login` endpoint and keep the JWT token.
3. Identify an existing order for that client with status `PENDIENTE` and note its `id`.
4. Cancel the order:
   ```bash
   curl -X POST http://localhost:3000/pedidos/{orderId}/cancel \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json"
   ```

### Expected outcome

- The endpoint returns `200 OK` with the order object.
- `estado` is `Cancelado`.
- `canceladoAt` and `canceladoPor` are set and equal to the client's ID.
- If `total > 0`, a `reembolso` object is present with `monto === total` and `estado: INICIADO`.

## Scenario 2: Client cancels a confirmed order

### Steps

1. Create or identify an order with status `CONFIRMADO` for the client.
2. Call the same cancellation endpoint as in Scenario 1.

### Expected outcome

- The endpoint returns `200 OK`.
- `estado` is `Cancelado` and `reembolso` is present with the full amount.

## Scenario 3: Cancellation is blocked after delivery

### Steps

1. Move an order to status `ENTREGADO` using the existing `PUT /pedidos/{id}` endpoint (or use an already delivered order).
2. Call the cancellation endpoint as the client:
   ```bash
   curl -X POST http://localhost:3000/pedidos/{orderId}/cancel \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json"
   ```

### Expected outcome

- The endpoint returns `400 Bad Request`.
- The response body contains an error explaining that the order cannot be cancelled in the current state.
- The order status remains `ENTREGADO`.

## Scenario 4: Unauthorized user cannot cancel

### Steps

1. Log in as a user who is not the client of an existing cancellable order.
2. Call the cancellation endpoint:
   ```bash
   curl -X POST http://localhost:3000/pedidos/{orderId}/cancel \
     -H "Authorization: Bearer {otherToken}" \
     -H "Content-Type: application/json"
   ```

### Expected outcome

- The endpoint returns `403 Forbidden`.
- The order status is unchanged.

## Scenario 5: Cancellation is idempotent

### Steps

1. Cancel an order as the client (same as Scenario 1).
2. Call the cancellation endpoint again with the same token.

### Expected outcome

- The endpoint returns `200 OK` with the same cancelled order.
- No additional refund record is created or processed.
- `canceladoAt` and `reembolso` values remain unchanged.

## Scenario 6: Mobile cancellation flow end-to-end

### Steps

1. Start the frontend with `cd frontend && npm start` and open it in a simulator/device.
2. Log in as a client who owns an active order that is not `ENTREGADO`.
3. Open the order detail screen.
4. Tap the "Cancelar pedido" button.
5. Confirm the cancellation in the alert dialog.

### Expected outcome

- The order status badge changes to `Cancelado` (red).
- A confirmation message appears, including refund information if the order was paid.
- The cancel button is no longer shown.
- The order appears under the "Historial" tab in the orders screen with status `Cancelado`.

## Scenario 7: Cancellation is not shown for delivered orders in the app

### Steps

1. Open the order detail screen for an `ENTREGADO` or `COMPLETADO` order as the client.

### Expected outcome

- The "Cancelar pedido" button is not visible.
- The status badge shows `Entregado` or `Completado` accordingly.

## Checklist

- [ ] Scenario 1 passes.
- [ ] Scenario 2 passes.
- [ ] Scenario 3 passes.
- [ ] Scenario 4 passes.
- [ ] Scenario 5 passes.
- [ ] Scenario 6 passes on at least one mobile target (Android/iOS).
- [ ] Scenario 7 passes.
