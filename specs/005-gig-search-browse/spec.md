# Feature Specification: Gig Search & Browse

**Feature Branch**: `005-gig-search-browse`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Como cliente, quiero poder buscar Gigs de forma específica mediante una búsqueda textual o explorarlos por categorías."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Text Search for Gigs (Priority: P1)

As a client, I want to type keywords into a search bar and see Gigs that match my query so that I can find specific services I need.

**Why this priority**: Text search is the most direct way for clients to find services. It is the primary entry point for service discovery and delivers immediate value.

**Independent Test**: Can be fully tested by entering search terms and verifying that matching Gigs are displayed with relevant results.

**Acceptance Scenarios**:

1. **Given** a client is on the Gigs listing screen, **When** they type "logo design" in the search bar, **Then** Gigs with "logo" or "design" in their title or description are displayed
2. **Given** a client enters a search term with no matching Gigs, **When** results are loaded, **Then** they see a message "No se encontraron Gigs para tu búsqueda"
3. **Given** a client performs a search, **When** results are displayed, **Then** each Gig shows title, category, freelancer name, starting price, and average rating
4. **Given** a client has entered a search term, **When** they clear the search bar, **Then** all Gigs are displayed again (search is reset)

---

### User Story 2 - Browse Gigs by Category (Priority: P1)

As a client, I want to explore available Gigs organized by category so that I can discover services in areas of interest without knowing specific search terms.

**Why this priority**: Category browsing complements search by enabling discovery. Many clients do not know exact terms to search for and prefer to explore by topic.

**Independent Test**: Can be fully tested by viewing category list, selecting a category, and verifying that only Gigs in that category are shown.

**Acceptance Scenarios**:

1. **Given** a client is on the Gigs listing screen, **When** they view the category filter, **Then** they see all available categories
2. **Given** a client selects a category, **When** results are loaded, **Then** only Gigs belonging to that category are displayed
3. **Given** a client has selected a category, **When** they deselect it, **Then** all Gigs are shown again
4. **Given** a client selects a category with no Gigs, **When** results are loaded, **Then** they see a message "No hay Gigs en esta categoría todavía"

---

### User Story 3 - Combined Search and Category Filter (Priority: P2)

As a client, I want to combine text search with category filtering so that I can narrow results to a specific area and keyword.

**Why this priority**: Combining filters provides more precise results and improves the user experience for clients who know both the topic area and what they are looking for.

**Independent Test**: Can be fully tested by selecting a category and entering a search term simultaneously, then verifying results match both criteria.

**Acceptance Scenarios**:

1. **Given** a client selects "Diseño" category and types "minimalista", **When** results are loaded, **Then** only Gigs in the "Diseño" category containing "minimalista" are displayed
2. **Given** a client applies both filters and no Gigs match, **When** results are loaded, **Then** they see "No se encontraron Gigs con esos criterios"

---

### User Story 4 - Sort Results (Priority: P2)

As a client, I want to sort search or browse results by price, rating, or date so that I can find the best options according to my priorities.

**Why this priority**: Sorting helps clients make decisions by presenting results in the order most relevant to them.

**Independent Test**: Can be fully tested by applying sort options and verifying the order of displayed Gigs changes accordingly.

**Acceptance Scenarios**:

1. **Given** a client views Gig results, **When** they select "Menor precio", **Then** Gigs are sorted by price ascending
2. **Given** a client views Gig results, **When** they select "Mejor rating", **Then** Gigs are sorted by average rating descending
3. **Given** a client views Gig results, **When** they select "Más recientes", **Then** Gigs are sorted by creation date descending

---

### User Story 5 - View Gig Detail from Results (Priority: P2)

As a client, I want to tap on a Gig from the search or browse results to see its full details so that I can evaluate the service before ordering.

**Why this priority**: Viewing Gig details is the natural next step after discovery and is essential for the conversion funnel.

**Independent Test**: Can be fully tested by tapping a Gig card and verifying the detail screen shows complete information.

**Acceptance Scenarios**:

1. **Given** a client is viewing search results, **When** they tap on a Gig card, **Then** they navigate to the Gig detail screen
2. **Given** a client views Gig detail, **When** the screen loads, **Then** they see title, description, packages (with prices and delivery times), freelancer info, and reviews

---

### Edge Cases

- What happens when a client searches with special characters? → System ignores special characters and searches the alphanumeric content
- What happens when a client searches with very short terms (1–2 characters)? → System requires at least 3 characters to trigger search; otherwise shows all Gigs
- What happens when the category list is empty? → The category filter section shows "No hay categorías disponibles"
- What happens when network connection is lost during search? → System shows "No se pudieron cargar los resultados. Intentá de nuevo." with a retry option
- What happens when a client rapidly changes sort order? → System displays results for the most recently selected sort option (debounced)
- What happens when a Gig is updated while the client is browsing? → Results reflect the data at the time of the query; no real-time updates required for v1

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a search input field on the Gigs listing screen
- **FR-002**: System MUST perform text search matching against Gig title and description fields
- **FR-003**: System MUST require a minimum of 3 characters to trigger text search
- **FR-004**: System MUST display all available categories as filter options
- **FR-005**: System MUST allow clients to select and deselect categories to filter Gigs
- **FR-006**: System MUST support combining text search with category filter simultaneously
- **FR-007**: System MUST provide sort options: price (ascending), rating (descending), and date (descending)
- **FR-008**: System MUST display search results with Gig title, category, freelancer name, starting price, and average rating
- **FR-009**: System MUST show an informative message when no results match the criteria
- **FR-010**: System MUST allow clients to navigate to Gig detail from search or browse results
- **FR-011**: System MUST reset filters when the client clears the search bar or deselects all categories
- **FR-012**: System MUST handle errors gracefully and show user-friendly messages with retry options

### Key Entities

- **Gig**: A service offered by a freelancer, with title, description, category, packages, and average rating
- **Category**: A classification grouping related Gigs (e.g., Diseño, Desarrollo, Redacción)
- **Package**: A pricing tier within a Gig, with name, price, and delivery time
- **Freelancer**: A user who offers Gigs and delivers services

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clients can find a relevant Gig within 30 seconds of starting a search
- **SC-002**: 90% of text searches return at least one result for common service terms
- **SC-003**: Search and filter results are displayed in under 2 seconds
- **SC-004**: 85% of clients who browse by category proceed to view a Gig detail
- **SC-005**: Combined search and category filter reduces result set by at least 50% compared to single filter
- **SC-006**: Error messages are displayed within 1 second when operations fail

## Assumptions

- The backend API endpoints `GET /gigs` with `search`, `category`, and `sortBy` query parameters are available and functional
- Categories are pre-populated in the system and managed separately
- Gig data includes title, description, category, packages, freelancer name, price, and rating
- Clients are authenticated users with the "cliente" role
- Text search is case-insensitive
- Default sort order (when no sort is selected) is by date descending (most recent first)
- The feature targets mobile (React Native) as the primary client interface
- No real-time search suggestions or autocomplete are required for v1
