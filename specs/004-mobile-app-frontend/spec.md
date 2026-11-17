# Feature Specification: Mobile App Frontend

**Feature Branch**: `004-mobile-app-frontend`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Implement the mobile app frontend in React Native based on the Figma design for the Sweet Medical health insurance platform"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Patient Home Dashboard (Priority: P1)

As a patient, I want to see a personalized home screen with my upcoming appointments, quick actions, and relevant health information so that I can quickly access the most important features.

**Why this priority**: The home screen is the primary entry point and provides immediate value by showing upcoming appointments and quick access to key features.

**Independent Test**: Can be fully tested by logging in as a patient and verifying the home screen displays greeting, upcoming appointments, and navigation to other features.

**Acceptance Scenarios**:

1. **Given** a patient is logged in, **When** they view the home screen, **Then** they see a personalized greeting with their name
2. **Given** a patient has upcoming appointments, **When** they view the home screen, **Then** they see a list of upcoming appointments with date, time, and doctor name
3. **Given** a patient is on the home screen, **When** they tap on "Buscar turnos", **Then** they navigate to the appointment search screen
4. **Given** a patient is on the home screen, **When** they tap on "Mis turnos", **Then** they navigate to their appointments list

---

### User Story 2 - Appointment Search (Priority: P1)

As a patient, I want to search for available appointments by specialty, date, and location so that I can find and book appointments that fit my needs.

**Why this priority**: Appointment search is a core functionality that directly enables the primary value proposition of the platform.

**Independent Test**: Can be fully tested by searching for appointments with various filters and verifying results are displayed correctly.

**Acceptance Scenarios**:

1. **Given** a patient is on the search screen, **When** they select a specialty filter, **Then** only appointments for that specialty are shown
2. **Given** a patient is on the search screen, **When** they select a date range, **Then** only appointments within that range are shown
3. **Given** a patient is on the search screen, **When** they search with no results, **Then** they see a friendly message "No se encontraron turnos disponibles"
4. **Given** a patient finds an appointment, **When** they view the appointment details, **Then** they see coverage level (TOTAL/PARCIAL/NO CUBIERTA) and estimated cost

---

### User Story 3 - Appointment Detail and Booking (Priority: P1)

As a patient, I want to view detailed information about an appointment and book it so that I can secure my healthcare appointment.

**Why this priority**: Booking is the conversion point that completes the core user journey.

**Independent Test**: Can be fully tested by viewing an appointment detail and completing the booking flow.

**Acceptance Scenarios**:

1. **Given** a patient views an appointment detail, **When** they see the doctor information, **Then** they see name, specialty, rating, and reviews
2. **Given** a patient views an appointment detail, **When** they see coverage options, **Then** they see different coverage levels with associated costs
3. **Given** a patient wants to book an appointment, **When** they tap "Reservar", **Then** the system validates availability and confirms the booking
4. **Given** a patient books an appointment, **When** the booking is confirmed, **Then** they see a success message and the appointment appears in "Mis turnos"

---

### User Story 4 - My Appointments List (Priority: P2)

As a patient, I want to view all my appointments (active and past) so that I can track my healthcare activities.

**Why this priority**: Appointment management is important for patient engagement and follow-up.

**Independent Test**: Can be fully tested by viewing the appointments list and verifying all appointments are displayed with correct status.

**Acceptance Scenarios**:

1. **Given** a patient is on "Mis turnos", **When** they view the list, **Then** they see active appointments sorted by date
2. **Given** a patient has past appointments, **When** they switch to "Historial", **Then** they see completed/cancelled appointments
3. **Given** a patient has an appointment, **When** they view the appointment card, **Then** they see status (DISPONIBLE/RESERVADO/CONFIRMADO/CANCELADO)
4. **Given** a patient has a confirmed appointment, **When** they want to cancel, **Then** they can cancel with at least 1 hour notice

---

### User Story 5 - Appointment Detail with Chat (Priority: P2)

