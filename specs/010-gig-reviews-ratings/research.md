# Research: Puntuación y Comentarios de Gigs

**Feature**: Puntuación y Comentarios de Gigs  
**Date**: 2026-07-10  
**Purpose**: Resolver decisiones técnicas y de diseño para implementar reseñas de Gigs.

## Research Topics

### 1. ¿Dónde debe vivir la regla de negocio "solo pedidos Entregados"?

**Decision**: La regla se implementa en `OpinionService`.

**Rationale**: `OpinionService` es el propietario natural de las reglas de creación de reseñas. Depende de `PedidoService` (o `PedidoRepository`) para verificar el estado del pedido antes de permitir la creación. Esto evita que el controlador o el dominio conozcan detalles del ciclo de vida del pedido, y mantiene el dominio `Opinion` enfocado en validar sus propios atributos.

**Alternatives considered**:
- Hacer la validación en `Opinion` domain: descartado porque `Opinion` no debería conocer la existencia de `Pedido` ni su estado.
- Hacer la validación en `OpinionController`: descartado porque los controladores solo deben traducir HTTP, no contener lógica de negocio (Constitución SRP).
- Hacer la validación en un middleware: descartado porque es demasiado específica de negocio y difícil de testear unitariamente.

### 2. ¿Cómo calcular y exponer el promedio de calificación de un Gig?

**Decision**: El promedio se calcula on-the-fly en `GigService` (o `OpinionService`) consultando las opiniones del gig, y se expone como campos derivados `rating` y `reviewCount` en el DTO de respuesta.

**Rationale**: Dado que la persistencia es en memoria y no hay base de datos relacional, es más simple y consistente calcular el promedio cada vez que se lee un Gig. No requiere mantener un campo sincronizado, evitando bugs de doble escritura. `Gig` domain no se modifica; el cálculo pertenece a la capa de servicio.

**Alternatives considered**:
- Almacenar `rating` y `reviewCount` en el `Gig` y actualizarlos al crear cada opinión: descartado porque introduce acoplamiento bidireccional Gig↔Opinion y riesgo de inconsistencias (duplicación de datos).
- Calcular en el frontend: descartado porque rompe la fuente única de verdad y obliga a enviar todas las opiniones al cliente.

### 3. ¿Se permite editar o eliminar reseñas?

**Decision**: No. En esta versión, una reseña se crea una única vez y no se edita ni elimina.

**Rationale**: El alcance de la feature se acota a "puntuar y comentar una vez entregado". La edición/eliminación abre cuestiones de moderación, historial y transparencia que no están en la especificación. Si surge en el futuro, se agrega como feature aparte sin tocar el diseño base (OCP).

**Alternatives considered**:
- Permitir edición dentro de un período: descartado por complejidad adicional no solicitada.
- Permitir soft-delete: descartado porque afecta el cálculo del promedio y requiere políticas de moderación.

### 4. ¿Qué formato de respuesta usar para el listado de reseñas de un Gig?

**Decision**: `GET /gigs/:id/reviews` devuelve un objeto paginado `{ reviews: [...], total, page, pageSize, totalPages }`, con cada review incluyendo el `cliente`, `puntuacion`, `detalle` y `fechaCreacion`.

**Rationale**: Es consistente con la paginación ya existente en `/gigs` y `/pedidos/mis-pedidos`. Mantiene la API predecible y permite a la app móvil cargar más reseñas bajo demanda.

**Alternatives considered**:
- Incluir reseñas embebidas dentro del objeto Gig en `GET /gigs/:id`: descartado porque aumenta el tamaño de la respuesta y complica el listado de Gigs (no todas las vistas necesitan reseñas completas).

### 5. ¿Cómo integrar la feature con el frontend que usa mocks?

**Decision**: Se agregan handlers en `mockRouteHandlers` para crear y listar reseñas, y se mantiene `USE_MOCK = true` por defecto.

**Rationale**: El frontend actual funciona completamente con mocks. Para validar la UI sin depender de un backend levantado, los mocks deben soportar las nuevas rutas. La implementación real del backend se prueba con Jest/Supertest por separado.

**Alternatives considered**:
- Cambiar `USE_MOCK` a false: descartado porque rompería todas las demos existentes y requeriría infraestructura de backend siempre activa.

## Open Questions Resolved

- Escala de puntuación: 1 a 5 enteros (como indica la especificación y el swagger actual).
- Comentario obligatorio: sí, no se permite enviar solo la puntuación.
- Identificación del autor: se muestra `cliente` (id o nombre, según contrato actual de usuario) y `fechaCreacion`.
- Estado habilitador: `Entregado` (valor real `'Entregado'` del enum `EstadoPedido`).
- Frecuencia: una reseña por pedido; no se vincula directamente a cliente+gig para evitar reseñas cruzadas si el mismo cliente compra el mismo gig varias veces.
