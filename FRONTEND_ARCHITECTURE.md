# 📐 Gym Tracker - User Flows & Component Architecture

## User Journey Map

### Journey 1: First-Time User Onboarding
```
1. Landing/Login Page
   ├─ No account? → Register
   └─ Create account (email, password, name)

2. Dashboard (Empty State)
   ├─ No exercises yet
   └─ "Add your first exercise" CTA

3. Exercise Library
   ├─ Browse master exercises
   ├─ Filter by muscle group
   └─ Add exercise to my list

4. My Exercises (First Exercise Added)
   ├─ See exercise card
   └─ Click to view detail

5. Exercise Detail Page
   ├─ See exercise info (image, muscle groups)
   ├─ Empty history section
   └─ "+ Log workout" button

6. Log First Workout
   ├─ Input date (today)
   ├─ Input sets (3 sets default)
   └─ Save

7. Exercise Detail Updated
   ├─ See chart (1 data point)
   ├─ See history (1 entry)
   └─ Feeling accomplished! 💪
```

**Time to first workout:** ~2 minutes
**Aha moment:** After saving first workout

---

### Journey 2: Returning User (Typical Session)
```
1. Dashboard
   ├─ See all exercises
   ├─ Filter by muscle group (optional)
   └─ Click exercise to log

2. Exercise Detail
   ├─ See chart (progress over time)
   ├─ See history (recent sessions)
   └─ "+ Log workout" button

3. Log Workout (Quick)
   ├─ Date pre-filled (today)
   ├─ Input sets (from last time? pre-fill future)
   ├─ Save
   └─ Return to detail

4. Dashboard
   ├─ See updated exercise card
   ├─ Last session date updated
   └─ Continue to next exercise
```

**Time per exercise:** ~1-2 minutes
**Muscle memory:** 3-4 clicks max

---

### Journey 3: Adding Multiple Exercises
```
Dashboard
  → + Add button
  → Exercise library
  → Filter by muscle (Back)
  → Add multiple (Lat Pulldown, Pull-ups, Rows)
  → Back to Dashboard
  → Start logging workouts
```

---

## Page Structure & Routes

```
/
├── /login                        (Auth)
├── /register                     (Auth)
└── /app (Protected routes)
    ├── /dashboard                (Main hub)
    ├── /exercises
    │   ├── /add                  (Select from master)
    │   └── /:id                  (Detail + history)
    │       └── /log              (Log workout)
    ├── /progress                 (Overview - future)
    └── /settings                 (User settings - future)
```

---

## Component Architecture

### Root Components

```
App.tsx
├── Layout (wrapper, nav)
│   ├── Navbar.tsx
│   ├── Sidebar.tsx (mobile only - future)
│   └── <main> {routes}
├── Router (React Router)
│   ├── ProtectedRoute (auth guard)
│   └── Routes...
└── Theme Provider (CSS variables)
```

### Layout Components

```
Layout.tsx
├── Navbar
│   ├── Logo
│   ├── User menu (future)
│   └── Settings link
└── Main content area
```

### Page Components

```
Dashboard.tsx
├── Header (My Exercises, + Add)
├── FilterButtons (All, Back, Chest, etc)
├── ExerciseGrid (or list)
│   └── ExerciseCard (repeated)
└── EmptyState (if no exercises)

ExerciseLibrary.tsx (Add Exercise)
├── Search bar
├── Filter buttons
└── ExerciseList
    └── ExerciseLibraryCard (clickable)

ExerciseDetail.tsx
├── ExerciseHeader
├── StatsCards (PR, sessions, last date)
├── ProgressChart
├── WorkoutHistory
└── LogWorkoutButton

LogWorkout.tsx
├── ExerciseName (header)
├── DatePicker
├── WorkoutForm
│   ├── SetInput (repeatable)
│   ├── Add set button
│   └── Notes textarea
└── Save/Cancel buttons
```

### Feature Components

