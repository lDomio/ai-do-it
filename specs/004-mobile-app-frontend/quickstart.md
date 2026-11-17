# Quickstart Validation Guide: Mobile App Frontend

**Feature**: 004-mobile-app-frontend
**Date**: 2026-07-09

## Prerequisites

1. Backend server running on `http://localhost:3000`
2. Expo development server running
3. Mobile device or simulator (iOS/Android)
4. Test patient account with insurance data

## Setup Commands

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Validation Scenarios

### Scenario 1: Patient Home Dashboard

**Objective**: Verify patient can see personalized home screen with upcoming appointments

**Steps**:
1. Launch app
2. Login as patient (use demo credentials)
3. Navigate to Home screen

**Expected Outcome**:
- Personalized greeting displayed ("Buenos días, Juan")
- Upcoming appointments list shown
- Quick action buttons visible ("Buscar turnos", "Mis turnos")

**Validation Command**:
```bash
# Check if HomeScreen renders correctly
npm test -- --testNamePattern="HomeScreen"
```

---

### Scenario 2: Appointment Search

**Objective**: Patient can search for appointments by specialty and date

**Steps**:
1. Tap "Buscar turnos" from Home screen
2. Select "Cardiología" from specialty filter
3. Select date range (next 7 days)
4. Tap "Buscar" button

**Expected Outcome**:
- List of available appointments displayed
- Each appointment shows: doctor name, specialty, date, time, location
- Coverage level and estimated cost shown
- Empty state message if no results: "No se encontraron turnos disponibles"

**Validation Command**:
```bash
# Check if SearchScreen filters work
npm test -- --testNamePattern="SearchScreen"
```

---

### Scenario 3: Appointment Booking

**Objective**: Patient can book an available appointment

**Steps**:
1. Search for appointments (Scenario 2)
2. Tap on an appointment card
3. View appointment detail screen
4. Tap "Reservar" button
5. Confirm booking

**Expected Outcome**:
- Appointment detail shows doctor info, coverage, cost
- Booking confirmation dialog appears
- After confirmation: success message displayed
- Appointment appears in "Mis turnos"

**Validation Command**:
```bash
# Check if booking flow works
npm test -- --testNamePattern="AppointmentDetail"
```

---

### Scenario 4: My Appointments List

**Objective**: Patient can view their active and past appointments

**Steps**:
1. Tap "Mis turnos" from Home screen
2. View active appointments tab
3. Switch to "Historial" tab

**Expected Outcome**:
- Active appointments sorted by date
- Each appointment shows status badge (RESERVADO, CONFIRMADO, etc.)
- History shows completed/cancelled appointments
- Pagination works correctly

**Validation Command**:
```bash
# Check if appointments list renders
npm test -- --testNamePattern="MyAppointments"
```

---

### Scenario 5: Appointment Cancellation

**Objective**: Patient can cancel a confirmed appointment

**Steps**:
1. Go to "Mis turnos"
2. Select a confirmed appointment
3. Tap "Cancelar turno"
4. Enter cancellation reason
5. Confirm cancellation

**Expected Outcome**:
- Cancellation dialog with reason input
- Validation: cannot cancel with <1 hour notice
- Success message: "Tu turno fue cancelado exitosamente"
- Appointment status updates to CANCELADO

**Validation Command**:
```bash
# Check if cancellation flow works
npm test -- --testNamePattern="AppointmentCancellation"
```

---

### Scenario 6: Chat with Doctor

**Objective**: Patient can send messages to doctor through chat

**Steps**:
1. Open an appointment detail
2. Switch to "Chat" tab
3. Type a message
4. Send message

**Expected Outcome**:
- Chat interface displays conversation history
- Message appears in conversation after sending
- Timestamp shown for each message
- Loading indicator while sending

**Validation Command**:
```bash
# Check if chat interface works
npm test -- --testNamePattern="AppointmentChat"
```

---

### Scenario 7: Patient Profile

**Objective**: Patient can view their profile information

**Steps**:
1. Tap profile icon/tab
2. View profile information
3. View statistics

**Expected Outcome**:
- Name, contact info, insurance details displayed
- Stats shown: total appointments, completed, cancelled
- Recent appointments list visible

**Validation Command**:
```bash
# Check if profile screen renders
npm test -- --testNamePattern="Profile"
```

---

### Scenario 8: Offline Support

**Objective**: App works offline with cached data

**Steps**:
1. Load home screen with network
2. Turn off network connection
3. Navigate to previously loaded screens

**Expected Outcome**:
- Cached data displayed
- Message: "Sin conexión - mostrando datos guardados"
- No crashes or blank screens
- Automatic sync when network returns

**Validation Command**:
```bash
# Check offline handling
npm test -- --testNamePattern="OfflineSupport"
```

---

### Scenario 9: Error Handling

**Objective**: App handles errors gracefully

**Steps**:
1. Try to book an already reserved appointment
2. Try to cancel with <1 hour notice
3. Search with very restrictive filters

**Expected Outcome**:
- Error message: "El turno ya no se encuentra disponible"
- Error message: "No es posible cancelar un turno con menos de 1 hora de anticipación"
- Empty state: "No se encontraron turnos disponibles para los filtros seleccionados"

**Validation Command**:
```bash
# Check error handling
npm test -- --testNamePattern="ErrorHandling"
```

---

### Scenario 10: End-to-End Flow

**Objective**: Complete user journey from search to booking

**Steps**:
1. Login as patient
2. Search for Cardiología appointments
3. Select an appointment
4. Book the appointment
5. View in "Mis turnos"
6. Chat with doctor
7. Cancel appointment

**Expected Outcome**:
- All screens navigate correctly
- Data persists across screens
- Status updates propagate
- Notifications sent (backend)

**Validation Command**:
```bash
# Run E2E tests
npm run test:e2e
```

---

## Test Data

### Test Patient
```json
{
  "email": "patient@test.com",
  "password": "test123",
  "name": "Juan Pérez",
  "insurance": "OSDE STANDARD"
}
```

### Test Appointments
```json
[
  {
    "specialty": "Cardiología",
    "doctor": "Dr. Martínez",
    "date": "2026-07-15",
    "time": "10:00",
    "location": "Sede Centro",
    "coverage": "PARCIAL"
  },
  {
    "specialty": "Dermatología",
    "doctor": "Dra. López",
    "date": "2026-07-16",
    "time": "09:30",
    "location": "Sede Norte",
    "coverage": "TOTAL"
  }
]
```

## Success Criteria Validation

| Criterion | Metric | Validation Method |
|-----------|--------|-------------------|
| SC-001 | Search < 30s | Manual timing |
| SC-002 | Booking < 2min | Manual timing |
| SC-003 | Results < 2s | Network tab timing |
| SC-004 | 90% first attempt | User testing |
| SC-005 | Offline viewing | Airplane mode test |
| SC-006 | Errors < 1s | Manual timing |

## Troubleshooting

### Common Issues

1. **App crashes on startup**
   - Check Expo Go app version
   - Verify all dependencies installed
   - Clear Expo cache: `expo start -c`

2. **API calls fail**
   - Verify backend is running
   - Check API base URL in config
   - Verify authentication token

3. **Navigation not working**
   - Check React Navigation setup
   - Verify screen names match
   - Check for import errors

4. **Offline data not persisting**
   - Check AsyncStorage permissions
   - Verify cache is being written
   - Check storage quota
