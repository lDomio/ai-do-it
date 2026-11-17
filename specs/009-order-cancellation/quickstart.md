# Quickstart: Order Cancellation Validation

## Goal

Verify that clients and admins can cancel non-delivered orders, that delivered orders are blocked, and that unauthorized users cannot cancel orders.

## Prerequisites

- Backend server running on the configured port.
- At least three test users: a client who owns an order, a different client, and an admin.
- A test order in `pending` or `in_progress` status for the owner client.
- A second test order in `delivered` status for the owner client.
- The API client contract is documented in [contracts/cancel-order.md](contracts/cancel-order.md).

## Validation Steps

### 1. Client cancels their own non-delivered order

1. Authenticate as the order owner client.
2. Send `POST /orders/{orderId}/cancel`.
3. Expect `200 OK` with `status` equal to `cancelled`, `cancelledBy` equal to the client id, and `cancelledByRole` equal to `client`.

### 2. Admin cancels a non-delivered order

1. Authenticate as an admin.
2. Send `POST /orders/{orderId}/cancel` for an order owned by another user.
3. Expect `200 OK` with `status` equal to `cancelled`, `cancelledByRole` equal to `admin`, and the order owner receives a notification.

### 3. Delivered order cannot be cancelled

1. Authenticate as the order owner client or as an admin.
2. Send `POST /orders/{deliveredOrderId}/cancel`.
3. Expect `400 Bad Request` with error `OrderAlreadyDelivered`.

### 4. Unauthorized user cannot cancel

1. Authenticate as a different client who does not own the order.
2. Send `POST /orders/{orderId}/cancel`.
3. Expect `403 Forbidden` with error `Forbidden`.

### 5. Already cancelled order cannot be cancelled again

1. Use the order cancelled in step 1.
2. Send `POST /orders/{orderId}/cancel` again.
3. Expect `400 Bad Request` with error `OrderAlreadyCancelled`.

### 6. Non-existent order returns not found

1. Send `POST /orders/nonexistent-id/cancel` with any authenticated user.
2. Expect `404 Not Found` with error `OrderNotFound`.

## Expected Outcomes

- Only client owners and admins successfully cancel non-delivered orders.
- Delivered and already-cancelled orders are always rejected.
- Unauthorized users receive a forbidden response.
- Admin cancellation produces a client notification.
- All successful cancellations record `cancelledBy`, `cancelledByRole`, and `cancelledAt`.