```
ExerciseCard.tsx (dashboard list)
├── Image placeholder
├── Name + equipment
├── Muscle group tags
├── Last session + PR
└── Chevron icon

ExerciseLibraryCard.tsx (selection)
├── Image placeholder
├── Name + equipment
├── Muscle tags
└── + Add button

ProgressChart.tsx
├── SVG line chart
├── X-axis (dates)
├── Y-axis (weight)
└── Trend annotation

WorkoutHistory.tsx
├── HistoryItem (per session)
│   ├── Date
│   ├── Set details
│   └── Delete button (future)
└── Load more (pagination - future)

WorkoutForm.tsx
├── DatePicker
├── SetInputGroup (1+)
│   ├── Set number input
│   ├── Weight input
│   ├── Reps input
│   ├── Notes input
│   └── Delete button
└── Session notes textarea

FilterButtons.tsx
├── Button (all)
├── Button (back)
├── Button (chest)
└── ... (muscle groups)
```

### Utility Components

```
Button.tsx
├── Props: variant (primary, secondary), size, onClick
├── Default styling
└── Hover/active states

Input.tsx
├── Props: type, placeholder, value, onChange
├── Label (optional)
└── Error message (optional)

Card.tsx
├── Props: children, clickable
├── Border, padding, radius
└── Hover effect (if clickable)

Badge.tsx
├── Props: label, color
├── Pill style
└── Used for muscle group tags

EmptyState.tsx
├── Icon
├── Message
└── CTA button
```

### Custom Hooks

```
useAuth.ts
├── user state
├── login()
├── logout()
├── register()
└── authError

useExercises.ts
├── exercises state
├── loading state
├── getExercises()
├── getExerciseById()
├── addExercise()
└── removeExercise()

useWorkouts.ts
├── workouts state
├── loading state
├── getWorkoutHistory()
├── createWorkout()
├── deleteWorkout()
└── updateWorkout()

useFetch.ts (utility)
├── Handles API calls
├── Loading, error, data states
└── Retry logic
```

---

## Data Flow Diagram

```
         ┌──────────────────┐
         │   Auth Service   │
         │  (login/logout)  │
         └──────────┬───────┘
                    │
         ┌──────────▼──────────┐
         │    Dashboard        │
         │  (My Exercises)     │
         └─┬────────────────┬──┘
           │                │
    ┌──────▼──┐      ┌──────▼────────┐
    │  Add    │      │  Exercise     │
    │Exercise │      │  Detail       │
    └────┬────┘      └──────┬────────┘
         │                  │
    ┌────▼──────────┐       │
    │  Exercise     │       │
    │  Library      │      ┌▼─────────────┐
    │  (Master)     │      │ Log Workout  │
    └───────────────┘      └──────┬───────┘
                                  │
                    ┌─────────────▼────────────┐
                    │  Workout History Data   │
                    │  ProgressChart Data     │
                    └─────────────────────────┘
```

---

## Component State Management

### Global State (Redux/Zustand)
```
store
├── auth
│   ├── user (id, email, name)
│   ├── token
│   └── isLoading
├── exercises
│   ├── items (user's exercises)
│   ├── selected (current detail view)
│   └── loading
└── workouts
    ├── history (per exercise)
    ├── current (being edited)
    └── error
```

### Local State (useState)
- Form inputs (weight, reps, date)
- Filter selections
- Modal open/close
- UI states (loading, error)

---

