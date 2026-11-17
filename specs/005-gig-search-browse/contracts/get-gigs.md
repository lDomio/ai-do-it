# API Contract: GET /gigs

**Endpoint**: `GET /gigs`  
**Purpose**: Search and browse Gigs with optional text search, category filter, and sorting

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | no | — | Text to search in title and description (min 3 chars) |
| category | number | no | — | Category ID to filter by |
| sortBy | string | no | `date` | Sort order: `price` (asc), `rating` (desc), `date` (desc) |

## Response

### Success (200 OK)

```json
{
  "gigs": [
    {
      "id": 1,
      "title": "Diseño de logo minimalista",
      "description": "Creo un logo moderno y minimalista para tu marca...",
      "category": {
        "id": 1,
        "name": "Diseño"
      },
      "freelancer": {
        "id": 10,
        "name": "María García"
      },
      "startingPrice": 25,
      "averageRating": 4.8,
      "reviewCount": 12
    }
  ],
  "total": 15,
  "filters": {
    "categories": [
      { "id": 1, "name": "Diseño", "count": 8 },
      { "id": 2, "name": "Desarrollo", "count": 5 },
      { "id": 3, "name": "Redacción", "count": 2 }
    ]
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| gigs | array | List of matching Gigs (sorted, filtered) |
| gigs[].id | number | Gig unique identifier |
| gigs[].title | string | Gig title |
| gigs[].description | string | Gig description (truncated to 200 chars in list view) |
| gigs[].category.id | number | Category ID |
| gigs[].category.name | string | Category name |
| gigs[].freelancer.id | number | Freelancer user ID |
| gigs[].freelancer.name | string | Freelancer display name |
| gigs[].startingPrice | number | Lowest package price |
| gigs[].averageRating | number | Average rating (0–5, 1 decimal) |
| gigs[].reviewCount | number | Total number of reviews |
| total | number | Total matching Gigs (before pagination) |
| filters.categories | array | Available categories with Gig counts |

### Error Responses

**400 Bad Request** — Invalid query parameters:
```json
{
  "error": "Bad Request",
  "message": "sortBy must be one of: price, rating, date"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Behavior Notes

- Text search is case-insensitive
- Minimum 3 characters required for search; shorter terms are ignored (return all Gigs)
- Category filter uses exact ID match
- Sort by `price`: ascending (cheapest first)
- Sort by `rating`: descending (highest rated first)
- Sort by `date`: descending (newest first)
- Default sort (no sortBy param): by date descending
- `startingPrice` is the minimum price across all packages in the Gig
- `reviewCount` is included for UI display but not for sorting
