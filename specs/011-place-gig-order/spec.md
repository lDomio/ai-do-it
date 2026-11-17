# Feature Specification: Place Gig Order

**Feature Branch**: `[011-place-gig-order]`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Como cliente, quiero poder realizar un pedido sobre un Gig seleccionando uno de los paquetes disponibles y especificando los requerimientos particulares."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Package and Place Order (Priority: P1)

As a customer, I want to choose one of the available packages offered by a freelancer for a specific Gig, provide the details the freelancer needs to fulfill the order, and submit the order so that the freelancer can start working on it.

**Why this priority**: Placing a complete and valid order is the core outcome of this feature. Without it, the marketplace cannot generate value for either customers or freelancers.

**Independent Test**: Can be fully tested by navigating to a Gig, selecting a package, entering order requirements, confirming the order, and observing that the order appears in the customer's order list with a "pending" or "placed" status.

**Acceptance Scenarios**:

1. **Given** a customer is viewing a Gig with at least one package, **When** the customer selects a package, enters valid requirements, and confirms the order, **Then** the system creates an order linked to the selected package and Gig, assigns a pending status, and shows the customer a confirmation summary.
2. **Given** a customer has selected a package and provided requirements, **When** the order is successfully placed, **Then** the order becomes visible to both the customer and the freelancer in their respective order histories.

---

### User Story 2 - Prevent Submission with Missing or Invalid Data (Priority: P2)

As a customer, I want the system to prevent me from placing an order if I have not selected a package or if my requirements are invalid, so that I can correct mistakes before the order is created.

**Why this priority**: Clear validation protects order quality, reduces disputes, and avoids creating incomplete or unusable orders that waste freelancer time.

**Independent Test**: Can be tested by attempting to place an order without selecting a package, with blank requirements, or with requirements exceeding defined limits, and verifying that the order is not created and the user receives a clear error message.

**Acceptance Scenarios**:

1. **Given** a customer is placing an order, **When** the customer tries to submit without selecting a package, **Then** the system rejects the submission and shows a message indicating that a package must be selected.
2. **Given** a customer has selected a package, **When** the customer submits requirements that are empty or shorter than the minimum allowed length, **Then** the system rejects the submission and shows a message describing the requirements rule.

---

### User Story 3 - Review Order Before Confirming (Priority: P3)

As a customer, I want to review the package details, price, delivery time, and the requirements I entered before finalizing the order, so that I am confident the order matches my expectations.

**Why this priority**: A pre-confirmation review reduces buyer's remorse, accidental orders, and support requests, improving trust in the marketplace.

**Independent Test**: Can be tested by entering order details and reaching a confirmation step where the selected package, price, delivery time, and requirements are displayed before the final submit action.

**Acceptance Scenarios**:

1. **Given** a customer has selected a package and entered requirements, **When** the customer proceeds to the confirmation step, **Then** the system displays the package name, included items, price, estimated delivery time, and the requirements provided.
2. **Given** a customer is on the confirmation step, **When** the customer notices an error in the requirements, **Then** the customer can return to the requirements step, edit the text, and the updated text appears in the confirmation step.

---

### Edge Cases

- What happens when a customer tries to place an order for a Gig that no longer has any active packages?
- How does the system handle a requirement text that reaches the maximum allowed length?
- What happens if the selected package is changed by the freelancer between selection and submission?
- How does the system respond when a customer submits the same order twice in quick succession?
- What happens if the customer account is restricted or not authenticated when attempting to place an order?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a customer to initiate an order from a Gig detail page.
- **FR-002**: The system MUST present all active packages associated with the Gig so the customer can select one.
- **FR-003**: The system MUST require the customer to provide order requirements describing what they need the freelancer to deliver.
- **FR-004**: The system MUST validate that a package has been selected before an order can be placed.
- **FR-005**: The system MUST validate that requirements are not empty and meet a minimum length defined by the marketplace.
- **FR-006**: The system MUST show a confirmation view with the selected package details, price, delivery time, and requirements before the order is finalized.
- **FR-007**: The system MUST create an order record when the customer confirms, linking the order to the customer, the Gig, the selected package, and the provided requirements.
- **FR-008**: The system MUST assign a status to the newly created order (e.g., pending or placed) that indicates it awaits freelancer action.
- **FR-009**: The system MUST make the placed order visible in the customer's order history immediately after creation.
- **FR-010**: The system MUST make the placed order visible to the freelancer who owns the Gig immediately after creation.

### Key Entities *(include if feature involves data)*

- **Order**: Represents a customer's request for a Gig package. Key attributes include customer reference, Gig reference, selected package reference, requirements text, order status, creation date, and total price.
- **Gig**: Represents a freelancer service listing. A Gig has one or more packages and is owned by a freelancer.
- **Package**: Represents a priced tier of a Gig with a defined scope, delivery time, and included items.
- **Customer**: The user placing the order.
- **Freelancer**: The user who owns the Gig and will fulfill the order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A customer can place an order from a Gig page in under 3 minutes after selecting a package and entering requirements.
- **SC-002**: 95% of attempted orders are successfully placed on the first submission without validation errors.
- **SC-003**: Orders placed by a customer appear in the customer's order history within 5 seconds of confirmation.
- **SC-004**: Orders placed for a freelancer's Gig become visible to the freelancer within 5 seconds of confirmation.
- **SC-005**: 100% of placed orders include a selected package, linked Gig, and non-empty requirements.

## Assumptions

- Customers are authenticated and authorized to place orders when using this feature.
- The Gig and its packages already exist and are active before a customer attempts to place an order.
- The order requirements field accepts plain text with a configured minimum and maximum length.
- Payment processing is handled in a separate feature and is out of scope for this specification.
- Order status lifecycle beyond the initial "pending" or "placed" state is managed by other features such as order management or delivery.
- The marketplace supports only one package selection per order; multiple packages require separate orders.
