# Specification: Refactor Frontend - AI Do It Freelance Platform

## Overview

The mobile application frontend was incorrectly implemented as a medical appointment system ("Sweet Medical"). It must be completely refactored to become a **freelance services marketplace platform** called "AI Do It", connecting freelancers who offer services with buyers who want to hire them.

## Actors

| Actor | Description |
|-------|-------------|
| **Buyer (Comprador)** | Person who searches for and hires freelance services |
| **Freelancer** | Person who publishes and offers services (gigs) with different packages |
| **Dual-role User** | Person who can switch between Buyer and Freelancer modes |

## User Scenarios & Testing

### Scenario 1: Browse and Discover Services (Buyer)

**Given** I am a buyer on the home screen
**When** I open the app
**Then** I see a personalized greeting, search bar, category chips, featured gigs, and trending gigs
**And** I can tap a category to filter gigs
**And** I can tap a gig to view its details

**Test**: Verify home screen loads with greeting, search bar, at least 3 category chips, and at least 2 featured/trending gig cards.

---

### Scenario 2: Search and Filter Gigs (Buyer)

**Given** I am on the Explore screen
**When** I type in the search bar
**Then** gigs matching my query are displayed
**And** I can filter by category using chips
**And** I can sort results by relevance, price, rating, or date

**Test**: Search "logo" → results show gigs with "logo" in title. Filter by "Diseño" → only design gigs shown. Sort by price → gigs ordered by price.

---

### Scenario 3: View Gig Details and Select Package (Buyer)

**Given** I tap on a gig card
**When** the Gig Detail screen opens
**Then** I see: hero image, tags, seller info with rating, description, package tabs (Basic/Standard/Premium)
**And** each package shows: price, delivery time, features included
**And** I can select a package and proceed to order

**Test**: Gig detail loads with all sections. Tapping "Básico" shows basic package details. Tapping "Contratar" triggers order confirmation.

---

### Scenario 4: Create a Gig (Freelancer)

**Given** I am a freelancer on the Profile screen
**When** I tap "Crear Gig"
**Then** I see a form to enter: title, description, category, tags, package details (name, price, delivery days, features)
**And** I can submit the form to publish my gig

**Test**: Form validates required fields. Submitting creates a new gig visible in the platform.

---

### Scenario 5: View and Manage Orders (Buyer)

**Given** I am on the Orders screen
**When** I view my orders
**Then** I see active orders with: gig title, seller name, status badge, progress bar, days remaining
**And** I see historical completed/canceled orders
**And** I can tap an order to view its details

**Test**: Orders screen shows at least 1 active order with progress bar. Historical section shows completed orders.

---

### Scenario 6: Track Order Progress and Chat (Buyer/Freelancer)

**Given** I tap on an order
**When** the Order Detail screen opens
**Then** I see a stepper showing order status progression (Pending → Confirmed → In Review → Delivered → Completed)
**And** I see tabs: "Detalles" and "Chat (N)"
**And** I can send/receive messages in the chat
**And** I can cancel the order (if not yet delivered)

**Test**: Stepper shows correct current status. Chat allows sending a message. Cancel button shows confirmation dialog.

---

### Scenario 7: Leave a Review (Buyer)

**Given** I have a completed order
**When** I tap "Dejar reseña"
**Then** I can rate the gig (1-5 stars) and write a comment
**And** the review appears on the gig detail page

**Test**: Review form submits successfully. Review appears in gig detail's review section.

---

### Scenario 8: Switch Roles (User)

**Given** I am on the Profile screen
**When** I toggle between "Comprador" and "Freelancer"
**Then** the profile view changes to show relevant stats and options
**And** as Freelancer I see my published gigs and can create new ones
**And** as Buyer I see my recent orders

**Test**: Toggle switches profile view. Freelancer view shows gig management. Buyer view shows order history.

---

## Functional Requirements

### FR-01: Home Screen
- Display personalized greeting with user name
- Show search bar that navigates to Explore screen
- Display user stats (services, freelancers, orders)
- Show scrollable category chips (Todos, Diseño, Desarrollo, Marketing, etc.)
- Show "Destacados" section with horizontal scroll of featured gigs
- Show "Tendencia" section with trending gigs

