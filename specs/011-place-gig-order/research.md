# Research: Place Gig Order

## Unknowns Resolved

### 1. Order Domain Model

**Decision**: Extend the existing `Pedido` domain class to include `paqueteId` and `requerimientos` while keeping `total`, `gig`, `cliente`, and `estado`.

**Rationale**:
- The existing `Pedido` class already supports `cliente`, `gig`, `total`, and `estado` (`Pendiente`).
- The feature requires selecting one package per order and entering requirements, so the order must remember the chosen package and the requirements text.
- Using the existing domain keeps data and behavior together (Constitution XI — High Cohesion) and minimizes changes to unrelated modules.

**Alternatives considered**:
- Create a separate `OrderRequest` entity. Rejected because it would duplicate the concept of an order and force future order-management features to reconcile two entities.
- Store only the price snapshot. Rejected because the feature explicitly needs to show the selected package details to both parties and the freelancer needs the package context to fulfill the order.

### 2. Order Placement Endpoint

**Decision**: Add a dedicated, authenticated `POST /pedidos/reservar` endpoint for placing an order from a Gig and package selection.

**Rationale**:
- The existing `POST /pedidos` is too generic and does not validate package selection, Gig existence, or requirements.
- A dedicated endpoint can enforce the complete placement rules (Constitution VIII — Robustness: validate all external inputs).
- It keeps the controller thin: the route delegates to `PedidoService.placeOrder(...)` which owns the business rules (Constitution I — SRP).

**Alternatives considered**:
- Reuse `POST /pedidos` with extra fields. Rejected because it would overload the endpoint with mixed semantics (admin creation vs. customer placement) and blur validation boundaries.
- Add a separate `/gigs/:id/order` resource. Rejected because the order is the primary resource; nesting under `/gigs` makes pagination and order-centric operations less consistent with the existing `/pedidos` API.

### 3. Requirements Validation Rules

**Decision**: Requirements are plain text, required, with a minimum length of 20 characters and a maximum length of 2000 characters.

**Rationale**:
- A minimum length ensures customers provide enough detail for the freelancer to start working, reducing back-and-forth messages.
- A maximum length protects against abuse and keeps storage predictable.
- Plain text is the simplest format that satisfies the spec and aligns with the current in-memory persistence strategy.

**Alternatives considered**:
- No minimum length. Rejected because empty or single-word requirements violate FR-005 and would reduce order quality.
- Structured fields (e.g., answers to gig-specific questions). Rejected because the spec only mentions "requerimientos particulares" and adding per-Gig questionnaires is out of scope for this feature.

### 4. Order Total and Delivery Time

**Decision**: The order total is copied from the selected package price at creation time. The delivery time displayed is the package's `diasEntrega`. The existing SLA calculation (`SLA_DIAS_ENTREGA`) is preserved for confirmed orders but not used at placement time.

**Rationale**:
- The spec says the confirmation view must show price and delivery time. Copying the price at creation creates an immutable snapshot, protecting the order if the package price changes later.
- `diasEntrega` is already a required package attribute and is the natural delivery promise to display.

**Alternatives considered**:
- Compute total on read from the live package price. Rejected because it would expose historical orders to future price changes, which is incorrect for an order record.
- Add a separate delivery promise to the order independent from the package. Rejected because it duplicates the package's delivery promise without adding value for this feature.

### 5. Duplicate Submission Protection

**Decision**: Implement idempotency using a per-request `Idempotency-Key` header or a short-lived client-generated request UUID. The backend stores recent successful placement keys for 5 minutes.

**Rationale**:
- The spec's edge cases explicitly ask about rapid duplicate submissions.
- An idempotency key prevents accidental duplicate orders without requiring complex distributed locks.
- It keeps the solution simple (Constitution X — YAGNI/KISS) while satisfying robustness.

**Alternatives considered**:
- Disable the submit button on the client. Rejected because client-only protection is unreliable (network retries, double-clicks still possible).
- Create a unique constraint on `(cliente, gig, paqueteId, requerimientos)` hash. Rejected because it would block legitimate repeated orders for the same package and requirements.

### 6. Frontend Order Flow

**Decision**: The existing `GigDetailScreen` "Continuar" button opens a two-step modal/screen: (1) requirements input, (2) confirmation summary.

**Rationale**:
- The spec requires a confirmation view showing package, price, delivery time, and requirements before final submission.
- A two-step flow is the minimal change to the existing screen; it does not require a new top-level route unless navigation complexity increases later.
- The screen delegates API calls to an `orderService` (Constitution I — SRP; React Native components must not call APIs directly).

**Alternatives considered**:
- Inline expansion on `GigDetailScreen`. Rejected because the requirements input and confirmation together would clutter the detail view and violate the review-before-submit story.
- Separate navigation screen. Rejected as unnecessary for v1; a modal keeps context and is simpler to implement.

## Project Context Notes

- **Backend**: Node.js + Express, in-memory `Map`-based repositories, `Pedido`/`Gig`/`Paquete` domain classes, Swagger annotations for API docs.
- **Frontend**: React Native (Expo), context-based state, mock API layer (`USE_MOCK = true`), custom `useApiClient` hook.
- **Existing patterns**: `*Service` classes with injected repositories, `*Controller` classes handling HTTP translation, `*Repository` classes for persistence.
- **Observations**: The existing `PedidoController.create` is unauthenticated and under-validated; the new `/pedidos/reservar` endpoint will be authenticated and fully validated. The frontend `GigDetailScreen` currently simulates an order with an `Alert`; this feature will wire it to a real order flow.
