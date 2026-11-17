# Research: Refactor Frontend - AI Do It

## Technical Context

| Aspect | Status | Notes |
|--------|--------|-------|
| **Framework** | Resolved | React Native + Expo SDK 54 |
| **Navigation** | Resolved | React Navigation v7 with bottom tabs |
| **Styling** | Resolved | StyleSheet.create() with centralized theme.js |
| **State Management** | Resolved | React Context API (existing pattern) |
| **Mock Data** | Resolved | In-memory persistence with mock mode |
| **Icons** | Resolved | @expo/vector-icons (Feather family) |
| **Authentication** | Resolved | Demo token simulation |
| **Backend API** | Out of Scope | Separate specification |

## Decisions

### Decision 1: Component Library

**Chosen**: Custom components + StyleSheet.create()

**Rationale**: 
- Project already has shared primitives (AppText, AppButton, AppCard, AppInput)
- Design uses custom violet/amber palette not matching Material Design
- MUI/RN Paper would conflict with existing design tokens
- Keeps bundle size minimal

**Alternatives Considered**:
- React Native Paper: Rejected - conflicts with custom color palette
- NativeBase: Rejected - too heavy, not needed
- Tamagui: Rejected - overkill for this project scope

---

### Decision 2: State Management

**Chosen**: React Context API

**Rationale**:
- Existing project uses 4 Context providers
- No complex state management needed (mock data mode)
- Keeps learning curve low
- Sufficient for the 6 screens planned

**Alternatives Considered**:
- Redux/Zustand: Rejected - unnecessary complexity for mock data app
- MobX: Rejected - overkill

---

### Decision 3: Icon System

**Chosen**: @expo/vector-icons (Feather family)

**Rationale**:
- Already bundled with Expo SDK 54
- No installation required
- Feather icons match Figma design (outlined/stroke-based)
- Consistent with design system

**Alternatives Considered**:
- Emoji-based icons: Rejected - inconsistent across devices
- Lucide React Native: Rejected - requires installation
- Custom SVG icons: Rejected - unnecessary effort

---

### Decision 4: Mock Data Strategy

**Chosen**: Centralized mockData.js with realistic Argentine freelance data

**Rationale**:
- Current mockData.js contains medical data (must replace)
- Need realistic gig titles, prices in ARS, Argentine Spanish
- Mock route handlers pattern already exists in codebase
- Enables frontend development without backend

**Alternatives Considered**:
- JSON server: Rejected - adds dependency
- Local storage only: Rejected - no API simulation
- Faker.js: Rejected - adds dependency, less control

---

### Decision 5: Navigation Architecture

**Chosen**: Bottom tabs with 4 stacks (Inicio, Explorar, Pedidos, Perfil)

**Rationale**:
- Matches Figma design exactly
- Each tab has its own stack navigator
- Allows deep linking within each feature
- Standard mobile navigation pattern

**Alternatives Considered**:
- Single stack: Rejected - poor UX for tab-based app
- Drawer navigation: Rejected - not in design
- Material bottom tabs: Rejected - custom tabs in design

---

### Decision 6: Color Palette

**Chosen**: Violet (#6D28D9) primary, Amber (#F59E0B) accent

**Rationale**:
- Directly from Figma design
- Unique brand identity
- Good contrast ratios for accessibility
- Consistent across all screens

**Alternatives Considered**:
- Material Design colors: Rejected - not unique
- Tailwind colors: Rejected - not in design

---

### Decision 7: Typography

**Chosen**: Plus Jakarta Sans (headings) + DM Sans (body)

**Rationale**:
- Specified in Figma design
- Modern, clean aesthetic
- Good readability on mobile
- Professional appearance

**Alternatives Considered**:
- System fonts: Rejected - less brand consistency
- Roboto: Rejected - too generic

---

## Best Practices Identified

### React Native + Expo

1. **Use Expo SDK 54 APIs** - Avoid deprecated APIs
2. **Keep components pure** - Functional components with hooks
3. **Memoize expensive computations** - useMemo for filtered lists
4. **Use useCallback for handlers** - Prevent unnecessary re-renders
5. **Follow React Navigation patterns** - Proper screen options

### Mobile UX

1. **Touch targets minimum 44x44** - Accessibility requirement
2. **Loading states for all async operations** - User feedback
3. **Pull-to-refresh on lists** - Standard mobile pattern
4. **Proper keyboard handling** - Avoid input遮挡
5. **Safe area handling** - Respect notch/status bar

### Code Organization

1. **Feature-oriented structure** - screens/, components/, hooks/ per feature
2. **Shared primitives** - Reusable base components
3. **Centralized theme** - Single source of truth for design tokens
4. **Custom hooks** - Encapsulate business logic
5. **Mock data separation** - Easy to swap with real API

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Expo SDK version mismatch | Medium | Check AGENTS.md for exact version |
| Mock data unrealistic | Low | Use real gig examples from Fiverr/Upwork |
| Navigation complexity | Medium | Keep stacks simple, one level deep |
| State management scope creep | Low | Stick to Context API, no external libs |
| Design inconsistency | Medium | Strict adherence to theme.js tokens |

---

## Resolved Unknowns

All NEEDS CLARIFICATION items from the Technical Context have been resolved through:

1. **Framework choice**: React Native + Expo (already in project)
2. **Styling approach**: StyleSheet.create() (existing pattern)
3. **State management**: Context API (existing pattern)
4. **Icon system**: @expo/vector-icons (bundled with Expo)
5. **Mock data strategy**: Centralized mockData.js (existing pattern)
6. **Navigation structure**: Bottom tabs + stacks (Figma design)
7. **Color palette**: Violet + Amber (Figma design)
8. **Typography**: Plus Jakarta Sans + DM Sans (Figma design)

No remaining NEEDS CLARIFICATION items.
