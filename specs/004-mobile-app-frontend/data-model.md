# Data Model: Mobile App Frontend

**Feature**: 004-mobile-app-frontend
**Date**: 2026-07-09

## Entities

### Patient

**Description**: User with health insurance information, appointments, and profile data

**Fields**:
- `id`: String (unique identifier)
- `name`: String (patient's full name)
- `email`: String (contact email)
- `phone`: String (contact phone)
- `insuranceProvider`: String (insurance company name)
- `insurancePlan`: String (plan type: BASIC, STANDARD, PREMIUM)
- `coverageLevel`: String (TOTAL, PARCIAL, NO CUBIERTA)

**Relationships**:
- Has many Appointments
- Has one Profile

**Validation Rules**:
- Name must not be empty
- Email must be valid format
- Phone must be valid format

---

### Doctor

**Description**: Healthcare provider with specialties, availability, and ratings

**Fields**:
- `id`: String (unique identifier)
- `name`: String (doctor's full name)
- `specialty`: String (medical specialty)
- `rating`: Number (average rating 0-5)
- `reviewCount`: Number (total reviews)
- `location`: String (clinic/hospital name)

**Relationships**:
- Has many Appointments
- Has many Reviews

**Validation Rules**:
- Name must not be empty
- Specialty must be from predefined list
- Rating must be between 0 and 5

---

### Appointment

**Description**: Scheduled healthcare service with date, time, location, and status

**Fields**:
- `id`: String (unique identifier)
- `doctorId`: String (reference to Doctor)
- `patientId`: String (reference to Patient, nullable for available appointments)
- `specialty`: String (medical specialty)
- `date`: Date (appointment date)
- `time`: String (appointment time, e.g., "10:00")
- `location`: String (clinic/hospital name)
- `status`: String (DISPONIBLE, RESERVADO, CONFIRMADO, CANCELADO, REALIZADO)
- `coverage`: Object (coverage details)
- `cost`: Number (total cost)
- `estimatedPatientCost`: Number (patient's out-of-pocket cost)
- `createdAt`: Date (when appointment was created)
- `updatedAt`: Date (when appointment was last updated)

**Relationships**:
- Belongs to Doctor
- Belongs to Patient (when reserved)
- Has one Coverage

**Validation Rules**:
- Date must be in the future for available appointments
- Time must be valid format
- Status must follow valid transitions:
  - DISPONIBLE → RESERVADO
  - RESERVADO → CONFIRMADO, CANCELADO
  - CONFIRMADO → REALIZADO, CANCELADO (with 1hr notice)
  - CANCELADO → (terminal state)
  - REALIZADO → (terminal state)

**State Transitions**:
```
DISPONIBLE → RESERVADO → CONFIRMADO → REALIZADO
                    ↓           ↓
                CANCELADO   CANCELADO
```

---

### Coverage

**Description**: Insurance coverage level affecting cost calculation

**Fields**:
- `id`: String (unique identifier)
- `level`: String (TOTAL, PARCIAL, NO CUBIERTA)
- `percentage`: Number (coverage percentage 0-100)
- `description`: String (human-readable description)

**Relationships**:
- Belongs to Appointment

**Validation Rules**:
- Level must be from predefined list
- Percentage must be between 0 and 100

---

### Review

**Description**: Patient feedback for a doctor after appointment

**Fields**:
- `id`: String (unique identifier)
- `doctorId`: String (reference to Doctor)
- `patientId`: String (reference to Patient)
- `appointmentId`: String (reference to Appointment)
- `rating`: Number (1-5 stars)
- `comment`: String (optional text feedback)
- `createdAt`: Date (when review was created)

**Relationships**:
- Belongs to Doctor
- Belongs to Patient
- Belongs to Appointment

**Validation Rules**:
- Rating must be between 1 and 5
- Comment must not exceed 500 characters
- One review per appointment

---

### Message

**Description**: Chat message between patient and doctor

**Fields**:
- `id`: String (unique identifier)
- `appointmentId`: String (reference to Appointment)
- `senderId`: String (user ID of sender)
- `senderType`: String (PATIENT, DOCTOR)
- `content`: String (message text)
- `timestamp`: Date (when message was sent)
- `read`: Boolean (whether message has been read)

**Relationships**:
- Belongs to Appointment

**Validation Rules**:
- Content must not be empty
- Content must not exceed 1000 characters
- Timestamp must be valid

---

### Notification

**Description**: System messages for appointment status changes

**Fields**:
- `id`: String (unique identifier)
- `userId`: String (recipient user ID)
- `type`: String (APPOINTMENT_RESERVED, APPOINTMENT_CONFIRMED, APPOINTMENT_CANCELLED, etc.)
- `title`: String (notification title)
- `message`: String (notification body)
- `read`: Boolean (whether notification has been read)
- `createdAt`: Date (when notification was created)
- `data`: Object (optional additional data, e.g., appointmentId)

**Relationships**:
- Belongs to Patient or Doctor

**Validation Rules**:
- Title must not be empty
- Message must not be empty
- Type must be from predefined list

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Patient   │       │   Doctor    │       │   Review    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ name        │       │ name        │       │ doctorId    │
│ email       │       │ specialty   │       │ patientId   │
│ phone       │       │ rating      │       │ appointmentId│
│ insurance.. │       │ reviewCount │       │ rating      │
│ insurance.. │       │ location    │       │ comment     │
│ coverage..  │       └──────┬──────┘       │ createdAt   │
└──────┬──────┘              │              └─────────────┘
       │                     │
       │ 1:N                 │ 1:N
       ▼                     ▼
┌─────────────────────────────────────┐
│           Appointment               │
├─────────────────────────────────────┤
│ id                                  │
│ doctorId                            │
│ patientId (nullable)                │
│ specialty                           │
│ date                                │
│ time                                │
│ location                            │
│ status                              │
│ coverage (object)                   │
│ cost                                │
│ estimatedPatientCost                │
│ createdAt                           │
│ updatedAt                           │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐   ┌─────────────┐
│   Message   │   │ Notification│
├─────────────┤   ├─────────────┤
│ id          │   │ id          │
│ appointmentId│  │ userId      │
│ senderId    │   │ type        │
│ senderType  │   │ title       │
│ content     │   │ message     │
│ timestamp   │   │ read        │
│ read        │   │ createdAt   │
└─────────────┘   │ data        │
                  └─────────────┘
```

## API Response Shapes

### Appointment List Response
```json
{
  "appointments": [
    {
      "id": "apt_123",
      "doctor": {
        "id": "doc_456",
        "name": "Dr. Martínez",
        "specialty": "Cardiología",
        "rating": 4.8,
        "reviewCount": 156
      },
      "specialty": "Cardiología",
      "date": "2026-07-15",
      "time": "10:00",
      "location": "Sede Centro",
      "status": "DISPONIBLE",
      "coverage": {
        "level": "PARCIAL",
        "percentage": 70,
        "description": "Cobertura parcial - 70%"
      },
      "cost": 12000,
      "estimatedPatientCost": 3600
    }
  ],
  "total": 25,
  "page": 1,
  "pageSize": 10
}
```

### Appointment Detail Response
```json
{
  "id": "apt_123",
  "doctor": {
    "id": "doc_456",
    "name": "Dr. Martínez",
    "specialty": "Cardiología",
    "rating": 4.8,
    "reviewCount": 156,
    "location": "Sede Centro"
  },
  "specialty": "Cardiología",
  "date": "2026-07-15",
  "time": "10:00",
  "location": "Sede Centro",
  "status": "RESERVADO",
  "coverage": {
    "level": "PARCIAL",
    "percentage": 70,
    "description": "Cobertura parcial - 70%"
  },
  "cost": 12000,
  "estimatedPatientCost": 3600,
  "createdAt": "2026-07-09T15:30:00Z",
  "updatedAt": "2026-07-09T15:30:00Z"
}
```

### Patient Profile Response
```json
{
  "id": "pat_789",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 11 1234-5678",
  "insuranceProvider": "OSDE",
  "insurancePlan": "STANDARD",
  "stats": {
    "totalAppointments": 12,
    "completedAppointments": 8,
    "cancelledAppointments": 2,
    "upcomingAppointments": 2
  }
}
```
