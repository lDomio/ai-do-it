# Quickstart: Place Gig Order

## Prerequisites

- Backend running on `http://localhost:3000`.
- Frontend running via Expo.
- At least one Gig with at least one package seeded in the backend.
- A customer user authenticated in the frontend or with a valid JWT for direct API tests.

## API Validation

### 1. Seed data is available

```bash
curl http://localhost:3000/gigs | head
```

Expected: a JSON array/pagination object containing gigs with `paquetes`.

### 2. Place an order

Pick a `gigId` and `paqueteId` from the previous response, then run:

```bash
curl -X POST http://localhost:3000/pedidos/reservar \
  -H "Authorization: Bearer {jwt}" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "gigId": "{gigId}",
    "paqueteId": "{paqueteId}",
    "requerimientos": "Necesito un logo minimalista en blanco y negro para usar en web y redes sociales. La marca se llama CleanTech."
  }'
```

Expected: `201 Created` with the order JSON, `estado` equal to `Pendiente`, and `total` matching the package price.

### 3. Verify validation rejects missing requirements

```bash
curl -X POST http://localhost:3000/pedidos/reservar \
  -H "Authorization: Bearer {jwt}" \
  -H "Content-Type: application/json" \
  -d '{
    "gigId": "{gigId}",
    "paqueteId": "{paqueteId}",
    "requerimientos": "corto"
  }'
```

Expected: `400 Bad Request` with a message indicating the requirements length requirement.

### 4. Verify the order appears in the customer's history

```bash
curl http://localhost:3000/pedidos/mis-pedidos \
  -H "Authorization: Bearer {jwt}"
```

Expected: the created order appears in the paginated list.

### 5. Verify the order appears for the freelancer

```bash
curl "http://localhost:3000/pedidos/gig/{gigId}" \
  -H "Authorization: Bearer {freelancer-jwt}"
```

Expected: the created order appears in the freelancer's Gig order list.

## Frontend Validation

### 1. Open a Gig detail

Navigate to any Gig card > Gig detail screen.

### 2. Select a package

Use the package tab bar to switch packages. The footer price updates accordingly.

### 3. Continue to requirements

Tap "Continuar". A requirements input view opens.

### 4. Enter requirements

Type at least 20 characters describing what the freelancer should deliver.

### 5. Review and confirm

Proceed to the confirmation view. Verify the package name, price, delivery days, and requirements are displayed.

### 6. Submit the order

Tap "Confirmar pedido". The app should show a success message and the new order should appear in the customer's Orders list.

### 7. Check validation

Repeat with fewer than 20 characters or no package selected. The app should block submission and display a clear error.

## Expected Outcomes

- Orders can be placed from a Gig detail page.
- Orders require a selected package and valid requirements.
- Placed orders are visible to both customer and freelancer within the application.
- Duplicate rapid submissions with the same `Idempotency-Key` do not create multiple orders.
