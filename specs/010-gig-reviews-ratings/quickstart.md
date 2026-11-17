# Quickstart Guide: Puntuación y Comentarios de Gigs

**Feature**: Puntuación y Comentarios de Gigs  
**Date**: 2026-07-10  
**Contracts**: [contracts/reviews-api.md](./contracts/reviews-api.md)  
**Data model**: [data-model.md](./data-model.md)

## Prerequisites

- Node.js 20+
- Backend dependencies instalados (`/backend/node_modules`)
- Frontend dependencies instalados (`/frontend/node_modules`)

## Backend Validation

### 1. Start the backend

```bash
cd /home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend
npm run dev
```

Default URL: `http://localhost:3000`.

### 2. Create a Gig and a delivered order

```bash
# Create a Gig (seller = existing freelancer id)
curl -X POST http://localhost:3000/gigs \
  -H 'Content-Type: application/json' \
  -d '{
    "nombre": "Landing page de prueba",
    "descripcion": "Landing simple",
    "vendedor": "usr_002",
    "paquetes": [
      {
        "nombre": "BASICO",
        "precio": 1000,
        "diasEntrega": 3,
        "descripcion": "Landing básica"
      }
    ]
  }'

# Save the returned gig id as GIG_ID
# Create an order for that Gig with a client
curl -X POST http://localhost:3000/pedidos \
  -H 'Content-Type: application/json' \
  -d '{
    "gig": "'$GIG_ID'",
    "cliente": "usr_001",
    "total": 1000
  }'

# Save the returned order id as ORDER_ID
# Move order to Entregado
curl -X PUT http://localhost:3000/pedidos/$ORDER_ID \
  -H 'Content-Type: application/json' \
  -d '{"estado": "Entregado"}'
```

### 3. Submit a review

```bash
curl -X POST http://localhost:3000/opiniones \
  -H 'Content-Type: application/json' \
  -d '{
    "cliente": "usr_001",
    "gig": "'$GIG_ID'",
    "pedido": "'$ORDER_ID'",
    "puntuacion": 5,
    "detalle": "Excelente trabajo, muy profesional."
  }'
```

**Expected result**: `201 Created` with the created review including `id`, `fechaCreacion`, `puntuacion` and `detalle`.

### 4. Verify the Gig shows the review summary

```bash
curl http://localhost:3000/gigs/$GIG_ID
```

**Expected result**: `rating` equals `5.0` and `reviewCount` equals `1`.

### 5. List reviews for the Gig

```bash
curl http://localhost:3000/gigs/$GIG_ID/reviews
```

**Expected result**: `200 OK` with `reviews` array containing the previously created review.

### 6. Test rejection scenarios

Try to review the same order again:

```bash
curl -X POST http://localhost:3000/opiniones \
  -H 'Content-Type: application/json' \
  -d '{
    "cliente": "usr_001",
    "gig": "'$GIG_ID'",
    "pedido": "'$ORDER_ID'",
    "puntuacion": 4,
    "detalle": "Segunda reseña"
  }'
```

**Expected result**: `409 Conflict` with message "El pedido ya tiene una reseña".

Try to review an order that is not delivered:

```bash
# Create another order, leave it in Pendiente
# ...

curl -X POST http://localhost:3000/opiniones \
  -H 'Content-Type: application/json' \
  -d '{
    "cliente": "usr_001",
    "gig": "'$GIG_ID'",
    "pedido": "'$PENDING_ORDER_ID'",
    "puntuacion": 3,
    "detalle": "Debería fallar"
  }'
```

**Expected result**: `400 Bad Request` with message about the order needing to be delivered.

## Frontend Validation (with mocks)

### 1. Start the Expo app

```bash
cd /home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/frontend
npm start
```

Open in simulator/web and log in as `usr_001` (client).

### 2. Create a delivered order via mock data (optional)

Add or update an entry in `frontend/src/services/mockData.js` under `mockOrders` with `status: 'ENTREGADO'`.

### 3. Open Order Detail

Navigate to **Orders** → select the delivered order.

**Expected UI**: a "Calificar" action should appear alongside the existing "Aprobar entrega" button. Tapping it opens a form with a 5-star selector and a multiline comment input.

### 4. Submit a review

Fill stars and comment, then confirm.

**Expected result**: the app shows a success message and the order detail reflects that it has been reviewed (e.g., button hidden or disabled).

### 5. Open Gig Detail

Navigate to the Gig that matches the reviewed order.

**Expected result**: the summary shows the new average rating and review count, and the reviews section lists the comment and rating just submitted.

## Running Automated Tests

### Backend

```bash
cd /home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio/backend
npm test
```

Expected outcomes after implementation:
- `domain/opinion.test.js` passes validation tests.
- `unit/OpinionService.test.js` passes creation, conflict and average-calculation tests.
- `contract/opinion-create.test.js` passes happy path and rejection tests.
- `integration/opinion-gig-reviews.test.js` passes end-to-end review lifecycle tests.

## Notes

- Backend data is in-memory; restart the server resets all reviews, orders and gigs.
- The frontend currently uses `USE_MOCK = true` in `apiClient.js`, so manual backend API tests and frontend UI tests are independent.
