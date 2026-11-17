# Feature Specification: Visualización Paginada de Pedidos

**Feature Branch**: `003-order-view-paginated`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Como cliente, quiero poder visualizar los pedidos, diferenciando con claridad el estado en el que se encuentran y en cuántos días se entregarán en caso de estar en estado confirmado.. Me gustaría que estos pedidos se vean paginados"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Paginated Order List (Priority: P1)

As a client, I want to view a paginated list of my orders so that I can see all my orders without being overwhelmed by a long list.

**Why this priority**: This is the foundation of the feature. Without a paginated list, the user cannot efficiently browse their orders. This delivers the core value of order visibility.

**Independent Test**: Can be fully tested by creating test orders for a client account and verifying they appear in a paginated list with proper navigation controls. Delivers core order browsing functionality.

**Acceptance Scenarios**:

1. **Given** a client with 15 orders, **When** they navigate to the orders screen, **Then** they see the first 10 orders displayed with pagination controls showing "Page 1 of 2".
2. **Given** a client on page 1 of the order list, **When** they click "Next" or swipe to the next page, **Then** they see the remaining 5 orders and pagination updates to "Page 2 of 2".
3. **Given** a client on page 2 of the order list, **When** they click "Previous", **Then** they return to page 1 with the first 10 orders.
4. **Given** a client with no orders, **When** they navigate to the orders screen, **Then** they see an empty state message "No tienes pedidos aún".
5. **Given** a client with exactly 10 orders, **When** they view the orders screen, **Then** they see all 10 orders on page 1 with no next page option.

---

### User Story 2 - Status Badge Display (Priority: P2)

As a client, I want each order to display its current status with a clear visual indicator so that I can quickly understand where each order stands.

**Why this priority**: Status visibility is the second most important aspect after basic listing. Clear status differentiation helps clients prioritize their attention and take appropriate actions.

**Independent Test**: Can be tested by creating orders in different statuses and verifying each displays a distinct visual badge. Delivers clear status communication.

**Acceptance Scenarios**:

1. **Given** a client viewing their order list, **When** an order has status "PENDIENTE", **Then** it displays a yellow/orange badge labeled "Pendiente".
2. **Given** a client viewing their order list, **When** an order has status "CONFIRMADO", **Then** it displays a blue badge labeled "Confirmado".
3. **Given** a client viewing their order list, **When** an order has status "EN_REVISION", **Then** it displays a purple badge labeled "En Revisión".
4. **Given** a client viewing their order list, **When** an order has status "ENTREGADO", **Then** it displays a green badge labeled "Entregado".
5. **Given** a client viewing their order list, **When** an order has status "CANCELADO", **Then** it displays a red badge labeled "Cancelado".

---

### User Story 3 - Delivery Estimate for Confirmed Orders (Priority: P3)

As a client, I want to see the estimated delivery days for orders in "CONFIRMADO" status so that I know when to expect delivery.

**Why this priority**: Delivery estimates add significant value for confirmed orders but depend on the status display working correctly. This enhances the core listing with actionable information.

**Independent Test**: Can be tested by creating confirmed orders and verifying the delivery estimate is displayed. Delivers delivery expectation management.

**Acceptance Scenarios**:

1. **Given** a client viewing their order list, **When** an order has status "CONFIRMADO" and was confirmed on 2026-07-06, **Then** the order displays "Entrega estimada en 2 días" (assuming 5-day SLA from confirmation).
2. **Given** a client viewing their order list, **When** an order has status "CONFIRMADO" and was confirmed on 2026-07-09, **Then** the order displays "Entrega estimada en 0 días" or "Entrega estimada hoy".
3. **Given** a client viewing their order list, **When** an order has status "PENDIENTE", **Then** no delivery estimate is shown.
4. **Given** a client viewing their order list, **When** an order has status "ENTREGADO", **Then** no delivery estimate is shown (delivery already completed).
5. **Given** a client viewing their order list, **When** an order has status "CANCELADO", **Then** no delivery estimate is shown.

---

### Edge Cases

- What happens when a client has orders in all statuses simultaneously? → Each order should display its respective status badge and delivery estimate (if applicable) independently.
- How does the system handle page navigation when orders are created/deleted between page loads? → Pagination should reflect the current state; stale page data is acceptable for in-memory storage.
- What happens when a confirmed order's delivery date has passed but status hasn't updated? → Show "Entrega estimada en 0 días" or "Entrega estimada hoy" — status updates are handled by other features.
- How does the system handle extremely long order titles or descriptions? → Text should be truncated with ellipsis to maintain list layout consistency.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST return orders paginated with a default page size of 10 items per page.
- **FR-002**: System MUST support page navigation parameters (page number) in the API request.
- **FR-003**: System MUST return total count of orders and total pages in the API response to enable pagination controls.
- **FR-004**: System MUST filter orders to show only those belonging to the authenticated client.
- **FR-005**: Each order MUST display a visual status badge corresponding to its `EstadoPedido` value.
- **FR-006**: Status badges MUST use distinct colors for each status: PENDIENTE (yellow/orange), CONFIRMADO (blue), EN_REVISION (purple), ENTREGADO (green), CANCELADO (red).
- **FR-007**: Status badges MUST display human-readable labels in Spanish (e.g., "Pendiente", "Confirmado", "En Revisión").
- **FR-008**: For orders with status "CONFIRMADO", the system MUST display an estimated delivery time.
- **FR-009**: Delivery estimate MUST be calculated as the number of days remaining until delivery, based on a fixed SLA from the order confirmation date.
- **FR-010**: Delivery estimate MUST NOT be displayed for orders with statuses other than "CONFIRMADO".
- **FR-011**: System MUST display an empty state message when the client has no orders.
- **FR-012**: Order list MUST display key order information: order ID, gig/service name, total amount, order date, and status.

### Key Entities

- **Pedido (Order)**: Represents a client's order with attributes: client reference, gig reference, status (EstadoPedido), total amount, rating, messages. Key timestamps: creation date, confirmation date.
- **EstadoPedido (Order Status)**: Enum with values: PENDIENTE, CONFIRMADO, EN_REVISION, ENTREGADO, CANCELADO. Determines visual badge and delivery estimate eligibility.
- **Pagination Result**: API response structure containing: list of orders for the current page, total number of orders, current page number, total number of pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Client can view their paginated order list within 2 seconds of navigating to the orders screen.
- **SC-002**: 100% of orders display the correct status badge with appropriate color coding.
- **SC-003**: Delivery estimates are displayed for 100% of confirmed orders and 0% of non-confirmed orders.
- **SC-004**: Pagination controls accurately reflect the total number of orders and pages.
- **SC-005**: Client can navigate between pages without losing their position in the order list.
- **SC-006**: Empty state is displayed within 1 second when no orders exist for the client.

## Assumptions

- The authenticated client's ID is available from the JWT token (from the existing auth system).
- The backend `PedidoRepository` already stores orders with all necessary fields (status, creation date, confirmation date).
- The fixed SLA for delivery estimation is 5 business days from confirmation (configurable constant).
- Pagination is implemented server-side to avoid transferring unnecessary data to the client.
- The frontend will use the existing `AppCard` and `AppText` shared primitives for order display.
- Order list will be accessible from the client's dashboard or main navigation.
- The current in-memory storage is sufficient for pagination; no database pagination optimizations are needed.
- Status badge colors follow common UI conventions (green = success, red = danger, yellow = pending, blue = info, purple = in-progress).
