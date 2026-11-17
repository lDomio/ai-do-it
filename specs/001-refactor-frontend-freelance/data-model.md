# Data Model: AI Do It Freelance Platform

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│    Gig      │────<│   Package   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Order     │────<│   Review    │
└─────────────┘     └─────────────┘
       │
       │
       ▼
┌─────────────┐
│   Message   │
└─────────────┘
```

## Entities

### User

Represents a platform user who can be a buyer, freelancer, or both.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `name` | string | Yes | Full name |
| `email` | string | Yes | Email address |
| `avatar` | string | No | Profile image URL |
| `role` | enum | Yes | BUYER, FREELANCER, BOTH |
| `stats` | object | Yes | Aggregated statistics |
| `stats.completed` | number | Yes | Completed orders count |
| `stats.active` | number | Yes | Active orders count |
| `stats.spent` | number | Yes | Total amount spent (ARS) |
| `stats.earned` | number | Yes | Total amount earned (ARS) |
| `createdAt` | date | Yes | Account creation date |

**Validation Rules**:
- Email must be valid format
- Name must be 2-100 characters
- Role must be one of: BUYER, FREELANCER, BOTH

---

### Gig

Represents a service offered by a freelancer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `title` | string | Yes | Gig title (5-100 chars) |
| `description` | string | Yes | Detailed description (20-2000 chars) |
| `category` | enum | Yes | Category enum value |
| `tags` | string[] | Yes | Searchable tags (1-10 tags) |
| `sellerId` | string | Yes | Reference to User.id |
| `packages` | Package[] | Yes | Array of 3 packages |
| `rating` | number | Yes | Average rating (0-5, 1 decimal) |
| `reviewCount` | number | Yes | Total reviews count |
| `images` | string[] | Yes | Image URLs (1-5 images) |
| `isFeatured` | boolean | Yes | Featured flag |
| `isTrending` | boolean | Yes | Trending flag |
| `createdAt` | date | Yes | Publication date |

**Categories**:
- DISENO (Diseño)
- DESARROLLO (Desarrollo)
- MARKETING (Marketing)
- REDACCION (Redacción)
- VIDEO (Video)
- DATOS (Datos)
- MUSICA (Música)
- IA (Inteligencia Artificial)

**Validation Rules**:
- Title: 5-100 characters, required
- Description: 20-2000 characters, required
- Must have exactly 3 packages (Básico, Estándar, Premium)
- Rating calculated from reviews (auto-computed)
- Images must be valid URLs

---

### Package

Represents a pricing tier within a Gig.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `name` | enum | Yes | BASICO, ESTANDAR, PREMIUM |
| `price` | number | Yes | Price in ARS (min 500) |
| `deliveryDays` | number | Yes | Delivery time in days (1-30) |
| `features` | string[] | Yes | Included features (1-10) |
| `gigId` | string | Yes | Reference to Gig.id |

**Validation Rules**:
- Price must be >= 500 ARS
- Delivery days must be 1-30
- Features must have 1-10 items
- Each gig must have all 3 package types

---

### Order

Represents a contract between buyer and seller for a gig.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `gigId` | string | Yes | Reference to Gig.id |
| `buyerId` | string | Yes | Reference to User.id |
| `sellerId` | string | Yes | Reference to User.id |
| `packageId` | string | Yes | Reference to Package.id |
| `status` | enum | Yes | Current status |
| `totalPrice` | number | Yes | Final price (ARS) |
| `createdAt` | date | Yes | Order creation date |
| `deliveryDeadline` | date | Yes | Expected delivery date |
| `deliveredAt` | date | No | Actual delivery date |
| `completedAt` | date | No | Completion date |
| `cancelledAt` | date | No | Cancellation date |
| `cancelReason` | string | No | Cancellation reason |

**Status Flow**:
```
PENDIENTE → CONFIRMADO → EN_REVISION → ENTREGADO → COMPLETADO
    │                                              
    └────────────────────────────────────────────> CANCELADO
