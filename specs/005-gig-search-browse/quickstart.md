# Quickstart: Gig Search & Browse

**Date**: 2026-07-09  
**Feature**: 005-gig-search-browse

## Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:3000`
- Expo CLI installed (`npm install -g expo-cli`)
- Mobile device or emulator with Expo Go app

## Setup

```bash
# Start backend
cd backend
npm install
npm run dev

# Start frontend (in separate terminal)
cd frontend
npm install
npm start
```

## Validation Scenarios

### Scenario 1: Text Search

**Steps**:
1. Open the app and navigate to the Gigs listing screen
2. Type "logo" in the search bar
3. Wait for results to appear

**Expected Outcome**:
- Gigs containing "logo" in title or description are displayed
- Results show title, category, freelancer name, price, and rating
- Non-matching Gigs are hidden

**API Call**:
```
GET http://localhost:3000/gigs?search=logo&page=1&pageSize=10
```

**Response**:
```json
{
  "gigs": [...],
  "total": 3,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

---

### Scenario 2: Browse by Category

**Steps**:
1. Open the Gigs listing screen
2. View the category filter chips
3. Tap on "Diseño" category

**Expected Outcome**:
- Only Gigs in the "Diseño" category are shown
- Selected chip is visually highlighted
- Other categories remain visible but unselected

**API Call**:
```
GET http://localhost:3000/gigs?category=1&page=1&pageSize=10
```

---

### Scenario 3: Combined Search + Category

**Steps**:
1. Select "Diseño" category
2. Type "minimalista" in the search bar

**Expected Outcome**:
- Only Gigs in "Diseño" containing "minimalista" are shown
- Both filters are active simultaneously

**API Call**:
```
GET http://localhost:3000/gigs?search=minimalista&category=1&page=1&pageSize=10
```

---

### Scenario 4: Sort Results

**Steps**:
1. Load Gig results (with or without filters)
2. Tap sort dropdown and select "Menor precio"

**Expected Outcome**:
- Gigs are reordered with lowest price first
- Price sort indicator is shown

**API Call**:
```
GET http://localhost:3000/gigs?sortBy=price&page=1&pageSize=10
```

---

### Scenario 5: No Results

**Steps**:
1. Type a term that matches no Gigs (e.g., "xyznonexistent")

**Expected Outcome**:
- Message "No se encontraron Gigs para tu búsqueda" is displayed
- Search bar remains functional for new input

**API Call**:
```
GET http://localhost:3000/gigs?search=xyznonexistent&page=1&pageSize=10
```

---

### Scenario 6: Navigate to Gig Detail

**Steps**:
1. View search results
2. Tap on a Gig card

**Expected Outcome**:
- Navigate to Gig detail screen
- Detail shows full title, description, packages, freelancer info, and reviews

**API Call** (for detail):
```
GET http://localhost:3000/gigs/:id
```

---

### Scenario 7: Clear Filters

**Steps**:
1. Apply search and category filters
2. Clear the search bar
3. Deselect the category chip

**Expected Outcome**:
- All Gigs are displayed again
- Sort order remains as last selected

---

### Scenario 8: Pagination

**Steps**:
1. Load all Gigs (no filters)
2. Request page 1 with pageSize=2
3. Verify response has `totalPages` > 1
4. Request page 2

**Expected Outcome**:
- Page 1 returns 2 Gigs with correct total/pages metadata
- Page 2 returns next set of Gigs
- `total` is consistent across pages (represents total matching Gigs)

**API Call**:
```
GET http://localhost:3000/gigs?page=1&pageSize=2
```

**Response**:
```json
{
  "gigs": [...],
  "total": 5,
  "page": 1,
  "pageSize": 2,
  "totalPages": 3
}
```

---

## Verification Checklist

- [ ] Text search returns matching Gigs
- [ ] Category filter shows only relevant Gigs
- [ ] Combined filters work correctly
- [ ] Sort options reorder results properly
- [ ] No-results message displays correctly
- [ ] Gig detail navigation works
- [ ] Filters reset when cleared
- [ ] Error messages display on API failure
- [ ] UI is responsive on mobile devices
- [ ] Search requires minimum 3 characters
- [ ] Pagination returns correct page size and total metadata
- [ ] Page 2 returns next set of results
