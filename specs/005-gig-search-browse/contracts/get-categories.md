# API Contract: GET /categories

**Endpoint**: `GET /categories`  
**Purpose**: List all available Gig categories for filter UI

## Query Parameters

None.

## Response

### Success (200 OK)

```json
{
  "categories": [
    { "id": 1, "name": "Diseño" },
    { "id": 2, "name": "Desarrollo" },
    { "id": 3, "name": "Redacción" },
    { "id": 4, "name": "Marketing" }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| categories | array | List of all categories |
| categories[].id | number | Category unique identifier |
| categories[].name | string | Category display name |

### Error Responses

**500 Internal Server Error**:
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Behavior Notes

- Returns all categories regardless of whether they have Gigs
- Categories are ordered by ID (creation order)
- This endpoint is read-only and idempotent