## API Integration Points

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me (refresh user)
```

### Exercise Endpoints
```
GET  /api/exercises (master - public)
GET  /api/exercises/:id
GET  /api/user-exercises (user's list)
POST /api/user-exercises (add exercise)
DELETE /api/user-exercises/:id (remove)
```

### Workout Endpoints
```
GET  /api/workouts?exercise_id=xxx (history)
POST /api/workouts (create session + sets)
GET  /api/workouts/:id
PUT  /api/workouts/:id (update)
DELETE /api/workouts/:id
```

### Stats/Progress Endpoints
```
GET /api/progress/exercise/:id (chart data)
GET /api/stats (dashboard overview)
GET /api/pr/:exercise_id (personal record)
```

---

## Form Validation Rules

### Register Form
- Email: required, valid email format, unique
- Password: required, min 8 chars, complexity (future)
- Confirm: must match password
- Name: optional

### Log Workout Form
- Date: required, not future date
- Weight: required, decimal (0.5 increment), > 0
- Reps: required, integer, > 0
- Notes: optional, max 500 chars

### Add Exercise
- Just selecting from list (no validation needed)

---

## Error Handling Strategy

### API Errors
```
├── 401 Unauthorized
│   └─ Redirect to login
├── 403 Forbidden
│   └─ Show "not authorized" message
├── 404 Not Found
│   └─ Show "exercise not found" + back button
├── 500 Server Error
│   └─ Show "something went wrong" + retry button
└── Network Error
    └─ Show offline message + cached data (if available)
```

### Form Validation Errors
```
├── Show inline error below input (red border)
├── Prevent form submission
└── Clear on correction
```

---

## Performance Optimizations

1. **Code Splitting**
   - Lazy load pages (Dashboard, ExerciseDetail, etc)
   - Lazy load heavy components (ProgressChart)

2. **Data Caching**
   - Cache exercise library (master data = static)
   - Cache workout history per exercise
   - Invalidate on new workout

3. **Image Optimization**
   - Lazy load exercise images
   - Placeholder while loading
   - WebP with PNG fallback (future)

4. **Bundle Size**
   - Tree-shake unused code
   - Minify CSS/JS
   - No large libraries for charts (custom SVG or lightweight)

---

## Testing Strategy

### Unit Tests
- useAuth hook
- useExercises hook
- Validation functions

### Integration Tests
- Dashboard + ExerciseCard interaction
- Log workout form submission
- Add exercise flow

### E2E Tests (Cypress/Playwright)
1. Register new user
2. Add exercise
3. Log workout
4. View progress
5. Edit/delete workout

---

## Accessibility Checklist

- [ ] Form labels linked to inputs
- [ ] Icon buttons have aria-label
- [ ] Decorative icons have aria-hidden
- [ ] Color contrast 4.5:1 (text)
- [ ] Focus indicators visible
- [ ] Keyboard navigation (tab, enter, escape)
- [ ] Error messages aria-live (dynamic)
- [ ] Modal has aria-modal and focus trap
- [ ] Images have alt text
- [ ] Semantic HTML (button vs div, etc)

---

## Mobile-First Breakpoints

```css
/* Base: 360px (mobile) */
.exercise-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Tablet: 600px+ */
@media (min-width: 600px) {
  .exercise-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

/* Desktop: 1000px+ */
@media (min-width: 1000px) {
  .exercise-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Development Timeline (Estimated)

| Phase | Components | Time | Notes |
|-------|-----------|------|-------|
| 1 | Auth, Dashboard, Basic routes | 3-4 days | Foundation |
| 2 | Exercise detail, Log workout | 3-4 days | Core feature |
| 3 | Progress chart, History | 2-3 days | Visualization |
| 4 | Polish, mobile, dark mode | 2-3 days | Refinement |
| 5 | Testing, bug fixes | 2-3 days | Quality |

**Total MVP:** ~2 weeks

---

## File Structure (Final)

```
gym-tracker/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Badge.tsx
│   │   ├── features/
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── ExerciseLibraryCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── WorkoutHistory.tsx
│   │   │   ├── WorkoutForm.tsx
│   │   │   └── FilterButtons.tsx
│   │   └── layout/
│   │       ├── Layout.tsx
│   │       └── AuthLayout.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ExerciseLibrary.tsx
│   │   ├── ExerciseDetail.tsx
│   │   ├── LogWorkout.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useExercises.ts
│   │   ├── useWorkouts.ts
│   │   └── useFetch.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── exercises.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── exerciseStore.ts
│   │   └── workoutStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── forms.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── exercises/ (images)
│   └── ...
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

**Architecture is clean, scalable, and ready to build!** 🚀