As a patient, I want to view appointment details and communicate with the doctor through a chat interface so that I can get clarification before my appointment.

**Why this priority**: Communication feature enhances the patient experience and reduces no-shows.

**Independent Test**: Can be fully tested by opening an appointment detail and sending a message through the chat.

**Acceptance Scenarios**:

1. **Given** a patient views an appointment detail, **When** they switch to "Chat" tab, **Then** they see the chat interface
2. **Given** a patient is in the chat, **When** they send a message, **Then** the message appears in the conversation
3. **Given** a patient views appointment status, **When** they see the stepper, **Then** they see the current status (RESERVADO → CONFIRMADO → REALIZADO)

---

### User Story 6 - Patient Profile (Priority: P3)

As a patient, I want to view and manage my profile information so that I can keep my health data up to date.

**Why this priority**: Profile management is important but not critical for initial booking flow.

**Independent Test**: Can be fully tested by viewing the profile screen and verifying patient information is displayed.

**Acceptance Scenarios**:

1. **Given** a patient is on the profile screen, **When** they view their information, **Then** they see their name, contact info, and insurance details
2. **Given** a patient is on the profile screen, **When** they view stats, **Then** they see total appointments, completed appointments, and cancelled appointments
3. **Given** a patient is on the profile screen, **When** they tap "Mis turnos recientes", **Then** they see their recent appointments

---

### Edge Cases

- What happens when a patient tries to book an appointment that was just booked by another patient? → System shows "El turno ya no se encuentra disponible"
- What happens when a patient tries to cancel an appointment with less than 1 hour notice? → System shows "No es posible cancelar un turno con menos de 1 hora de anticipación"
- What happens when a patient searches with very restrictive filters? → System shows "No se encontraron turnos disponibles para los filtros seleccionados"
- What happens when a patient has no insurance plan? → All appointments show as "NO CUBIERTA" with full cost
- What happens when the network connection is lost? → System shows appropriate error message and allows retry

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a personalized home screen with patient greeting and upcoming appointments
- **FR-002**: System MUST allow patients to search appointments by specialty, date, and location
- **FR-003**: System MUST display appointment details with doctor info, coverage level, and cost
- **FR-004**: System MUST allow patients to book available appointments
- **FR-005**: System MUST display a list of patient's active and past appointments
- **FR-006**: System MUST allow patients to cancel appointments with at least 1 hour notice
- **FR-007**: System MUST provide a chat interface for patient-doctor communication
- **FR-008**: System MUST display patient profile with stats and recent appointments
- **FR-009**: System MUST show coverage levels (TOTAL/PARCIAL/NO CUBIERTA) for each appointment
- **FR-010**: System MUST handle network errors gracefully with user-friendly messages
- **FR-011**: System MUST validate all user inputs before processing
- **FR-012**: System MUST persist appointment state changes in the backend

### Key Entities

- **Patient**: User with health insurance information, appointments, and profile data
- **Doctor**: Healthcare provider with specialties, availability, and ratings
- **Appointment**: Scheduled healthcare service with date, time, location, and status
- **Coverage**: Insurance coverage level affecting cost calculation
- **Notification**: System messages for appointment status changes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Patients can complete appointment search in under 30 seconds
- **SC-002**: Patients can book an appointment in under 2 minutes
- **SC-003**: 95% of appointment searches return results within 2 seconds
- **SC-004**: 90% of patients successfully complete booking on first attempt
- **SC-005**: App supports offline viewing of previously loaded appointments
- **SC-006**: Error messages are displayed in under 1 second when operations fail

## Assumptions

- Patients have stable internet connectivity for real-time features
- Backend API endpoints are available and functional
- Authentication system is already implemented and working
- Patient insurance data is pre-populated in the system
- Doctor availability data is maintained by the backend
- Mobile app follows the existing project setup and architecture
- Design follows the Figma specifications with the defined color scheme and typography
