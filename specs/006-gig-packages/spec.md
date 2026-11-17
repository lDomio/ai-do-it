# Feature Specification: Gig Packages for Freelancers

**Feature Branch**: `006-gig-packages`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Como freelancer, quiero poder crear un Gig ofreciendo distintos paquetes, permitiendo adaptarse a diferentes necesidades y presupuestos de los clientes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Gig with Multiple Packages (Priority: P1)

As a freelancer, I want to create a Gig by defining multiple packages (Básico, Estándar, Premium) so that I can offer different service tiers at different price points.

**Why this priority**: This is the core feature — without the ability to create packages, freelancers cannot offer differentiated services.

**Independent Test**: Can be fully tested by creating a gig with 3 packages and verifying all data is persisted correctly.

**Acceptance Scenarios**:

1. **Given** I am a freelancer on the Create Gig screen, **When** I fill in the gig title, description, category, and tags, **Then** the gig information is saved as a draft.
2. **Given** I have started creating a gig, **When** I add a package with name, price, delivery days, and features, **Then** the package is attached to the gig.
3. **Given** I am creating a gig, **When** I define 3 packages (Básico, Estándar, Premium) with increasing prices and features, **Then** all 3 packages are saved and displayed on the gig detail page.
4. **Given** I am creating a gig, **When** I try to submit without at least one package defined, **Then** I see an error message requiring at least one package.

---

### User Story 2 - View Gig with Packages (Priority: P2)

As a buyer, I want to see all available packages for a gig so I can compare options and choose the one that fits my budget.

**Why this priority**: Buyers need to see packages to make a purchasing decision.

**Independent Test**: Can be tested by viewing a gig detail page and verifying all packages are displayed with their details.

**Acceptance Scenarios**:

1. **Given** I am viewing a gig detail page, **When** the page loads, **Then** I see package tabs (Básico / Estándar / Premium) and the default selected package shows its price, delivery time, and features.
2. **Given** I am viewing a gig, **When** I tap on a different package tab, **Then** the displayed price, delivery time, and features update to reflect the selected package.
3. **Given** I am viewing a gig, **When** I see multiple packages, **Then** I can visually distinguish which package is currently selected.

---

### User Story 3 - Edit Gig Packages (Priority: P3)

As a freelancer, I want to edit my existing gig's packages so I can adjust prices or features based on market feedback.

**Why this priority**: Freelancers need to iterate on their offerings over time.

**Independent Test**: Can be tested by editing a gig's packages and verifying changes are persisted.

**Acceptance Scenarios**:

1. **Given** I am viewing my published gig, **When** I tap "Editar", **Then** I can modify any package field (name, price, delivery days, features).
2. **Given** I am editing a package, **When** I change the price from $5000 to $7000, **Then** the new price is saved and reflected on the gig detail page.
3. **Given** I am editing my gig, **When** I try to remove all packages, **Then** I see an error requiring at least one package to remain.

---

### User Story 4 - Delete a Package (Priority: P3)

As a freelancer, I want to remove a package from my gig so I can simplify my offering if needed.

**Why this priority**: Allows freelancers to refine their service tiers.

**Independent Test**: Can be tested by deleting a package and verifying it is removed from the gig.

**Acceptance Scenarios**:

1. **Given** I am editing a gig with 3 packages, **When** I delete the Premium package, **Then** only Básico and Estándar remain.
2. **Given** I am editing a gig with only 1 package, **When** I try to delete it, **Then** I see an error message that at least one package is required.

---

### Edge Cases

- What happens when a package price is set to zero? (System allows free packages, but displays "Gratis" label)
- What happens when delivery days is set to 0? (System allows same-day delivery)
- What happens when a feature description is empty? (System requires at least one feature per package)
- What happens when the gig has no image? (System uses a default placeholder image)
- What happens when the user navigates away mid-creation? (Draft is saved and can be resumed later)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow freelancers to create a Gig with a title, description, category, tags, and at least one image.
- **FR-002**: System MUST allow freelancers to define up to 3 packages per Gig, each with a name, price (in ARS), delivery time (in days), and a list of included features.
- **FR-003**: System MUST validate that each Gig has at least one package before publishing.
- **FR-004**: System MUST validate that each package has at least one feature.
- **FR-005**: System MUST display packages on the Gig detail page as selectable tabs (Básico / Estándar / Premium).
- **FR-006**: System MUST show package-specific details (price, delivery time, features) when a tab is selected.
- **FR-007**: System MUST allow freelancers to edit existing Gig packages.
- **FR-008**: System MUST allow freelancers to delete individual packages (minimum 1 required).
- **FR-009**: System MUST persist Gig and package data across sessions (in-memory persistence for this phase).
- **FR-010**: System MUST display a default placeholder image when no gig image is provided.
- **FR-011**: System MUST validate that package prices are non-negative numbers.
- **FR-012**: System MUST validate that delivery days are non-negative integers.

### Key Entities

- **Gig**: Represents a service offered by a freelancer. Attributes: id, title, description, category, tags[], images[], packages[], seller (User), rating, reviewCount, createdAt, status.
- **Package**: A specific service tier within a Gig. Attributes: id, name (e.g., "Básico", "Estándar", "Premium"), price (ARS), deliveryDays, features[] (list of included items).
- **User**: The freelancer or buyer. Attributes: id, name, email, avatar, role (FREELANCER/BUYER/BOTH).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Freelancer can create a complete Gig with 3 packages in under 3 minutes.
- **SC-002**: Buyer can view and compare all packages for a gig within 5 seconds of opening the detail page.
- **SC-003**: 95% of gig creation attempts succeed without validation errors (assuming correct input).
- **SC-004**: Package switching (tab selection) responds instantly (< 200ms perceived).
- **SC-005**: All package data is correctly persisted — no data loss on app restart.

## Assumptions

1. The app runs locally on a mobile device (Expo Go) with in-memory persistence.
2. Authentication is simulated (demo token); the freelancer is identified by the demo user.
3. The color palette is Violet (#6D28D9) primary, Amber (#F59E0B) accent.
4. Package names follow the convention: Básico, Estándar, Premium (freelancer can customize names).
5. Prices are in Argentine Pesos (ARS) and displayed with the "$" symbol.
6. Delivery days are business days (not calendar days).
7. The backend API structure is already defined; this spec focuses on the frontend integration.
8. Images are represented by placeholders in mock data.
9. The design follows the Figma mockup exactly (390×844px iPhone frame).

## Dependencies

- Existing shared primitives (AppText, AppButton, AppCard, AppInput).
- React Navigation v7 for screen navigation.
- Existing mock data structure for users and gigs.
- Theme configuration (colors, typography) from theme.js.

## Out of Scope

- Backend API implementation (separate specification).
- Image upload/storage (placeholder images only).
- Payment processing for package purchases.
- Real-time notifications for gig updates.
- Analytics on package performance.
