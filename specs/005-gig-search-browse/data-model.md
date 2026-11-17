# Data Model: Gig Search & Browse

**Date**: 2026-07-09  
**Feature**: 005-gig-search-browse

## Entities

### Gig

A service offered by a freelancer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | yes | Unique identifier |
| title | string | yes | Service title (searchable) |
| description | string | yes | Detailed service description (searchable) |
| categoryId | number | yes | Reference to Category |
| freelancerId | number | yes | Reference to User (freelancer) |
| packages | Package[] | yes | Pricing tiers (min 1) |
| averageRating | number | yes | Computed from Reviews (0–5) |
| createdAt | Date | yes | Creation timestamp (for date sorting) |

**Relationships**:
- Gig → Category (many-to-one via categoryId)
- Gig → User/Freelancer (many-to-one via freelancerId)
- Gig → Package (one-to-many, embedded array)
- Gig → Review (one-to-many, separate entity)

### Category

A classification grouping related Gigs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | yes | Unique identifier |
| name | string | yes | Category name (e.g., "Diseño", "Desarrollo") |

**Relationships**:
- Category → Gig (one-to-many via Gig.categoryId)

### Package

A pricing tier within a Gig.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | yes | Unique identifier |
| name | string | yes | Package name (e.g., "Básico", "Premium") |
| description | string | yes | What is included |
| price | number | yes | Price in USD (must be > 0) |
| deliveryDays | number | yes | Delivery time in days (must be > 0) |

**Relationships**:
- Package → Gig (many-to-one, embedded in Gig.packages)

## Validation Rules

| Entity | Rule |
|--------|------|
| Gig | title: required, 3–100 chars |
| Gig | description: required, 10–2000 chars |
| Gig | categoryId: must reference existing Category |
| Gig | freelancerId: must reference existing User with role "freelancer" |
| Gig | packages: array with at least 1 Package |
| Category | name: required, 2–50 chars, unique |
| Package | price: > 0 |
| Package | deliveryDays: > 0 |

## State Transitions

No state transitions for this feature. Gigs are static read-only entities for search/browse.

## Search & Filter Data Flow

```
Client Request
    ↓
GET /gigs?search=logo&category=1&sortBy=price
    ↓
GigController.parseQueryParams()
    ↓
GigService.searchGigs({ search, category, sortBy })
    ↓
GigRepository.findAll() → in-memory array
    ↓
Apply filters: text match → category match → sort
    ↓
Return { gigs, total, filters }
```