```

**Status Descriptions**:
- `PENDIENTE`: Order created, waiting for seller confirmation
- `CONFIRMADO`: Seller accepted, work in progress
- `EN_REVISION`: Work delivered, buyer reviewing
- `ENTREGADO`: Delivery confirmed
- `COMPLETADO`: Order finalized (with review)
- `CANCELADO`: Order cancelled by buyer or seller

**Validation Rules**:
- Can only cancel if status is PENDIENTE, CONFIRMADO, or EN_REVISION
- Cannot cancel after ENTREGADO
- totalPrice must match selected package price
- deliveryDeadline must be >= createdAt + package.deliveryDays

---

### Review

Represents buyer feedback on a completed order.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `orderId` | string | Yes | Reference to Order.id |
| `gigId` | string | Yes | Reference to Gig.id |
| `buyerId` | string | Yes | Reference to User.id |
| `rating` | number | Yes | Rating 1-5 (integer) |
| `comment` | string | Yes | Written review (10-500 chars) |
| `createdAt` | date | Yes | Review date |

**Validation Rules**:
- Rating must be integer 1-5
- Comment must be 10-500 characters
- One review per order
- Order must be COMPLETADO to leave review
- Review updates gig.rating and gig.reviewCount (auto-computed)

---

### Message

Represents a chat message within an order.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID) |
| `orderId` | string | Yes | Reference to Order.id |
| `senderId` | string | Yes | Reference to User.id |
| `senderType` | enum | Yes | BUYER or FREELANCER |
| `content` | string | Yes | Message text (1-1000 chars) |
| `createdAt` | date | Yes | Message timestamp |
| `readAt` | date | No | Read timestamp |

**Validation Rules**:
- Content must be 1-1000 characters
- senderType must match senderId's role
- Message belongs to an order

---

## State Transitions

### Order Status

| From | To | Trigger |
|------|----|---------|
| PENDIENTE | CONFIRMADO | Seller accepts order |
| CONFIRMADO | EN_REVISION | Seller delivers work |
| EN_REVISION | ENTREGADO | Buyer confirms delivery |
| ENTREGADO | COMPLETADO | Buyer leaves review |
| PENDIENTE | CANCELADO | Buyer cancels |
| CONFIRMADO | CANCELADO | Buyer cancels |
| EN_REVISION | CANCELADO | Buyer cancels |

### Gig Rating

| Trigger | Effect |
|---------|--------|
| New review added | Recalculate average rating |
| Review deleted | Recalculate average rating |

---

## Mock Data Examples

### User
```json
{
  "id": "usr_001",
  "name": "Alex Rodríguez",
  "email": "alex@example.com",
  "avatar": "https://i.pravatar.cc/150?u=usr_001",
  "role": "BOTH",
  "stats": {
    "completed": 12,
    "active": 3,
    "spent": 45000,
    "earned": 180000
  },
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### Gig
```json
{
  "id": "gig_001",
  "title": "Diseño de logo profesional con identidad de marca completa",
  "description": "Creo logos únicos y memorables que reflejan la esencia de tu marca. Incluyo proceso creativo completo, revisiones ilimitadas y todos los archivos en formatos editables.",
  "category": "DISENO",
  "tags": ["logo", "branding", "identidad visual"],
  "sellerId": "usr_002",
  "packages": [
    {
      "id": "pkg_001",
      "name": "BASICO",
      "price": 5000,
      "deliveryDays": 3,
      "features": ["2 conceptos iniciales", "2 revisiones", "Archivos PNG/JPG"]
    },
    {
      "id": "pkg_002",
      "name": "ESTANDAR",
      "price": 12000,
      "deliveryDays": 5,
      "features": ["4 conceptos iniciales", "5 revisiones", "Archivos PNG/JPG/SVG", "Mockups"]
    },
    {
      "id": "pkg_003",
      "name": "PREMIUM",
      "price": 25000,
      "deliveryDays": 7,
      "features": ["6 conceptos iniciales", "Revisiones ilimitadas", "Todos los formatos", "Mockups", "Guía de marca"]
    }
  ],
  "rating": 4.9,
  "reviewCount": 342,
  "images": ["https://placehold.co/600x400/6D28D9/FFFFFF?text=Logo+1"],
  "isFeatured": true,
  "isTrending": false,
  "createdAt": "2024-06-01T00:00:00Z"
}
```

### Order
```json
{
  "id": "ord_001",
  "gigId": "gig_001",
  "buyerId": "usr_001",
  "sellerId": "usr_002",
  "packageId": "pkg_002",
  "status": "CONFIRMADO",
  "totalPrice": 12000,
  "createdAt": "2026-07-01T10:00:00Z",
  "deliveryDeadline": "2026-07-06T10:00:00Z"
}
```

### Review
```json
{
  "id": "rev_001",
  "orderId": "ord_001",
  "gigId": "gig_001",
  "buyerId": "usr_001",
  "rating": 5,
  "comment": "Excelente trabajo! El logo superó mis expectativas. Muy profesional y rápido.",
  "createdAt": "2026-07-06T15:00:00Z"
}
```

### Message
```json
{
  "id": "msg_001",
  "orderId": "ord_001",
  "senderId": "usr_001",
  "senderType": "BUYER",
  "content": "Hola! Me gustaría que el logo tenga tonos azules y violetas.",
  "createdAt": "2026-07-01T10:30:00Z"
}
```
