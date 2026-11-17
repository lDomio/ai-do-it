# Quickstart: AI Do It Freelance Platform

## Prerequisites

- Node.js 18+ installed
- Expo Go app on mobile device (or iOS Simulator / Android Emulator)
- Project dependencies installed

## Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Expo development server
npm start
```

## Validation Scenarios

### Scenario 1: Home Screen Loads Correctly

**Steps**:
1. Open app in Expo Go
2. Wait for home screen to load

**Expected**:
- Greeting displays "Buenos días" with user name
- Search bar visible with placeholder "Buscar servicios freelance..."
- Category chips visible (Todos, Diseño, Desarrollo, Marketing, etc.)
- "Destacados" section shows gig cards
- "Tendencia" section shows gig cards
- Bottom navigation shows 4 tabs: Inicio, Explorar, Pedidos, Perfil

---

### Scenario 2: Search and Filter Gigs

**Steps**:
1. Tap "Explorar" tab
2. Type "logo" in search bar
3. Tap "Diseño" category chip
4. Change sort to "Mejor puntuación"

**Expected**:
- Results update to show gigs matching "logo" in title
- Only design gigs appear
- Results sorted by rating (highest first)
- Result count updates

---

### Scenario 3: View Gig Details

**Steps**:
1. Tap on any gig card
2. Scroll through gig detail screen
3. Tap "Estándar" package tab
4. Tap "Contratar" button

**Expected**:
- Gig detail screen opens
- Hero image displays
- Tags visible (Logo, Branding, etc.)
- Seller info shows name and rating
- Package tabs switch correctly
- "Contratar" shows order confirmation dialog

---

### Scenario 4: Create a Gig (Freelancer)

**Steps**:
1. Tap "Perfil" tab
2. Toggle to "Freelancer" mode
3. Tap "Crear Gig"
4. Fill in title, description, category
5. Fill in package details (price, days, features)
6. Tap "Publicar"

**Expected**:
- Create Gig form opens
- All fields accept input
- Form validates required fields
- Submitting creates new gig
- Returns to profile with success message

---

### Scenario 5: View and Manage Orders

**Steps**:
1. Tap "Pedidos" tab
2. View active orders
3. Tap on an order
4. View order details
5. Tap "Cancelar" button

**Expected**:
- Orders screen shows active/historical tabs
- Active orders show status badge and progress bar
- Order detail shows stepper with current status
- Cancel shows confirmation dialog
- Confirming cancels the order

---

### Scenario 6: Chat in Order

**Steps**:
1. Open an order detail
2. Tap "Chat" tab
3. Type a message
4. Tap send

**Expected**:
- Chat tab shows message list
- Input field accepts text
- Sending adds message to list
- Messages show sender type (Vos / Seller name)

---

### Scenario 7: Leave a Review

**Steps**:
1. Open a completed order
2. Tap "Dejar reseña"
3. Select 5 stars
4. Write a comment
5. Submit

**Expected**:
- Review form opens
- Star rating selectable
- Comment field accepts text
- Submitting saves review
- Review appears in gig detail

---

### Scenario 8: Switch Roles

**Steps**:
1. Tap "Perfil" tab
2. Toggle between "Comprador" and "Freelancer"

**Expected**:
- Toggle switches instantly
- Comprador view shows: Recent orders, stats (Completados, Activos, Gastado)
- Freelancer view shows: My gigs, "Crear Gig" button, stats (Completados, Activos, Ganado)

---

## Common Issues

### App doesn't load
- Check Expo Go is connected to same network
- Verify `npm start` is running
- Check for error messages in terminal

### Icons don't display
- Ensure `@expo/vector-icons` is installed
- Check import: `import { Feather } from '@expo/vector-icons'`

### Navigation not working
- Verify React Navigation dependencies are installed
- Check screen names match in navigator

### Mock data not showing
- Verify `USE_MOCK = true` in apiClient.js
- Check mockData.js exports are correct

## Running Tests

```bash
# Run linter
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## Next Steps

After validating these scenarios, the implementation is ready for:
1. Backend integration (replace mock data with real API)
2. Image upload implementation
3. Push notifications
4. Payment processing
