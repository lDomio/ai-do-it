# API Contracts: Mobile App Frontend

**Feature**: 004-mobile-app-frontend
**Date**: 2026-07-09

## Overview

This document defines the API contracts for the Sweet Medical mobile app frontend. The frontend consumes these endpoints from the existing backend.

## Base URL

```
/api/v1
```

## Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Patient Profile

**GET** `/patients/profile`

**Response**:
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

**Errors**:
- `401`: Unauthorized - invalid or missing token
- `404`: Patient not found

---

### 2. Search Appointments

**GET** `/appointments/search`

**Query Parameters**:
- `specialty` (optional): Filter by specialty (e.g., "Cardiología")
- `location` (optional): Filter by location (e.g., "Sede Centro")
- `startDate` (optional): Start date filter (ISO 8601)
- `endDate` (optional): End date filter (ISO 8601)
- `sortBy` (optional): Sort field (date, rating, cost) - default: date
- `sortOrder` (optional): asc or desc - default: asc
- `page` (optional): Page number - default: 1
- `pageSize` (optional): Items per page - default: 10

**Response**:
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

**Errors**:
- `400`: Invalid query parameters
- `401`: Unauthorized

---

### 3. Get Appointment Detail

**GET** `/appointments/:id`

**Response**:
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

**Errors**:
- `404`: Appointment not found
- `401`: Unauthorized

---

### 4. Book Appointment

**POST** `/appointments/:id/reserve`

**Request Body**:
```json
{
  "patientId": "pat_789"
}
```

**Response**:
```json
{
  "success": true,
  "appointment": {
    "id": "apt_123",
    "status": "RESERVADO",
    "patientId": "pat_789",
    "updatedAt": "2026-07-09T15:30:00Z"
  },
  "message": "Turno reservado exitosamente"
}
```

**Errors**:
- `400`: Invalid request
- `401`: Unauthorized
- `404`: Appointment not found
- `409`: Appointment already reserved (concurrent booking)
- `422`: Appointment no longer available

---

### 5. Cancel Appointment

**PUT** `/appointments/:id/cancel`

**Request Body**:
```json
{
  "reason": "No puedo asistir"
}
```

**Response**:
```json
{
  "success": true,
  "appointment": {
    "id": "apt_123",
    "status": "CANCELADO",
    "updatedAt": "2026-07-09T16:00:00Z"
  },
  "message": "Turno cancelado exitosamente"
}
```

**Errors**:
- `400`: Invalid request
- `401`: Unauthorized
- `404`: Appointment not found
- `422`: Cannot cancel with less than 1 hour notice

---

### 6. Get Patient Appointments

**GET** `/patients/appointments`

**Query Parameters**:
- `status` (optional): Filter by status (RESERVADO, CONFIRMADO, CANCELADO, REALIZADO)
- `type` (optional): active or history - default: active
- `page` (optional): Page number - default: 1
- `pageSize` (optional): Items per page - default: 10

**Response**:
```json
{
  "appointments": [
    {
      "id": "apt_123",
      "doctor": {
        "id": "doc_456",
        "name": "Dr. Martínez",
        "specialty": "Cardiología"
      },
      "specialty": "Cardiología",
      "date": "2026-07-15",
      "time": "10:00",
      "location": "Sede Centro",
      "status": "CONFIRMADO",
      "coverage": {
        "level": "PARCIAL",
        "percentage": 70
      },
      "estimatedPatientCost": 3600
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 10
}
```

**Errors**:
- `401`: Unauthorized

---

### 7. Get Chat Messages

**GET** `/appointments/:id/messages`

**Query Parameters**:
- `page` (optional): Page number - default: 1
- `pageSize` (optional): Items per page - default: 50

**Response**:
```json
{
  "messages": [
    {
      "id": "msg_001",
      "senderId": "pat_789",
      "senderType": "PATIENT",
      "content": "Hola doctor, tengo una consulta sobre mi turno",
      "timestamp": "2026-07-09T15:30:00Z",
      "read": true
    },
    {
      "id": "msg_002",
      "senderId": "doc_456",
      "senderType": "DOCTOR",
      "content": "Hola Juan, ¿en qué puedo ayudarte?",
      "timestamp": "2026-07-09T15:35:00Z",
      "read": true
    }
  ],
  "total": 2,
  "page": 1,
  "pageSize": 50
}
```

**Errors**:
- `401`: Unauthorized
- `404`: Appointment not found

---

### 8. Send Chat Message

**POST** `/appointments/:id/messages`

**Request Body**:
```json
{
  "content": "Gracias doctor, nos vemos el martes"
}
```

**Response**:
```json
{
  "success": true,
  "message": {
    "id": "msg_003",
    "senderId": "pat_789",
    "senderType": "PATIENT",
    "content": "Gracias doctor, nos vemos el martes",
    "timestamp": "2026-07-09T15:40:00Z",
    "read": false
  }
}
```

**Errors**:
- `400`: Invalid request (empty content)
- `401`: Unauthorized
- `404`: Appointment not found

---

### 9. Get Doctor Reviews

**GET** `/doctors/:id/reviews`

**Query Parameters**:
- `page` (optional): Page number - default: 1
- `pageSize` (optional): Items per page - default: 10

**Response**:
```json
{
  "reviews": [
    {
      "id": "rev_001",
      "patientName": "María G.",
      "rating": 5,
      "comment": "Excelente doctor, muy profesional",
      "createdAt": "2026-07-01T10:00:00Z"
    }
  ],
  "total": 45,
  "averageRating": 4.8,
  "page": 1,
  "pageSize": 10
}
```

**Errors**:
- `404`: Doctor not found

---

### 10. Get Specialties List

**GET** `/specialties`

**Response**:
```json
{
  "specialties": [
    {
      "id": "spec_001",
      "name": "Cardiología",
      "description": "Enfermedades del corazón"
    },
    {
      "id": "spec_002",
      "name": "Dermatología",
      "description": "Enfermedades de la piel"
    },
    {
      "id": "spec_003",
      "name": "Pediatría",
      "description": "Atención infantil"
    }
  ]
}
```

**Errors**: None (public endpoint)

---

### 11. Get Locations List

**GET** `/locations`

**Response**:
```json
{
  "locations": [
    {
      "id": "loc_001",
      "name": "Sede Centro",
      "address": "Av. Corrientes 1234, CABA"
    },
    {
      "id": "loc_002",
      "name": "Sede Norte",
      "address": "Av. Cabildo 5678, CABA"
    }
  ]
}
```

**Errors**: None (public endpoint)

---

## Error Response Format

All errors follow this format:
```json
{
  "error": {
    "code": "APPOINTMENT_NOT_FOUND",
    "message": "El turno solicitado no existe",
    "details": {}
  }
}
```

## Rate Limiting

- Search endpoints: 30 requests per minute
- Booking endpoints: 10 requests per minute
- Chat endpoints: 60 requests per minute

## Offline Behavior

When network is unavailable:
- Cached data is displayed from AsyncStorage
- User sees message "Sin conexión - mostrando datos guardados"
- Sync automatically when connection is restored
