# Quickstart: Gig Packages Validation

**Date**: 2026-07-10

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- Project dependencies installed (`npm install` in `frontend/`)

## Setup

```bash
cd frontend
npx expo start
```

Scan the QR code with Expo Go on your device, or press `i` for iOS simulator / `a` for Android emulator.

## Validation Scenarios

### Scenario 1: Create a Gig with 3 Packages

1. Navigate to **Perfil** tab
2. Switch to **Freelancer** mode using the role toggle
3. Tap **"Crear servicio"**
4. Fill in: Title = "Desarrollo de App Móvil", Description = "App completa con React Native"
5. Select category: **DESARROLLO**
6. Add tags: "React Native", "App Móvil"
7. Fill Package 1: Name = "Básico", Price = 50000, Days = 14, Features = ["UI básica", "1 pantalla", "Entregable en APK"]
8. Fill Package 2: Name = "Estándar", Price = 120000, Days = 10, Features = ["UI completa", "5 pantallas", "API integration", "Entregable en APK + código fuente"]
9. Fill Package 3: Name = "Premium", Price = 250000, Days = 7, Features = ["UI premium", "Ilimitadas pantallas", "API + Backend", "Publicación en stores", "Soporte 30 días"]
10. Tap **"Publicar"**

**Expected**: Gig is created and appears in the gig list. Navigating to the gig detail shows all 3 packages as selectable tabs.

### Scenario 2: View and Switch Package Tabs

1. Navigate to **Explorar** tab
2. Tap on any gig card
3. On the Gig Detail screen, observe the package tabs (Básico / Estándar / Premium)
4. Tap on "Estándar" tab

**Expected**: The price, delivery time, and features update to show the Estándar package details. The selected tab is visually highlighted.

### Scenario 3: Edit a Package Price

1. Navigate to **Perfil** → Freelancer mode → tap on your gig
2. Tap **"Editar"**
3. Change the Básico price from 50000 to 60000
4. Tap **"Guardar"**

**Expected**: The gig detail now shows $60,000 for the Básico package.

### Scenario 4: Delete a Package

1. Edit a gig with 3 packages
2. Delete the Premium package
3. Save

**Expected**: Only Básico and Estándar remain. The gig detail shows 2 tabs.

### Scenario 5: Validation — No Packages

1. Try to create a gig without adding any packages
2. Tap **"Publicar"**

**Expected**: Error message "Al menos un paquete es requerido" is displayed. Gig is not created.

### Scenario 6: Validation — Empty Features

1. Create a package with name and price but no features
2. Try to save

**Expected**: Error message "Cada paquete debe tener al menos una característica" is displayed.

## Key Files to Inspect

| File | What to verify |
|------|----------------|
| `src/screens/CreateGigScreen.js` | Package form renders 3 package cards; validation errors display correctly |
| `src/screens/GigDetailScreen.js` | Package tabs switch; selected tab is highlighted; price/delivery/features update |
| `src/components/PackageTabBar.js` | Tabs render from package array; onTabChange fires correctly |
| `src/components/PackageCard.js` | Displays price, delivery days, features list for a single package |
| `src/services/mockData.js` | POST /gigs handler creates gig with packages; mockGigs array updates |
| `src/services/gigService.js` | createGig() and updateGig() methods call correct endpoints |
| `src/models/gig.js` | Package class with fromJSON() method; Gig.paquetes populated correctly |
