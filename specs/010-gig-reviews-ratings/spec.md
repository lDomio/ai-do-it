# Feature Specification: Puntuación y Comentarios de Gigs

**Feature Branch**: `[###-feature-name]`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Como cliente, quiero puntuar el Gig de forma numérica y dejar un comentario escrito una vez que esté entregado. Quiero que los comentarios realizados al finalizar un pedido se visualicen en el Gig para que otros clientes puedan conocer experiencias previas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calificar y comentar un pedido entregado (Priority: P1)

Como cliente que recibió un pedido entregado, quiero otorgar una puntuación numérica y dejar un comentario escrito sobre la experiencia, para compartir mi opinión sobre el Gig contratado.

**Why this priority**: Es el núcleo de la funcionalidad. Sin la capacidad de puntuar y comentar, no se genera la retroalimentación que otros clientes necesitan para decidirse a contratar un Gig.

**Independent Test**: Se puede probar completamente simulando un pedido entregado, accediendo a la acción de "Calificar", ingresando una puntuación y un comentario, y verificando que el sistema confirma el envío.

**Acceptance Scenarios**:

1. **Given** un cliente con al menos un pedido en estado "Entregado", **When** accede a la opción de calificar el pedido, **Then** el sistema le permite ingresar una puntuación numérica y un comentario opcional u obligatorio.
2. **Given** un cliente que ingresa una puntuación válida dentro del rango permitido, **When** confirma la calificación, **Then** el sistema guarda la reseña y muestra un mensaje de confirmación.
3. **Given** un cliente que intenta calificar un pedido que aún no fue entregado, **When** intenta acceder a la acción de calificar, **Then** el sistema impide dicha acción e informa que la calificación solo está disponible tras la entrega.

---

### User Story 2 - Visualizar reseñas en la página del Gig (Priority: P2)

Como cliente potencial, quiero ver las puntuaciones y comentarios dejados por otros clientes en un Gig, para evaluar la calidad del servicio antes de contratarlo.

**Why this priority**: Es la razón de negocio principal para recopilar reseñas: ayudar a otros clientes a tomar decisiones informadas. Depende de la existencia de reseñas, pero su interfaz de visualización es independiente.

**Independent Test**: Se puede probar mostrando una página de Gig con reseñas precargadas y verificando que se visualicen correctamente las puntuaciones, comentarios y promedio general.

**Acceptance Scenarios**:

1. **Given** un Gig que tiene al menos una reseña aprobada/publicada, **When** un cliente accede a la página del Gig, **Then** se muestran las puntuaciones, comentarios y un promedio de calificación.
2. **Given** un Gig que aún no tiene reseñas, **When** un cliente accede a la página del Gig, **Then** el sistema muestra un mensaje indicando que no hay opiniones aún, sin romper la interfaz.
3. **Given** un listado de reseñas ordenadas por fecha descendente, **When** hay más reseñas de las que caben en una sola vista, **Then** el sistema permite desplazarse o paginar para ver las opiniones anteriores.

---

### User Story 3 - Evitar reseñas duplicadas o abusivas (Priority: P3)

Como plataforma, quiero asegurarme de que cada pedido entregado genere como máximo una reseña por cliente y que no se publiquen comentarios vacíos, para mantener la confianza en el sistema de opiniones.

**Why this priority**: Garantiza la integridad de las reseñas y evita manipulación, pero no es crítica para la experiencia mínima de puntuar y visualizar.

**Independent Test**: Se puede probar intentando calificar el mismo pedido dos veces o enviando un comentario vacío, y verificando que el sistema rechaza ambos casos con mensajes claros.

**Acceptance Scenarios**:

1. **Given** un cliente que ya calificó un pedido entregado, **When** intenta calificar el mismo pedido nuevamente, **Then** el sistema impide una segunda reseña e informa que ya existe una calificación para ese pedido.
2. **Given** un cliente que intenta enviar un comentario vacío o con solo espacios, **When** confirma la calificación, **Then** el sistema rechaza el comentario y solicita que ingrese texto.
3. **Given** un cliente que deja un comentario que contiene lenguaje inapropiado, **When** se procesa la reseña, **Then** el sistema aplica la política de moderación vigente (rechazo, revisión o filtrado automático).

---

### Edge Cases

