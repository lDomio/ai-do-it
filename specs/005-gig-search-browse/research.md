# Research: Gig Search & Browse

**Date**: 2026-07-09  
**Feature**: 005-gig-search-browse

## Research Tasks

### R1: In-Memory Text Search Implementation

**Question**: How to implement efficient text search across Gig title and description fields in an in-memory array?

**Decision**: Use JavaScript `Array.filter()` with `String.toLowerCase()` and `String.includes()` for case-insensitive substring matching.

**Rationale**: 
- In-memory storage means no database query optimization needed
- `includes()` is O(n) per string but sufficient for small datasets (demo app)
- Case-insensitive matching via `.toLowerCase()` covers common search patterns
- Minimum 3-character threshold prevents overly broad matches

**Alternatives Considered**:
- Regex matching: More powerful but overkill for substring search; introduces complexity
- Full-text search library (e.g., Lunr): Unnecessary dependency for in-memory demo
- Trie data structure: Optimized for prefix search but adds complexity without clear benefit

---

### R2: React Native Search UI Pattern

**Question**: What is the best React Native pattern for a search input with real-time filtering?

**Decision**: Use a controlled `TextInput` with `onChangeText` handler that debounces search execution (300ms delay).

**Rationale**:
- Controlled input keeps state in sync with UI
- Debouncing prevents excessive re-renders during rapid typing
- 300ms is standard debounce interval for search UX
- Pattern aligns with React Native best practices for controlled components

**Alternatives Considered**:
- Uncontrolled input with `onSubmitEditing`: Delays search until submit; poor UX for browsing
- Real-time search on every keystroke: Too many re-renders; wasteful for small datasets
- Search on button tap: Adds extra step; reduces discovery experience

---

### R3: Category Filter UI Pattern

**Question**: How should category filters be presented in a React Native mobile interface?

**Decision**: Use horizontal scrollable chip/tag list (similar to Material Design filter chips).

**Rationale**:
- Chips are a standard mobile pattern for multi-select filters
- Horizontal scroll handles overflow when many categories exist
- Visual feedback (filled/outlined state) clearly shows active filters
- Touch-friendly target size (≥44pt) meets accessibility requirements

**Alternatives Considered**:
- Dropdown picker: Hides available options; requires tap to open
- Full-screen category list: Interrupts browsing flow; heavy UX
- Checkbox list: Takes too much vertical space on mobile

---

### R4: Sort Strategy Pattern

**Question**: How to implement multiple sort options following the Strategy pattern (constitution VI)?

**Decision**: Create a `SortStrategy` interface with concrete implementations: `PriceSort`, `RatingSort`, `DateSort`.

**Rationale**:
- Strategy pattern allows adding new sort options without modifying existing code (OCP)
- Each strategy encapsulates its comparison logic independently
- Client (GigService) delegates to the selected strategy
- Easy to test each strategy in isolation

**Alternatives Considered**:
- Switch/case in service method: Violates OCP; requires modification for new sorts
- Sort function map: Simpler but less extensible; harder to test individually
- Lodash `_.sortBy`: External dependency; less control over comparison logic

---

### R5: API Response Format for Search Results

**Question**: What format should the `GET /gigs` response use to support search, filter, and sort?

**Decision**: Return `{ gigs: [...], total: number, filters: { categories: [...] } }`.

**Rationale**:
- `gigs` array contains filtered/sorted results with essential fields only
- `total` count enables pagination in future (not required for v1)
- `filters.categories` provides available categories for UI rendering
- Single endpoint handles all combinations (search + category + sort)

**Alternatives Considered**:
- Separate endpoints for search vs. browse: Adds complexity; duplicates logic
- Return full Gig objects: Wasteful; includes unnecessary package/detail data
- Omitted filters in response: Forces extra API call to get category list

---

## Summary of Decisions

| Topic | Decision | Pattern/Approach |
|-------|----------|------------------|
| Text search | `Array.filter()` + `includes()` | Case-insensitive substring match |
| Search UI | Controlled `TextInput` + debounce | 300ms debounce interval |
| Category filter | Horizontal scrollable chips | Material Design filter chips |
| Sort strategy | Strategy pattern | `PriceSort`, `RatingSort`, `DateSort` |
| API response | `{ gigs, total, filters }` | Single endpoint, combined query params |
