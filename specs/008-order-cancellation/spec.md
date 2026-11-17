# Feature Specification: Order Cancellation

**Feature Branch**: `008-order-cancellation`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Como cliente, quiero poder cancelar un pedido en cualquier momento para evitar pagar por un servicio que no cumpla con mis expectativas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cancel an active order (Priority: P1)

As a client viewing an order that has not been delivered, I want to cancel it so I am not charged for a service that does not meet my expectations.

**Why this priority**: This is the core capability requested. It directly protects the client from paying for an unwanted service.

**Independent Test**: A client opens an active order, taps cancel, confirms, and the order moves to `CANCELADO` status. This can be verified end-to-end without any refund processing details.

**Acceptance Scenarios**:

1. **Given** a client is viewing an order with status `PENDIENTE`, **When** the client initiates cancellation and confirms, **Then** the order status changes to `CANCELADO`.
2. **Given** a client is viewing an order with status `CONFIRMADO`, **When** the client initiates cancellation and confirms, **Then** the order status changes to `CANCELADO`.
3. **Given** a client is viewing an order with status `EN_REVISION`, **When** the client initiates cancellation and confirms, **Then** the order status changes to `CANCELADO`.
4. **Given** a client is viewing an order with status `CANCELADO`, **When** the client looks for a cancel action, **Then** no cancel option is available.

---

### User Story 2 - Receive a full refund on cancellation (Priority: P1)

As a client, I want any payment I made for a cancelled order to be refunded so I do not lose money.

**Why this priority**: The user's motivation explicitly mentions avoiding payment for an unsatisfactory service. A refund completes that protection.

**Independent Test**: A client cancels a paid order and sees confirmation that the full refund of the total amount has been initiated.

**Acceptance Scenarios**:

1. **Given** a client cancels a paid order, **When** the cancellation is confirmed, **Then** the system initiates a full refund equal to the order's total paid amount.
2. **Given** a client views a cancelled paid order, **Then** the order details display the refund status or confirmation.
3. **Given** a client cancels an unpaid or zero-price order, **When** the cancellation is confirmed, **Then** no refund flow is required and the order is simply marked `CANCELADO`.

---

### User Story 3 - Prevent cancellation after delivery (Priority: P1)

As a system, I want to block cancellation once an order is delivered so the delivery workflow is protected.

**Why this priority**: The user explicitly limited cancellation to orders not in `ENTREGADO` status. This protects the freelancer and finalizes the delivery flow.

**Independent Test**: A client opens an order with status `ENTREGADO` or `COMPLETADO` and cannot find or use a cancel action.

**Acceptance Scenarios**:

1. **Given** an order has status `ENTREGADO`, **When** the client views it, **Then** the cancel button/action is not available.
2. **Given** an order has status `COMPLETADO`, **When** the client views it, **Then** the cancel button/action is not available.

---

### Edge Cases

- What happens if the client cancels accidentally? The system must show a confirmation step before finalizing cancellation.
- What happens if the freelancer is actively working on the order? Cancellation is still allowed before delivery, but the system records the cancellation timestamp and acting user.
- What happens if the payment refund fails? The order is still marked `CANCELADO`; the refund issue is escalated or tracked separately without blocking the cancellation.
- What happens if a non-client user tries to cancel? The system rejects the action and shows an unauthorized or unavailable message.
- What happens if the client sends a duplicate cancellation request? The system handles it gracefully without re-processing the refund or changing the status again.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the client who owns the order to initiate cancellation from the order details view.
- **FR-002**: The system MUST present a confirmation step before completing the cancellation.
- **FR-003**: The system MUST allow cancellation only for orders with status `PENDIENTE`, `CONFIRMADO`, `EN_REVISION`, or `CANCELADO`.
- **FR-004**: The system MUST NOT allow cancellation for orders with status `ENTREGADO` or `COMPLETADO`.
- **FR-005**: The system MUST change the order status to `CANCELADO` after a confirmed cancellation.
- **FR-006**: The system MUST record the cancellation timestamp and the user who performed it.
- **FR-007**: The system MUST initiate a full refund of the total paid amount when a paid order is cancelled.
- **FR-008**: The system MUST display the updated order status and refund information to the client after cancellation.
- **FR-009**: The system MUST prevent users other than the order's client from cancelling the order.
- **FR-010**: The system MUST handle duplicate cancellation requests gracefully without re-processing the refund or changing the status again.

### Key Entities *(include if feature involves data)*

- **Order (Pedido)**: Represents a service order. Attributes: id, client reference, freelancer reference, gig/package reference, status, total amount, creation date, cancellation timestamp, cancelled-by reference, refund status.
- **EstadoPedido (Order Status)**: Enum with values: `PENDIENTE`, `CONFIRMADO`, `EN_REVISION`, `ENTREGADO`, `COMPLETADO`, `CANCELADO`. Determines whether cancellation is allowed.
- **Refund**: Represents a refund associated with a cancelled order. Attributes: id, order reference, amount, status, creation date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A client can cancel an eligible order in under 30 seconds from opening the order details.
- **SC-002**: 100% of cancelled paid orders initiate a full refund automatically.
- **SC-003**: 0% of orders with status `ENTREGADO` or `COMPLETADO` show a cancel action to the client.
- **SC-004**: 100% of confirmed cancellations change the order status to `CANCELADO`.
- **SC-005**: 100% of cancellation attempts by non-client users are rejected.

## Assumptions

- Payment processing infrastructure already exists and can initiate refunds.
- The order details screen already exists and can accommodate a cancel action.
- "Total paid amount" refers to the order's total amount at the moment of cancellation.
- Refund processing time is governed by payment-provider rules and is out of scope beyond initiation.
- Notifications to the freelancer about cancellation are out of scope unless covered by another feature.
- Partial refunds, disputes, and freelancer-initiated cancellations are out of scope for this feature.

## Dependencies

- Existing order management system and status workflow.
- Existing authentication and authorization to identify the client.
- Existing payment/refund capability.

## Out of Scope

- Partial refunds.
- Dispute resolution after cancellation.
- Notifications to the freelancer about cancellation.
- Cancellation initiated by the freelancer.
