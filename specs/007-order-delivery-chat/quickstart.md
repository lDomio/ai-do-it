# Quickstart: Order Delivery Chat Validation

This guide documents runnable validation scenarios that prove the order chat feature works end-to-end. It does not contain implementation code; see `tasks.md` for implementation details.

## Prerequisites

1. Node.js 20+ installed.
2. Backend dependencies installed:
   ```bash
   cd backend && npm install
   ```
3. Frontend dependencies installed:
   ```bash
   cd frontend && npm install
   ```
4. A running backend:
   ```bash
   cd backend && npm run dev
   ```
   The API should be available at `http://localhost:3000` (or the value configured in the frontend's `ApiConfigContext`).
5. Expo CLI / mobile simulator or device for manual frontend validation.

## Scenario 1: Client sends a message and sees it in the order chat

### Steps

1. Start the backend and seed it (seed runs automatically on startup).
2. Log in as a client via the existing `/auth/login` endpoint and keep the JWT token.
3. Create or identify an existing order for that client and note its `id`.
4. Send a message:
   ```bash
   curl -X POST http://localhost:3000/pedidos/{orderId}/messages \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"content":"Hola, ¿cómo va el avance?"}'
   ```
5. List messages:
   ```bash
   curl http://localhost:3000/pedidos/{orderId}/messages \
     -H "Authorization: Bearer {token}"
   ```

### Expected outcome

- `POST` returns `201 Created` with a message object whose `senderType` is `CLIENTE`, `status` is `ENVIADO`, and `createdAt` is a valid ISO timestamp.
- `GET` returns `200 OK` with the message in the `messages` array, in chronological order.

## Scenario 2: Freelancer replies from the order chat

### Steps

1. Log in as the freelancer who owns the gig linked to the same order.
2. List messages using the freelancer's token.
3. Send a reply:
   ```bash
   curl -X POST http://localhost:3000/pedidos/{orderId}/messages \
     -H "Authorization: Bearer {freelancerToken}" \
     -H "Content-Type: application/json" \
     -d '{"content":"Te muestro avances esta tarde."}'
   ```

### Expected outcome

- The freelancer can read the client's message.
- The reply returns `201 Created` with `senderType` `FREELANCER`.
- Listing with either token shows both messages sorted by `createdAt`.

## Scenario 3: Unauthorized user cannot access the chat

### Steps

1. Log in as a third user who is neither the client nor the freelancer for the order.
2. Attempt to list messages:
   ```bash
   curl http://localhost:3000/pedidos/{orderId}/messages \
     -H "Authorization: Bearer {otherToken}"
   ```

### Expected outcome

- The endpoint returns `403 Forbidden` with an error message indicating the user is not a party to the order.

## Scenario 4: Validation rejects empty and oversized messages

### Steps

1. Authenticated as the client or freelancer, send an empty message:
   ```bash
   curl -X POST http://localhost:3000/pedidos/{orderId}/messages \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"content":""}'
   ```
2. Send a message longer than 2,000 characters.

### Expected outcome

- Empty message returns `400 Bad Request`.
- Oversized message returns `400 Bad Request`.
- No message is persisted in either case.

## Scenario 5: Terminal order is read-only

### Steps

1. Move the order to `COMPLETADO` or `CANCELADO` using the existing `PUT /pedidos/{id}` endpoint.
2. Attempt to send a message with a valid party token.

### Expected outcome

- The endpoint returns `403 Forbidden` explaining that the order is closed for new messages.
- Listing still returns the existing history with `200 OK`.

## Scenario 6: Mobile chat UI end-to-end

### Steps

1. Start the frontend with `cd frontend && npm start` and open it in two simulators/devices.
2. On device A, log in as the client who owns an active order and open the order detail screen.
3. On device B, log in as the freelancer assigned to the same order and open the same order detail screen.
4. On device A, type a message in the chat input and press send.
5. On device B, wait without pulling to refresh or leaving the screen.
6. On device B, type a reply and press send.
7. On device A, wait without pulling to refresh or leaving the screen.

### Expected outcome

- Device A shows the client's own message immediately after sending (optimistic UI).
- Within approximately 5 seconds, device B shows the client's message automatically via polling.
- Device B shows the freelancer's own reply immediately after sending.
- Within approximately 5 seconds, device A shows the freelancer's reply automatically via polling.
- Messages display on the correct side of the bubble layout (`CLIENTE`/`BUYER` on the right, `FREELANCER` on the left).
- Empty input is rejected with a disabled send button and an inline hint.
- If send fails, the message bubble shows "No se pudo enviar" with a retry option, and the text is preserved.
- Polling pauses when the order detail screen loses focus and resumes on focus to avoid unnecessary requests.

## Checklist

- [ ] Scenario 1 passes.
- [ ] Scenario 2 passes.
- [ ] Scenario 3 passes.
- [ ] Scenario 4 passes.
- [ ] Scenario 5 passes.
- [ ] Scenario 6 passes on at least one mobile target (Android/iOS).
