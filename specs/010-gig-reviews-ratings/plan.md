# Implementation Plan: Puntuación y Comentarios de Gigs

**Branch**: `010-gig-reviews-ratings` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-gig-reviews-ratings/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Permitir a los clientes puntuar (1-5 estrellas) y comentar un pedido únicamente cuando esté en estado "Entregado", y exponer esas reseñas en la página del Gig para futuros compradores, incluyendo un promedio de calificación calculado dinámicamente.

## Technical Context

**Language/Version**: JavaScript (Node 20+ en backend, React Native/Expo 54 en frontend)

**Primary Dependencies**: Express 4.21.2, React Native 0.81.0 + Expo 54, React Navigation 7

**Storage**: In-memory persistence vía `Map` en cada repository

**Testing**: Jest 30.4.2 + Supertest 7.2.2 en backend; frontend sin tests configurados actualmente

**Target Platform**: Backend Linux/Node, frontend Android/iOS vía Expo

**Project Type**: Web service + mobile app

**Performance Goals**: Respuesta de API < 200 ms para lectura/escritura de reseñas en memoria; listado de reseñas paginado

**Constraints**: Persistencia en memoria reinicia al reiniciar el servidor; autenticación JWT obligatoria en rutas sensibles

**Scale/Scope**: Proyecto académico; < 1000 usuarios simulados, un solo servidor backend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | How the plan complies | Violations to justify |
|-----------|-----------------------|-----------------------|
| SRP (I) | Controllers solo traducen HTTP; Services contienen la lógica de negocio de reseñas; Repositories acceden a datos; cada componente del frontend muestra o envía reseñas. | None |
| OCP (II) | Nuevas funcionalidades de reseñas se agregan extendiendo `Opinion`, `OpinionService` y `GigService` sin modificar el flujo de pedidos. | None |
| LSP (III) | No se introducen nuevas jerarquías de herencia; se usa composición de servicios. | None |
| ISP (IV) | Repositorios mantienen interfaces pequeñas y focalizadas; controladores consumen solo métodos necesarios. | None |
| DIP (V) | Capa de negocio depende de `OpinionRepository` y `PedidoRepository` inyectados, no de implementaciones concretas. | None |
| Patterns (VI) | Repository pattern para opiniones; Strategy pattern para ordenamiento de reseñas por fecha. | None |
| Flexibility (VII) | Se serializa `toJSON()` en dominios para desacoplar representación interna de contratos externos. | None |
| Robustness (VIII) | Se validan entradas y se manejan errores con clases de error propias; frontend maneja estados de error. | None |
| Low Coupling (IX) | `OpinionService` se comunica con `PedidoService` vía inyección, no referencias directas entre controladores. | None |
| Simplicity (X) | No se agrega base de datos ni sistema de moderación avanzado; se resuelve con validaciones de negocio simples. | None |
| High Cohesion (XI) | Lógica de reseñas, cálculo de promedios y UI de reseñas agrupadas en sus respectivos módulos. | None |

## Project Structure

### Documentation (this feature)

```text
specs/010-gig-reviews-ratings/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/
│   │   └── Opinion.js           # Extensión: validaciones, pedidoId, fecha
│   ├── services/
│   │   └── OpinionService.js    # Extensión: reglas de negocio, cálculo de promedio
│   ├── repositories/
│   │   └── OpinionRepository.js # Opcional: búsquedas por pedido/gig
│   ├── controllers/
│   │   └── OpinionController.js # Extensión: manejo de errores consistente
│   └── routes/
│       └── opiniones.js         # Ya existe; ajustar auth y swagger
└── tests/
    ├── domain/opinion.test.js   # Extensión: validaciones
    ├── unit/OpinionService.test.js
    ├── unit/OpinionController.test.js
    ├── contract/opinion-create.test.js
    └── integration/opinion-gig-reviews.test.js

frontend/
├── src/
│   ├── screens/
│   │   ├── OrderDetailScreen.js   # Agregar flujo de calificación
│   │   └── GigDetailScreen.js     # Mostrar listado de reseñas
│   ├── components/
│   │   └── ReviewForm.js          # Nuevo: selector de estrellas + comentario
│   ├── hooks/
│   │   └── useReviews.js          # Nuevo: crear/traer reseñas
│   ├── services/
│   │   └── reviewService.js       # Nuevo (o mockData handlers)
│   └── services/mockData.js       # Agregar handlers de reseñas
└── tests/                         # Sin tests configurados actualmente
```

**Structure Decision**: Se utiliza la estructura existente de backend/frontend. La feature aprovecha el esqueleto de `Opinion` ya presente, extiende servicios y repositorios, y agrega componentes/hooks en el frontend. No se crean nuevos proyectos.

## Complexity Tracking

No se requieren justificaciones de violación. El diseño mantiene baja complejidad acorde a la constitución.
