# Data Model: Order Cancellation by Client and Admin

## Entities

### Order

Represents a commission placed by a client.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Unique order identifier |
| clientId | string | yes | Reference to the user who placed the order |
| status | enum | yes | One of: `pending`, `in_progress`, `delivered`, `cancelled` |
| cancelledBy | string | no | User id of the actor who cancelled the order |
| cancelledByRole | enum | no | One of: `client`, `admin` |
| cancelledAt | datetime | no | Timestamp when the cancellation was performed |
| createdAt | datetime | yes | Order creation timestamp |
| updatedAt | datetime | yes | Last modification timestamp |

### User

Represents an authenticated person. Defined by the existing authentication system.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Unique user identifier |
| role | enum | yes | One of: `client`, `admin`, `freelancer` (as existing) |

## Relationships

- **Order** belongs to one **User** through `clientId`.
- A **User** can have many **Orders** as a client.

## Validation Rules

1. **Status rule for cancellation**: `status` must not be `delivered`.
2. **Actor rule**: The requesting user must be the order's `clientId` or have role `admin`.
3. **Already cancelled rule**: `status` must not already be `cancelled`.
4. **Existence rule**: The order referenced by `id` must exist.
5. **Immutable after cancellation**: Once `status` is `cancelled`, the order status must not transition to any other status.

## State Transitions

```
           +-------------+     cancel by client/admin      +------------+
           |   pending   | --------------------------------> | cancelled  |
           +-------------+                                 +------------+
                  |
                  | start work
                  v
           +-------------+     cancel by client/admin      +------------+
           | in_progress | --------------------------------> | cancelled  |
           +-------------+                                 +------------+
                  |
                  | deliver
                  v
           +-------------+
           |  delivered  |  <-- cannot be cancelled
           +-------------+
```

- Allowed cancellation transitions: `pending` → `cancelled`, `in_progress` → `cancelled`.
- Forbidden cancellation transition: `delivered` → `cancelled`.
- Self-transition `cancelled` → `cancelled` is rejected.
