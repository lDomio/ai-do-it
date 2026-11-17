# Data Model: Gig Packages

**Date**: 2026-07-10

## Entities

### Gig

Represents a service offered by a freelancer.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | string | yes | auto-generated | Unique identifier (e.g., "gig-005") |
| nombre | string | yes | — | Gig title (Spanish field name) |
| descripcion | string | yes | — | Detailed description |
| categoria | string | yes | — | Category name (e.g., "DISENO") |
| tags | string[] | yes | [] | Searchable tags (e.g., ["Logo", "Branding"]) |
| vendedor | object | yes | — | Seller reference (User object) |
| paquetes | Package[] | yes | [] | Array of 1-3 packages |
| multimedia | string[] | no | [] | Image URLs (placeholders for now) |
| calificacion | number | no | 0 | Average rating (0-5) |
| totalResenas | number | no | 0 | Review count |
| fechaCreacion | string | no | ISO date | Creation timestamp |

**Relationships**:
- Has many `Package` (1-3, embedded)
- Belongs to `User` (seller)
- Has many `Review` (referenced by gig ID)

### Package

A service tier within a Gig.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | string | yes | auto-generated | Unique identifier (e.g., "pkg-001") |
| nombre | string | yes | — | Package name (e.g., "Básico") |
| precio | number | yes | — | Price in ARS (≥ 0) |
| diasEntrega | number | yes | — | Delivery time in business days (≥ 0) |
| caracteristicas | string[] | yes | [] | List of included features (≥ 1) |

**Validation Rules**:
- `precio` >= 0 (FR-011)
- `diasEntrega` >= 0 (FR-012)
- `caracteristicas.length` >= 1 (FR-004)
- `nombre` non-empty string

**Edge Cases**:
- `precio` = 0 → Display "Gratis" label
- `diasEntrega` = 0 → Display "Entrega el mismo día"

### User

The freelancer or buyer (unchanged from existing model).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | string | yes | — | Unique identifier |
| nombre | string | yes | — | Display name |
| email | string | yes | — | Email address |
| avatar | string | no | placeholder | Profile image URL |
| rol | string | yes | "BUYER" | Role: FREELANCER, BUYER, BOTH |
| stats | object | no | {} | Aggregated stats |

## State Transitions

### Gig Status

```
DRAFT → PUBLICADO → (no transitions in this feature)
```

- **DRAFT**: Created but not yet published (default on creation)
- **PUBLICADO**: Visible to buyers

### Package Lifecycle

Packages are embedded in Gig and share its lifecycle:
- Created when gig is created
- Modified when gig is edited
- Deleted when gig is deleted

No independent package lifecycle exists.

## Mock Data Structure

The existing `mockGigs` array in `services/mockData.js` already contains packages in this format:

```javascript
{
  id: "gig-001",
  nombre: "Diseño de Logo Profesional",
  descripcion: "...",
  categoria: "DISENO",
  vendedor: { id: "user-002", nombre: "Maria", ... },
  paquetes: [
    {
      id: "pkg-001",
      nombre: "Básico",
      precio: 5000,
      diasEntrega: 5,
      caracteristicas: ["1 concepto", "3 revisiones", "Archivo PNG"]
    },
    {
      id: "pkg-002",
      nombre: "Estándar",
      precio: 12000,
      diasEntrega: 3,
      caracteristicas: ["3 conceptos", "5 revisiones", "Archivos PNG + SVG", "Mockup"]
    },
    {
      id: "pkg-003",
      nombre: "Premium",
      precio: 25000,
      diasEntrega: 2,
      caracteristicas: ["5 conceptos", "Ilimitadas revisiones", "Todos los formatos", "Mockup 3D", "Identidad visual básica"]
    }
  ],
  multimedia: ["https://placeholder.com/logo1.jpg"],
  calificacion: 4.8,
  totalResenas: 127
}
```

This structure is already used by `GigDetailScreen.js` and `GigCard.js`. No schema changes needed — the feature adds CRUD operations on this existing structure.
