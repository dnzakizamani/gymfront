# 🎨 Gym Tracker - UI/UX Design System

## Design Philosophy

**Flat, Clean, Minimal** - No gradients, shadows, or decorative effects. Focus on clarity and usability for gym environment (quick interactions, easy scanning).

---

## Color System

**Primary Colors:**
- **Info/Blue** (`#378ADD`) - Primary actions, key information
- **Text Primary** - Main text, headings
- **Text Secondary** - Muted labels, hints
- **Background Primary** - White cards/surfaces
- **Background Secondary** - Subtle fills for groups
- **Border Tertiary** - Default 0.5px borders

**Semantic Colors:**
- **Success (Green)** - Completed workouts, achievements
- **Warning (Amber)** - Alerts, notifications
- **Danger (Red)** - Destructive actions, errors

Dark mode automatically adapts via CSS variables.

---

## Typography

- **Body text:** 16px, weight 400, line-height 1.7
- **Labels:** 13px, weight 400
- **Headings:**
  - h1: 22px, weight 500
  - h2: 18px, weight 500
  - h3: 16px, weight 500
- **Captions:** 12px, weight 400, secondary color

**Font:** Anthropic Sans (system default)

---

## Spacing & Corners

- **Padding:** 1rem (16px) standard card padding
- **Gaps:** 8px, 12px, 16px for component spacing
- **Border radius:** 
  - 8px (`--border-radius-md`) - inputs, small elements
  - 12px (`--border-radius-lg`) - cards, larger components

---

## Core Components

### Buttons
```
Default: transparent bg, 0.5px border-secondary, 36px height
On hover: bg-secondary
On active: scale(0.98)

Primary: info bg, info border, white text
Secondary: transparent bg, border-secondary
```

### Form Inputs
```
Height: 36px
Padding: 0 12px
Border: 0.5px solid var(--color-border-tertiary)
Border radius: 8px
Font: 14px sans-serif

On focus: info border (0.5px), no shadow
```

### Cards
```
Background: var(--color-background-primary)
Border: 0.5px solid var(--color-border-tertiary)
Border radius: 12px
Padding: 1rem 1.25rem
Cursor: pointer (when interactive)
```

### Badges/Pills
```
Background: var(--color-background-secondary)
Padding: 4px 12px
Border radius: 12px (full pill)
Font size: 12px
Color: secondary text
```

---

## Page Layouts

### 1. Login Page
**Path:** `/login`

**Components:**
- Logo + brand name
- Email input
- Password input
- Sign in button
- Create account link

**Features:**
- Centered card layout
- Form validation (client-side)
- Link to register

---

### 2. Register Page
**Path:** `/register`

**Components:**
- Form fields: email, password, confirm password, full name
- Register button
- Link back to login

**Features:**
- Password strength indicator (nice-to-have)
- Terms acceptance checkbox

---

### 3. Dashboard (Main)
**Path:** `/dashboard`

**Components:**
- Header: "My Exercises" + "Add" button
- Filter buttons: All, Back, Chest, Legs, Shoulders
- Exercise cards (grid list)
  - Exercise image/placeholder
  - Name + equipment
  - Muscle groups
  - Last session date
  - Personal record

**Features:**
- Click exercise card → detail page
- Filter by muscle group
- Search exercises (future)
- Pull-to-refresh (mobile)

**Data shown per exercise:**
```
- Name (e.g., "Lat Pulldown - Wide")
- Equipment type
- Primary + secondary muscles
- Last workout date
- Best weight × reps achieved
```

---

### 4. Add Exercise (Master Exercises)
**Path:** `/exercises/add`

**Components:**
- Search bar
- Muscle group filter buttons
- Exercise library cards
  - Exercise image
  - Name + equipment
  - Muscle tags (primary highlighted)
  - "+ Add" button

**Flow:**
1. Browse/search master exercises
2. Click "+ Add"
3. Exercise appears in user's exercise list
4. Can immediately log a workout or go back to dashboard

---

### 5. Log Workout
**Path:** `/exercises/:id/log`

**Components:**
- Back button
- Exercise name (header)
- Date picker (default: today)
- Sets section:
  - Set number (auto-filled, disabled)
  - Weight input (kg, step 0.5)
  - Reps input
  - Notes input (optional)
  - Delete button (trash icon)
- "+ Add set" button
- Session notes textarea (optional)
- Cancel / Save buttons

**Features:**
- Dynamic set creation (click "+ Add set")
- Input validation (weight/reps required)
- Pre-fill last session data (future)
- Quick repeat last workout (future)

---

### 6. Exercise Detail / History
**Path:** `/exercises/:id`

**Components:**
- Back button
- Exercise header:
  - Image
  - Name
  - Equipment
  - Muscle groups (primary + secondary)
- Stats cards:
  - Personal Record (max weight)
  - Total sessions
  - Last session date
- Weight progress chart
  - X-axis: dates
  - Y-axis: weight (kg)
  - Line graph with points
  - Trend annotation
- Workout history list:
  - Date
  - Set count
  - Set details (weight × reps)
  - (future: notes, expandable)

**Features:**
- Click any set → edit (future)
- Swipe to delete (mobile, future)
- "+ Log workout" button
- Share progress (future)

---

### 7. User Settings (Future)
**Path:** `/settings`

**Planned:**
- Profile info (name, email)
- Password change
- Units preference (kg/lbs)
- Notifications
- Data export
- Account deletion

---

## User Flows