### FR-02: Explore Screen
- Full-text search for gigs
- Category filter chips
- Sort by: Relevance, Price (low-high/high-low), Rating, Date
- Display results as vertical list of gig cards
- Show result count

### FR-03: Gig Detail Screen
- Hero image with back and favorite buttons
- Tag chips (e.g., Logo, Branding, Identidad Visual)
- Seller info: avatar, name, rating (stars + count), "Ver perfil" link
- Description text
- Package selector tabs: Básico / Estándar / Premium
- Package card: price, delivery time, feature checklist
- Reviews section with user reviews
- "Contratar" button to initiate order

### FR-04: Orders Screen (Buyer)
- Tab view: Activos / Historial
- Active orders card: gig image, title, seller, package, status badge, price, progress bar with days remaining
- Status badges: En progreso (blue), Entregado (green), Pendiente (amber)
- Action buttons: "Dejar reseña" (for delivered), "Ver entrega"
- Historical orders: completed/cancelled with date and amount

### FR-05: Order Detail Screen
- Header: order ID, gig title, status badge
- Stepper: 5-step progress indicator (checkmarks for completed, numbers for pending)
- Tabs: Detalles / Chat (with unread count)
- Details tab: seller info, package, total paid, order date, delivery deadline, days remaining
- Chat tab: message list, text input, send button
- Cancel order button (with confirmation modal)

### FR-06: Profile Screen
- Header with avatar, name, membership date
- Role toggle: Comprador / Freelancer
- Stats cards: Completed, Active, Spent/Earned
- Buyer view: Recent orders list
- Freelancer view: My gigs list, "Crear Gig" button
- Settings menu: Notifications, Privacy & Security, Payment Methods

### FR-07: Create Gig Screen (Freelancer)
- Title input
- Description textarea
- Category selector
- Tags input
- Package forms (×3): name, price, delivery days, features list
- Image upload placeholder
- Submit button

---

## Success Criteria

| Criterion | Metric |
|-----------|--------|
| **Navigation** | User can reach any screen within 2 taps from home |
| **Search** | Search results appear instantly (< 500ms perceived) |
| **Order tracking** | Status progression is visually clear at a glance |
| **Chat** | Messages send and display correctly |
| **Role switching** | Toggle between Buyer/Freelancer in < 2 seconds |
| **Gig creation** | Freelancer can publish a gig in under 3 minutes |
| **Review submission** | Buyer can leave review in under 1 minute |
| **Visual consistency** | All screens follow the violet/amber color palette |
| **Icon consistency** | All icons use vector icons (no emojis) |

---

## Key Entities

| Entity | Properties |
|--------|-----------|
| **Gig** | id, title, description, category, tags[], seller, packages[], rating, reviewCount, images[] |
| **Package** | name (Básico/Estándar/Premium), price, deliveryDays, features[] |
| **Order** | id, gig, buyer, seller, package, status, totalPrice, createdAt, deliveryDeadline, messages[] |
| **Review** | id, gig, buyer, rating (1-5), comment, createdAt |
| **Message** | id, orderId, senderId, senderType (BUYER/FREELANCER), content, createdAt |
| **User** | id, name, email, avatar, role (BUYER/FREELANCER/BOTH), stats{} |

---

## Assumptions

1. The app runs locally on a mobile device (Expo Go)
2. Data is persisted in memory (mock data mode)
3. Authentication is simulated (demo token)
4. The backend API structure is already defined and will be implemented separately
5. Images are represented by placeholders in mock data
6. The design follows the Figma mockup exactly (390×844px iPhone frame)
7. The color palette is: Violet (#6D28D9) primary, Amber (#F59E0B) accent
8. Typography: Plus Jakarta Sans (headings) + DM Sans (body)
9. All icons use Feather icon family from @expo/vector-icons

---

## Dependencies

- The existing shared primitives (AppText, AppButton, AppCard, AppInput) are retained
- The theme.js file is updated with the correct color palette
- The navigation structure uses React Navigation v7 with bottom tabs
- Mock data must be realistic (real gig titles, prices in ARS, Argentine Spanish)

---

## Out of Scope

- Backend refactoring (separate specification)
- Payment processing
- Real-time notifications
- Image upload/storage
- User registration flow (demo mode only)
