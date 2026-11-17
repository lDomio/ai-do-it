# Feature Specification: Order Delivery Chat

**Feature Branch**: `[007-order-delivery-chat]`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Tanto como cliente, como freelancer, quiero poder enviar mensajes en cualquier momento relacionados a una entrega mediante un chat dentro del pedido."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a message inside an order (Priority: P1)

As a client or freelancer viewing an order, I want to open the order's chat and send a text message so the other party can read it in context without leaving the order page.

**Why this priority**: This is the core capability requested. It directly supports communication about a delivery and removes the need to use external channels.

**Independent Test**: A user can open an existing order, type a message in the chat panel, send it, and see it appear in the conversation history. This can be verified end-to-end without any other chat features enabled.

**Acceptance Scenarios**:

1. **Given** a client is viewing an active order, **When** the client types a message in the order chat and sends it, **Then** the message is visible in the chat history and attributed to the client.
2. **Given** a freelancer is viewing an active order, **When** the freelancer types a message in the order chat and sends it, **Then** the message is visible in the chat history and attributed to the freelancer.
3. **Given** a user sends a message, **When** the message contains only whitespace, **Then** the system prevents sending and shows a friendly error.

---

### User Story 2 - View conversation history inside an order (Priority: P2)

As a client or freelancer, I want to see all prior messages related to an order so I can understand the context before replying.

**Why this priority**: Reading history is essential for meaningful conversations and reduces duplicated questions. It depends on messages being sent, but can be tested independently by seeding messages.

**Independent Test**: A user can open an order and see a chronological list of messages exchanged between client and freelancer, including sender identity and timestamp.

**Acceptance Scenarios**:

1. **Given** an order has existing chat messages, **When** either party opens the order chat, **Then** all messages are displayed in chronological order from oldest to newest.
2. **Given** an order has no messages, **When** a user opens the order chat, **Then** the chat shows an empty state inviting the user to start the conversation.

---

### User Story 3 - Receive real-time chat updates (Priority: P3)

As a client or freelancer, I want new messages to appear promptly while I am in the order chat so I do not have to refresh the page to see replies.

**Why this priority**: Real-time updates improve the chat experience but are not required for the minimum viable feature. Messages can still be read on reload or polling.

**Independent Test**: Two users open the same order chat; when one sends a message, the other sees it appear within a few seconds without manually refreshing.

**Acceptance Scenarios**:

1. **Given** both parties have the same order chat open, **When** one party sends a message, **Then** the other party sees the new message appear automatically.

---

### Edge Cases

- What happens when a user attempts to send a message after the order is cancelled or completed? The system should either allow read-only access or clearly explain why messaging is disabled.
- How does the system handle a very long message? It should enforce a maximum message length and provide feedback before sending.
- What happens if a message fails to send due to a network disruption? The system should retry automatically or allow the user to retry manually and preserve the typed message.
- How does the system prevent users from sending messages in orders they are not a party to? Access is restricted to the client and freelancer assigned to the order.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a chat interface accessible from the order details view for both the client and the freelancer.
- **FR-002**: The system MUST allow a client or freelancer to send a text message within an order chat at any time while the order is active.
- **FR-003**: The system MUST persist every chat message so it remains available after page reloads or re-logins.
- **FR-004**: The system MUST display the full chat history for an order in chronological order to both parties.
- **FR-005**: The system MUST attribute each message to its sender and show a timestamp for when it was sent.
- **FR-006**: The system MUST validate that a message is not empty or whitespace-only before sending.
- **FR-007**: The system MUST enforce a maximum message length and reject messages that exceed it with a clear user-facing message.
- **FR-008**: The system MUST restrict chat access to the client and freelancer associated with the order; no other users may view or send messages.
- **FR-009**: The system MUST handle delivery failures gracefully, allowing the user to retry a failed message without retyping it.

### Key Entities *(include if feature involves data)*

- **Order**: The existing order to which the chat belongs. The chat is scoped to one order and visible to the order's client and freelancer.
- **Chat Message**: A single message exchanged within an order chat. Key attributes include sender identity (client or freelancer), message body, sent timestamp, and delivery status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can send a message in an order chat in under 30 seconds from opening the order details.
- **SC-002**: 95% of messages sent by either party are visible to the other party within 5 seconds under normal network conditions.
- **SC-003**: 100% of persisted messages remain available and correctly attributed when either party revisits the order chat.
- **SC-004**: Users report that they no longer need external messaging apps to discuss order deliveries, measured by a post-release survey or support ticket reduction.

## Assumptions

- Users have a stable internet connection while using the chat; offline messaging is out of scope for this feature.
- The existing order details view can accommodate a chat panel without requiring a major redesign.
- Text messages are sufficient for order-related communication; file attachments, voice messages, and video calls are out of scope.
- Notifications for new messages (push, email, or in-app badge) are out of scope for this version unless already provided by another feature.
- The existing authentication and order ownership model will be reused to enforce chat access restrictions.