### Flow 1: First-time user
```
Login → Dashboard (empty)
  → Click "+ Add"
  → Select exercise from library
  → Exercise added to list
  → Click exercise
  → Click "+ Log workout"
  → Fill in sets + date
  → Save
  → Back to detail page (with history)
```

### Flow 2: Regular user logging workout
```
Dashboard → Click exercise
  → History detail page
  → Click "+ Log workout"
  → Input sets
  → Save
  → Back to detail (refreshed)
```

### Flow 3: Viewing progress
```
Dashboard → Click exercise
  → See chart
  → See history
  → Spot trends
```

---

## Mobile Responsiveness

The design is mobile-first (680px assumed). Key adaptations:

### Mobile (360px - 480px)
- Single column layout
- Buttons stack vertically when needed
- Smaller exercise image (60px → 50px)
- Compact set input (grid layout maintained)
- No horizontal scrolling

### Tablet (600px - 800px)
- Same as desktop mockup
- Comfortable spacing

### Desktop (1000px+)
- Could support wider layouts
- 2-column exercises grid (future)
- Side-by-side chart + history (future)

---

## Interactive States

### Exercise Card
- **Default:** subtle border, normal text
- **Hover:** bg-secondary, pointer cursor
- **Active/Selected:** info border, highlighted

### Buttons
- **Default:** outlined style
- **Hover:** bg-secondary
- **Active:** scale(0.98)
- **Disabled:** opacity 0.5, no cursor

### Form Inputs
- **Focus:** 0.5px info border, no shadow
- **Error:** 0.5px danger border, error text below
- **Filled:** normal appearance

---

## Icons

Using Tabler Icons (outline style):
- `ti-plus` - Add
- `ti-trash` - Delete
- `ti-arrow-left` - Back
- `ti-chevron-right` - Navigate
- `ti-home` - Dashboard
- `ti-chart-bar` - Progress
- `ti-user` - Profile
- `ti-settings` - Settings
- `ti-menu-2` - Hamburger menu

Size: 16-18px for inline, 20-24px for decorative

---

## Accessibility

- Semantic HTML (forms, buttons, labels)
- Proper label associations (`<label for="...">`)
- Icon-only buttons have `aria-label`
- Decorative icons have `aria-hidden="true"`
- Color not sole means of distinction (badges, labels)
- Focus rings on all interactive elements
- Keyboard navigation (tab, enter, escape)
- Sufficient color contrast (WCAG AA)

---

## Animation Guidelines

**Keep it minimal:**
- Button scale on press: `scale(0.98)`, 100ms ease-out
- Smooth focus transitions: 200ms
- Page transitions: fade-in (if any)
- No excessive motion (respects `prefers-reduced-motion`)

---

## Loading States

- Skeleton screens for exercise list (future)
- Loading spinner for async actions
- Optimistic updates (immediate UI change, confirm via server)

---

## Error Handling

**Form Validation:**
- Required fields highlighted with danger border
- Error message below input in 12px secondary color
- Inline validation (as user types, future)

**Network Errors:**
- Toast notification (top, 4s timeout)
- Retry button
- Fallback: cached data

**404/Not Found:**
- Friendly message
- Link back to dashboard

---

## Performance Considerations

- Lazy load exercise images
- Virtual scroll for long lists (100+ exercises, future)
- Cache workout history
- Optimize SVG charts (lightweight)
- Progressive enhancement (no JS required for basic nav, future)

---

## Future Enhancements

Phase 2+:
- Workout timer/stopwatch
- Rest timer between sets
- RPE rating selector
- Workout programs/templates
- Social features (share progress)
- Advanced charts (volume, intensity, frequency)
- Export data (PDF, CSV)
- Dark mode toggle (auto via system preference for now)
- Onboarding tutorial

---

## File Structure (Frontend)

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── ExerciseCard.tsx
│   ├── WorkoutForm.tsx
│   ├── ProgressChart.tsx
│   └── ...
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── ExerciseDetail.tsx
│   ├── LogWorkout.tsx
│   └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── useExercises.ts
│   └── ...
├── styles/
│   ├── globals.css (CSS variables)
│   └── components.css
└── utils/
    ├── api.ts
    └── formatters.ts
```

---

## CSS Variables (in globals.css)

```css
:root {
  --color-background-primary: #ffffff;
  --color-background-secondary: #f5f5f5;
  --color-background-tertiary: #fafafa;
  --color-background-info: #e6f1fb;

  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-text-info: #0c447c;

  --color-border-tertiary: rgba(0, 0, 0, 0.15);
  --color-border-secondary: rgba(0, 0, 0, 0.3);
  --color-border-primary: rgba(0, 0, 0, 0.4);
  --color-border-info: #378ADD;

  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;

  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Anthropic Sans', sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background-primary: #1a1a1a;
    --color-background-secondary: #2d2d2d;
    --color-background-tertiary: #0f0f0f;
    
    --color-text-primary: #ffffff;
    --color-text-secondary: #999999;
    --color-text-tertiary: #666666;
    
    --color-border-tertiary: rgba(255, 255, 255, 0.15);
    --color-border-secondary: rgba(255, 255, 255, 0.3);
    --color-border-primary: rgba(255, 255, 255, 0.4);
  }
}
```

---

## Figma / Design Files

All mockups are created with:
- Clean, flat design
- Proper spacing (8px grid)
- Component library approach
- Light + dark mode variants
- Responsive layouts (360px, 680px, 1000px breakpoints)

Export as:
- `.png` for stakeholder review
- `.svg` for implementation reference
- Figma file for developer handoff

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 13+, Android 9+

---

**Design is production-ready!** 🚀
