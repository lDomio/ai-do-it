# Research: Order Cancellation by Client and Admin

## Unknowns Identified

1. **Concurrency model for status transition**: How to avoid race conditions when an order status changes to Delivered while a cancellation request is in progress.
2. **Notification mechanism for admin cancellation**: Existing notification channel used by the app to inform clients of order changes.
3. **Backend/frontend boundary for authorization**: Where the ownership and role checks happen to prevent unauthorized cancellation attempts.

## Decisions

### Decision 1: Validate cancellation at service layer

- **Decision**: The cancellation eligibility rule (status is not "Delivered") and authorization (client owner or admin) are enforced in the backend service layer, not only in the frontend or database.
- **Rationale**: This guarantees the rule is applied consistently across all clients (web, mobile, API). It also satisfies the Robustness and Security principles by validating all external input on the server.
- **Alternatives considered**: Enforcing rules only in the frontend (insufficient, bypassable) or only in the route controller (fragile if reused). Service-layer validation is the project standard used by other features such as gig packages and order delivery chat.

### Decision 2: Use an atomic status check-and-update pattern

- **Decision**: Cancellation reads the current order status, validates it, then writes the new status. With in-memory persistence this is naturally synchronous and atomic within a single Node.js event loop.
- **Rationale**: The constitution selects in-memory persistence. The operation duration is bounded and the status check happens immediately before the write, which prevents the "changing to Delivered" race for this scale.
- **Alternatives considered**: Introducing optimistic locking or transactions. Rejected because in-memory persistence does not support transactions and the risk is negligible for the current scale; YAGNI applies.

### Decision 3: Notify the client via an observer/event pattern

- **Decision**: When an admin cancels an order, an order-cancelled event is emitted and a notification handler delivers the message to the client through the existing notification mechanism.
- **Rationale**: Observer keeps the cancellation service decoupled from notification details and matches the mandatory Observer Pattern in the constitution for real-time state updates.
- **Alternatives considered**: Calling the notification logic directly inside the cancellation service. Rejected because it couples cancellation to notification delivery and complicates testing.

### Decision 4: Define cancellation as a command with explicit actor information

- **Decision**: The cancellation contract accepts an actor identifier and role; the system stores `cancelledBy`, `cancelledByRole`, and `cancelledAt` on the order.
- **Rationale**: Satisfies FR-004 (record actor, role, timestamp) and produces an audit trail without a separate audit table.
- **Alternatives considered**: Separate cancellation record entity. Rejected because the requirement only asks for metadata, not a full audit log, keeping the model simple.

## Best Practices Applied

- **Repository Pattern**: Order status update goes through the `OrderRepository` interface, not direct store manipulation.
- **SRP**: Cancellation logic lives in `OrderService`; HTTP concerns in controllers; persistence in repositories.
- **Observer Pattern**: Order status changes emit events so notifications and future side effects can subscribe without modifying the cancellation service.
- **Defensive validation**: Non-existent orders and unauthorized users receive clear, user-friendly error messages.
