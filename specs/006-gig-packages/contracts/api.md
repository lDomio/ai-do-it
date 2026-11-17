# API Contracts: Gig Packages

**Date**: 2026-07-10

## Overview

All endpoints are mock-only (in-memory persistence). The mock layer intercepts requests via `mockRouteHandlers` in `services/mockData.js` with a simulated 300ms delay.

---

## POST /gigs

Create a new gig with packages.

### Request

```json
{
  "nombre": "Diseño de Logo Profesional",
  "descripcion": "Creo logos únicos y modernos para tu marca",
  "categoria": "DISENO",
  "tags": ["Logo", "Branding", "Identidad Visual"],
  "paquetes": [
    {
      "nombre": "Básico",
      "precio": 5000,
      "diasEntrega": 5,
      "caracteristicas": ["1 concepto", "3 revisiones", "Archivo PNG"]
    },
    {
      "nombre": "Estándar",
      "precio": 12000,
      "diasEntrega": 3,
      "caracteristicas": ["3 conceptos", "5 revisiones", "PNG + SVG", "Mockup"]
    },
    {
      "nombre": "Premium",
      "precio": 25000,
      "diasEntrega": 2,
      "caracteristicas": ["5 conceptos", "Ilimitadas revisiones", "Todos los formatos", "Mockup 3D"]
    }
  ],
  "multimedia": []
}
```

### Response (201 Created)

```json
{
  "id": "gig-005",
  "nombre": "Diseño de Logo Profesional",
  "descripcion": "Creo logos únicos y modernos para tu marca",
  "categoria": "DISENO",
  "tags": ["Logo", "Branding", "Identidad Visual"],
  "vendedor": {
    "id": "user-001",
    "nombre": "Alex",
    "email": "alex@demo.com",
    "avatar": "https://i.pravatar.cc/150?u=alex",
    "rol": "BOTH"
  },
  "paquetes": [
    {
      "id": "pkg-005-1",
      "nombre": "Básico",
      "precio": 5000,
      "diasEntrega": 5,
      "caracteristicas": ["1 concepto", "3 revisiones", "Archivo PNG"]
    }
  ],
  "multimedia": [],
  "calificacion": 0,
  "totalResenas": 0,
  "fechaCreacion": "2026-07-10T12:00:00.000Z"
}
```

### Validation Errors (400)

```json
{
  "error": "Nombre del gig es requerido"
}
```

```json
{
  "error": "Al menos un paquete es requerido"
}
```

```json
{
  "error": "Cada paquete debe tener al menos una característica"
}
```

```json
{
  "error": "El precio del paquete debe ser un número no negativo"
}
```

---

## PUT /gigs/:id

Update an existing gig and its packages.

### Request

```json
{
  "nombre": "Diseño de Logo Profesional (Actualizado)",
  "paquetes": [
    {
      "id": "pkg-001",
      "nombre": "Básico",
      "precio": 6000,
      "diasEntrega": 5,
      "caracteristicas": ["1 concepto", "3 revisiones", "Archivo PNG"]
    }
  ]
}
```

### Response (200 OK)

Returns the updated gig object (same shape as POST response).

---

## DELETE /gigs/:id/packages/:packageId

Remove a package from a gig.

### Response (200 OK)

```json
{
  "success": true,
  "remainingPackages": 2
}
```

### Error (400)

```json
{
  "error": "No se puede eliminar: al menos un paquete es requerido"
}
```

---

## Mock Route Registration

Add to `mockRouteHandlers` in `services/mockData.js`:

```javascript
'POST /gigs': handleCreateGig,
'PUT /gigs/:id': handleUpdateGig,
'DELETE /gigs/:id/packages/:packageId': handleDeletePackage,
```
