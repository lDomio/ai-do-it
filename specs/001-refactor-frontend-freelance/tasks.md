# Tasks: Refactor Frontend - AI Do It Freelance Platform

## Feature: AI Do It - Freelance Platform

**Spec**: [spec.md](./spec.md)
**Data Model**: [data-model.md](./data-model.md)
**Contracts**: [contracts/api.md](./contracts/api.md)

---

## Phase 1: Setup

- [ ] T001 Remove all medical domain files from src/screens/ directory
- [ ] T002 Remove medical components from src/components/ directory (AppointmentCard, AppointmentStatusBadge, CoverageBadge, StatusStepper)
- [ ] T003 Remove medical hooks from src/hooks/ directory (useAppointments, useSearch, useChat)
- [ ] T004 Remove medical context from src/context/AppContext.js
- [ ] T005 Remove medical mock data from src/services/mockData.js
- [ ] T006 Update src/theme.js with correct color palette (Violet #6D28D9, Amber #F59E0B)
- [ ] T007 Update src/services/apiClient.js to remove medical mock data imports
- [ ] T008 Create src/services/mockData.js with freelance platform mock data (gigs, users, orders)

---

## Phase 2: Foundational

- [ ] T009 Create src/context/AppContext.js with freelance platform state (user, gigs, orders, currentRole)
- [ ] T010 Create src/hooks/useGigs.js hook for gig CRUD operations
- [ ] T011 Create src/hooks/useOrders.js hook for order management
- [ ] T012 Create src/hooks/useOrderChat.js hook for chat within orders
- [ ] T013 Create src/hooks/useProfile.js hook for user profile and role switching
- [ ] T014 Create src/components/GigCard.js component for displaying gig in lists
- [ ] T015 Create src/components/CategoryChip.js component for category filters
- [ ] T016 Create src/components/StatusBadge.js component for order status display
- [ ] T017 Create src/components/OrderStepper.js component for order progress visualization

---

## Phase 3: US1 - Browse and Discover Services (Home Screen)

- [ ] T018 [US1] Create src/screens/HomeScreen.js with greeting, search bar, categories, featured gigs
- [ ] T019 [US1] Implement horizontal scroll for category chips in HomeScreen
- [ ] T020 [US1] Implement "Destacados" section with horizontal gig card scroll
- [ ] T021 [US1] Implement "Tendencia" section with trending gigs list
- [ ] T022 [US1] Add navigation from HomeScreen to ExploreScreen on search bar tap
- [ ] T023 [US1] Add navigation from HomeScreen to GigDetailScreen on gig card tap

---

## Phase 4: US2 - Search and Filter Gigs (Explore Screen)

- [ ] T024 [US2] Create src/screens/ExploreScreen.js with search bar and filters
- [ ] T025 [US2] Implement full-text search functionality in ExploreScreen
- [ ] T026 [US2] Implement category filter chips in ExploreScreen
- [ ] T027 [US2] Implement sort dropdown (Relevance, Price, Rating, Date)
- [ ] T028 [US2] Display search results as vertical GigCard list
- [ ] T029 [US2] Show result count in ExploreScreen header
- [ ] T030 [US2] Add navigation from ExploreScreen to GigDetailScreen on gig tap

---

## Phase 5: US3 - View Gig Details and Select Package

- [ ] T031 [US3] Create src/screens/GigDetailScreen.js with hero image and back button
- [ ] T032 [US3] Implement tag chips display in GigDetailScreen
- [ ] T033 [US3] Implement seller info section (avatar, name, rating, "Ver perfil")
- [ ] T034 [US3] Implement description section in GigDetailScreen
- [ ] T035 [US3] Create src/components/PackageSelector.js for Básico/Estándar/Premium tabs
- [ ] T036 [US3] Implement package card with price, delivery time, features checklist
- [ ] T037 [US3] Implement "Contratar" button with order confirmation flow
- [ ] T038 [US3] Add reviews section in GigDetailScreen

---

## Phase 6: US4 - Create a Gig (Freelancer)

- [ ] T039 [US4] Create src/screens/CreateGigScreen.js with form fields
- [ ] T040 [US4] Implement title input with validation
- [ ] T041 [US4] Implement description textarea
- [ ] T042 [US4] Implement category selector dropdown
- [ ] T043 [US4] Implement tags input with add/remove functionality
- [ ] T044 [US4] Create src/components/PackageForm.js for package details entry
- [ ] T045 [US4] Implement 3 package forms (Básico, Estándar, Premium)
- [ ] T046 [US4] Implement image upload placeholder
- [ ] T047 [US4] Implement form validation and submit functionality
- [ ] T048 [US4] Add navigation from ProfileScreen to CreateGigScreen

---

## Phase 7: US5 - View and Manage Orders (Buyer)

- [ ] T049 [US5] Create src/screens/OrdersScreen.js with tab view (Activos/Historial)
- [ ] T050 [US5] Implement active orders list with GigCard-style order cards
- [ ] T051 [US5] Implement order card with status badge, progress bar, days remaining
- [ ] T052 [US5] Implement "Dejar reseña" button for delivered orders
- [ ] T053 [US5] Implement "Ver entrega" button for delivered orders
- [ ] T054 [US5] Implement historical orders section
- [ ] T055 [US5] Add navigation from OrdersScreen to OrderDetailScreen on order tap

---

## Phase 8: US6 - Track Order Progress and Chat

- [ ] T056 [US6] Create src/screens/OrderDetailScreen.js with header and stepper
- [ ] T057 [US6] Implement 5-step OrderStepper (PENDIENTE → CONFIRMADO → EN_REVISION → ENTREGADO → COMPLETADO)
- [ ] T058 [US6] Implement "Detalles" tab with order info (seller, package, price, dates)
- [ ] T059 [US6] Create src/components/ChatPanel.js for message display and input
- [ ] T060 [US6] Implement "Chat" tab with message list and send functionality
- [ ] T061 [US6] Implement unread message count in Chat tab
- [ ] T062 [US6] Implement "Cancelar pedido" button with confirmation modal
- [ ] T063 [US6] Implement cancel order functionality

---

## Phase 9: US7 - Leave a Review

- [ ] T064 [US7] Create src/components/ReviewForm.js with star rating and comment
- [ ] T065 [US7] Implement 1-5 star rating selection
- [ ] T066 [US7] Implement comment textarea with character count
- [ ] T067 [US7] Implement review submission and validation
- [ ] T068 [US7] Display reviews in GigDetailScreen reviews section
- [ ] T069 [US7] Add "Dejar reseña" flow from OrdersScreen to ReviewForm

---

## Phase 10: US8 - Switch Roles (Profile Screen)

- [ ] T070 [US8] Create src/screens/ProfileScreen.js with header and role toggle
- [ ] T071 [US8] Implement user avatar and name display
- [ ] T072 [US8] Implement membership date display
- [ ] T073 [US8] Create src/components/RoleToggle.js for Comprador/Freelancer switch
- [ ] T074 [US8] Implement buyer view with stats (Completados, Activos, Gastado)
- [ ] T075 [US8] Implement buyer view with recent orders list
- [ ] T076 [US8] Implement freelancer view with stats (Completados, Activos, Ganado)
- [ ] T077 [US8] Implement freelancer view with my gigs list
- [ ] T078 [US8] Implement "Crear Gig" button navigation
- [ ] T079 [US8] Implement settings menu (Notificaciones, Privacidad, Métodos de pago)

---

## Phase 11: Navigation & Integration

- [ ] T080 Update src/navigation/AppNavigator.js with correct screen names and stacks
- [ ] T081 Configure HomeStack (HomeScreen → GigDetailScreen)
- [ ] T082 Configure ExploreStack (ExploreScreen → GigDetailScreen)
- [ ] T083 Configure OrdersStack (OrdersScreen → OrderDetailScreen)
- [ ] T084 Configure ProfileStack (ProfileScreen → CreateGigScreen)
- [ ] T085 Implement bottom tab icons using Feather icon family
- [ ] T086 Test all navigation flows

---

## Phase 12: Polish & Cross-Cutting Concerns

- [ ] T087 Ensure all screens follow violet/amber color palette
- [ ] T088 Replace all emojis with Feather vector icons
- [ ] T089 Add loading states for all async operations
- [ ] T090 Add error handling for API calls
- [ ] T091 Ensure proper keyboard handling on input screens
- [ ] T092 Add pull-to-refresh on list screens
- [ ] T093 Test on iOS and Android for visual consistency
- [ ] T094 Run lint and fix any issues
- [ ] T095 Update README.md with new architecture

---

## Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3-10 (User Stories)
Phase 11 (Navigation) depends on Phase 3-10
Phase 12 (Polish) depends on Phase 11
```

### User Story Dependencies

| Story | Depends On | Can Parallel |
|-------|------------|--------------|
| US1 (Home) | Phase 1-2 | No (first) |
| US2 (Explore) | Phase 1-2 | Yes (with US1) |
| US3 (Gig Detail) | US1, US2 | No |
| US4 (Create Gig) | Phase 1-2 | Yes (with US1-2) |
| US5 (Orders) | Phase 1-2 | Yes (with US1-2) |
| US6 (Order Detail) | US5 | No |
| US7 (Reviews) | US3, US5 | No |
| US8 (Profile) | Phase 1-2 | Yes (with US1-2) |

---

## Parallel Execution Examples

### Batch 1 (After Phase 2)
- T018-T023 (US1 - Home Screen)
- T024-T030 (US2 - Explore Screen)
- T039-T048 (US4 - Create Gig)
- T070-T079 (US8 - Profile Screen)

### Batch 2 (After Batch 1)
- T031-T038 (US3 - Gig Detail)
- T049-T055 (US5 - Orders)
- T064-T069 (US7 - Reviews)

### Batch 3 (After Batch 2)
- T056-T063 (US6 - Order Detail)

---

## Task Count Summary

| Phase | Task Count |
|-------|------------|
| Phase 1: Setup | 8 |
| Phase 2: Foundational | 9 |
| Phase 3: US1 (Home) | 6 |
| Phase 4: US2 (Explore) | 7 |
| Phase 5: US3 (Gig Detail) | 8 |
| Phase 6: US4 (Create Gig) | 10 |
| Phase 7: US5 (Orders) | 7 |
| Phase 8: US6 (Order Detail) | 8 |
| Phase 9: US7 (Reviews) | 6 |
| Phase 10: US8 (Profile) | 10 |
| Phase 11: Navigation | 7 |
| Phase 12: Polish | 9 |
| **Total** | **95** |

---

## MVP Scope

**Recommended MVP**: Phase 1-5 (T001-T038)

This delivers:
- Clean codebase (no medical domain code)
- Home screen with categories and featured gigs
- Explore screen with search and filters
- Gig detail with packages and reviews
- Basic navigation flow

**Estimated Effort**: 38 tasks

---

## Implementation Strategy

1. **Start with Setup (Phase 1)**: Remove all medical code first
2. **Build Foundational (Phase 2)**: Create shared hooks and components
3. **Implement US1-US2 in parallel**: Home and Explore are independent
4. **Implement US4, US8 in parallel**: Create Gig and Profile are independent
5. **Sequential dependencies**: US3 needs US1/US2, US5 needs Phase 2, US6 needs US5, US7 needs US3/US5
6. **Navigation last**: Wire everything together after screens exist
7. **Polish final**: Colors, icons, loading states, error handling
