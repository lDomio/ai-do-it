# Feature Specification: Order Cancellation by Client and Admin

**Feature Branch**: `[009-order-cancellation]`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Como freelancer, quiero que los clientes puedan cancelar el pedido siempre que el mismo no se encuentre en estado entregado. Un admin también puede cancelarlo"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client cancels an order before delivery (Priority: P1)

As a client who placed an order, I want to cancel the order when it has not yet been delivered, so that I can stop the work and avoid paying for something I no longer need.

**Why this priority**: This is the core capability described by the user. Without it, clients cannot recover from mistaken or changed orders, which directly affects trust and satisfaction.

**Independent Test**: A client can open an active order that is not delivered, choose "Cancel order", confirm the action, and the order is shown as cancelled.

**Acceptance Scenarios**:

1. **Given** an order exists in status "Pending" or "In Progress", **When** the client cancels it, **Then** the order changes to "Cancelled" and the client receives confirmation.
2. **Given** an order exists in status "Pending" or "In Progress", **When** the client starts cancellation and confirms, **Then** the system records who cancelled it and when.
3. **Given** an order exists in status "Delivered", **When** the client attempts to cancel it, **Then** the system prevents cancellation and shows a message explaining that delivered orders cannot be cancelled.

---

### User Story 2 - Admin cancels any non-delivered order (Priority: P1)

As an administrator, I want to cancel any order that has not been delivered, so that I can intervene in disputes, fraud, or exceptional situations without needing the client's action.

**Why this priority**: Admin intervention is required for operations and support. It is on the same priority level because it protects the business and users from problematic orders.

**Independent Test**: An admin can open an active order that is not delivered, choose "Cancel order", confirm, and the order is shown as cancelled.

**Acceptance Scenarios**:

1. **Given** an order exists in any status other than "Delivered", **When** the admin cancels it, **Then** the order changes to "Cancelled" and the admin receives confirmation.
2. **Given** an order exists in status "Delivered", **When** the admin attempts to cancel it, **Then** the system prevents cancellation and shows a message explaining that delivered orders cannot be cancelled.
3. **Given** an admin cancels an order owned by a client, **When** the cancellation is completed, **Then** the client is notified that the order was cancelled by an administrator.

---

### User Story 3 - Order owner and role are validated (Priority: P2)

As the system, I need to ensure that only the client who owns the order or an admin can cancel it, so that unauthorized users cannot disrupt other people's orders.

**Why this priority**: Security and integrity of orders is important, but it is a supporting requirement for the main cancellation flow.

**Independent Test**: A user who is neither the order owner nor an admin cannot trigger a successful cancellation for an existing non-delivered order.

**Acceptance Scenarios**:

1. **Given** a logged-in user who is not the client owner of the order and is not an admin, **When** they attempt to cancel the order, **Then** the system rejects the attempt and informs them they do not have permission.
2. **Given** the order owner is a client, **When** that same client cancels the order, **Then** the cancellation is accepted.

---

### Edge Cases

- What happens when an order is already cancelled? The system must reject a new cancellation attempt and show an appropriate message.
- What happens when an order is in a terminal state other than Delivered? Only Delivered is explicitly excluded by the requirement; any other non-terminal status is assumed eligible for cancellation.
- How does the system handle a cancellation attempt for a non-existent order? It must return a clear "not found" message without exposing internal details.
- What happens if the client and admin try to cancel the same order concurrently? The system must process one cancellation and reject the second attempt with a message that the order is already cancelled.
- What happens if cancellation is requested while the order status is changing to Delivered? The system must apply the order status rule at the moment the cancellation request is validated.
- Is there a refund or payment reversal associated with cancellation? No; refund and payment reversal workflows are out of scope for this feature. Cancellation only changes the order status and records cancellation metadata.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the client who owns the order to cancel the order when the order status is anything other than "Delivered".
- **FR-002**: The system MUST allow an administrator to cancel any order when the order status is anything other than "Delivered".
- **FR-003**: The system MUST prevent cancellation of an order when its status is "Delivered".
- **FR-004**: The system MUST record the actor (client or admin), the user's role, and the timestamp when a cancellation is performed.
- **FR-005**: The system MUST reject cancellation attempts by users who are neither the order owner nor an administrator.
- **FR-006**: The system MUST provide clear feedback to the user when cancellation succeeds, fails due to status, or fails due to permissions.
- **FR-007**: The system MUST notify the order's client when an administrator cancels the order on their behalf.
- **FR-008**: The system MUST treat a previously cancelled order as ineligible for further cancellation.

### Key Entities *(include if feature involves data)*

- **Order**: Represents a commission placed by a client. Key attributes include identifier, client reference, status, cancellation metadata (who cancelled, role, timestamp), and creation date.
- **User**: Represents an authenticated person. Includes role information that distinguishes clients from administrators.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A client can cancel a non-delivered order from start to confirmation in under 1 minute.
- **SC-002**: 100% of attempted cancellations on "Delivered" orders are rejected by the system.
- **SC-003**: 100% of cancellation attempts by unauthorized users are rejected by the system.
- **SC-004**: The client who owns an order receives a notification within 1 minute after an administrator cancels it.
- **SC-005**: Order cancellation status and actor metadata are recorded and retrievable in 100% of successful cancellation cases.

## Assumptions

- The order status workflow includes at least "Pending", "In Progress", "Delivered", and "Cancelled" states.
- User authentication and role information are already available from existing auth mechanisms.
- The order's client is the only non-admin user allowed to cancel their own order; other clients cannot cancel it.
- Refund or payment reversal workflows are out of scope for this feature unless clarified otherwise.
- Notifications to the client are implemented through an existing notification mechanism in the system.