- ¿Qué ocurre si el cliente cancela la acción de calificación a mitad del flujo? El sistema no debe guardar borradores parciales a menos que se haya habilitado explícitamente dicha funcionalidad.
- ¿Cómo maneja el sistema una calificación con puntuación mínima y comentario muy largo? Debe respetar los límites establecidos de longitud.
- ¿Qué sucede si un pedido fue entregado pero el cliente nunca califica? La reseña simplemente no existe; el Gig seguirá sin mostrar opinión de ese cliente.
- ¿Cómo se actualiza el promedio de calificación del Gig cuando se agrega o elimina una reseña? El promedio debe reflejar solo las reseñas publicadas en ese momento.
- ¿Qué pasa si un pedido fue entregado y luego cancelado o disputado? Se asume que la reseña puede publicarse igual una vez entregado, salvo que exista una regla de negocio específica que la bloquee.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir a un cliente calificar un pedido únicamente cuando el pedido se encuentre en estado "Entregado".
- **FR-002**: El sistema DEBE solicitar al cliente una puntuación numérica dentro de un rango definido (por ejemplo, 1 a 5 estrellas o puntos).
- **FR-003**: El sistema DEBE permitir al cliente agregar un comentario escrito junto a la puntuación numérica.
- **FR-004**: El sistema DEBE asociar la reseña al pedido correspondiente y al Gig contratado, registrando también al cliente que la emite.
- **FR-005**: El sistema DEBE evitar que un cliente califique dos veces el mismo pedido.
- **FR-006**: El sistema DEBE mostrar en la página del Gig todas las reseñas publicadas de ese Gig, incluyendo puntuación, comentario, identificador del cliente y fecha de publicación.
- **FR-007**: El sistema DEBE calcular y mostrar un promedio de puntuación general del Gig basado en todas sus reseñas publicadas.
- **FR-008**: El sistema DEBE validar que el comentario no esté vacío ni compuesto únicamente por espacios en blanco.
- **FR-009**: El sistema DEBE rechazar calificaciones enviadas antes de que el pedido esté entregado.
- **FR-010**: El sistema DEBE notificar o mostrar un mensaje de confirmación al cliente tras publicar exitosamente la reseña.

### Key Entities *(include if feature involves data)*

- **Reseña (Review)**: Representa la opinión de un cliente sobre un Gig. Contiene la puntuación numérica, el comentario escrito, la fecha de creación y referencias al pedido, al Gig y al cliente autor.
- **Pedido (Order)**: Entrega realizada por un freelancer. Es el gatillo que habilita la posibilidad de dejar una reseña. La reseña se vincula directamente a un pedido específico.
- **Gig**: Servicio ofrecido por un freelancer. Agrupa las reseñas asociadas para mostrar su promedio de puntuación y el listado de comentarios a clientes potenciales.
- **Cliente (Client)**: Usuario que contrata el Gig y está habilitado para emitir una reseña una vez recibida la entrega.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los clientes pueden calificar un pedido entregado y publicar el comentario en menos de 60 segundos desde que acceden a la acción de calificar.
- **SC-002**: El 100% de las reseñas publicadas se muestran correctamente en la página del Gig correspondiente, incluyendo puntuación y comentario.
- **SC-003**: Al menos el 95% de los clientes que intentan calificar completan el flujo sin errores en su primer intento.
- **SC-004**: Ningún cliente puede publicar más de una reseña por pedido entregado.
- **SC-005**: El promedio de calificación del Gig se actualiza correctamente al agregar una nueva reseña, reflejando todas las opiniones publicadas en ese Gig.
- **SC-006**: Las reseñas de pedidos no entregados no son aceptadas ni publicadas, y el cliente recibe un mensaje explicativo.

## Assumptions

- La entrega del pedido queda registrada cuando el pedido pasa al estado "Entregado", lo cual ya existe como parte de otras funcionalidades del sistema.
- La reseña es anónima o semi-anónima para otros clientes; se mostrará un identificador del cliente (nombre, alias o iniciales) según la política de privacidad vigente.
- Se asume una escala de puntuación de 1 a 5, siendo 1 la calificación más baja y 5 la más alta.
- El comentario es obligatorio junto con la puntuación; no se permite calificar sin dejar un texto.
- La moderación de contenido inapropiado se realiza mediante una revisión humana o filtro básico preexistente; esta funcionalidad se limita a validaciones de negocio y no implementa un motor de moderación avanzado.
- No se permite editar ni eliminar una reseña publicada en esta versión; el cliente puede calificar una única vez y la opinión permanece publicada.
