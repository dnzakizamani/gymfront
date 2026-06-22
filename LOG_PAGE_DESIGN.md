# 📅 Log Page - Design Documentation

## Overview

The Log page is a calendar-based workout logging interface that allows users to view their workout history by date and quickly see which days have logged workouts. It features a monthly calendar with visual indicators and a detailed workout list for the selected date.

---

## Page Structure

### 1. Header Section
- **Height:** 80px (sticky)
- **Title:** "Log Workout"
- **Subtitle:** Current month/year (e.g., "June 2024")
- **Background:** Primary white
- **Border:** Bottom 0.5px separator

```
┌─────────────────────────────┐
│ Log Workout                 │
│ June 2024                   │
└─────────────────────────────┘
```

### 2. Main Content Area
- **Flex:** 1 (expands to fill space)
- **Overflow:** Auto scroll
- **Padding:** 1.5rem
- **Gap between sections:** 2rem

#### 2a. Calendar Card
- **Background:** Primary white
- **Border:** 0.5px solid (tertiary)
- **Border-radius:** 12px
- **Padding:** 1.5rem
- **Width:** 100% of container

**Calendar Grid:**
- **Columns:** 7 (Sun-Sat)
- **Rows:** 4-6 (depending on month)
- **Gap:** 8px
- **Cell aspect ratio:** 1:1 (square)

**Day Cell States:**

| State | Background | Text | Border | Font-weight |
|-------|-----------|------|--------|-------------|
| No data | Secondary gray | Secondary gray | Tertiary | 400 |
| Has workout | Info blue | White | Info | 600 |
| Selected | Info blue | White | Info (2px) | 600 |
| Hover | Secondary gray | Secondary gray | Tertiary | 400 |

**Days of Week Header:**
- Font size: 12px
- Font weight: 500
- Color: Secondary text
- Margin bottom: 1rem

#### 2b. Workout List
- **Title:** Selected date (e.g., "June 9, 2024")
- **Title style:** 16px, weight 500, primary text
- **Gap between cards:** 12px

**Workout Card Structure:**

```
┌─────────────────────────────────┐
│ Exercise Name        20min ago  │
│ [Cable] [Back]                  │
│ Set 1: 17.5kg × 12  Set 2: ... │
└─────────────────────────────────┘
```

**Card Details:**

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Exercise name | 15px | 500 | Primary |
| Time ago | 12px | 400 | Secondary |
| Equipment badge | 12px | 400 | Secondary text |
| Muscle badge | 12px | 500 | White (on blue) |
| Set details | 13px | 400 | Primary text |

**Empty State:**
- When no workouts for selected date
- Centered text: "No workouts logged for this date"
- CTA button: "+ Add workout"
- Padding: 2rem

### 3. Bottom Navigation Bar

**Position:** Sticky bottom
**Height:** ~80px (including safe area)
**Background:** Primary white
**Border:** Top 0.5px separator

**3 Navigation Items:**

| Item | Icon | Label | Active State |
|------|------|-------|--------------|
| Home | ti-home | Home | Gray → Blue on active |
| Log | ti-calendar | Log | Gray → Blue on active |
| Analytics | ti-chart-bar | Analytics | Gray → Blue on active |

**NavItem Styling:**

| Property | Value |
|----------|-------|
| Layout | Flex column |
| Gap | 4px |
| Icon size | 24px |
| Label size | 12px |
| Padding | 0.5rem 1rem |
| Inactive color | Secondary text |
| Active color | Info blue |
| Active weight | 500 |

---

## Color Palette

### Semantic Colors Used

| Element | Color Variable | Hex | Usage |
|---------|-----------------|-----|-------|
| Has workout | var(--color-info) | #378ADD | Calendar, badges, nav active |
| No workout | var(--color-background-secondary) | Secondary | Calendar empty, badges |
| Selected date | var(--color-info) | #378ADD | Calendar selection |
| Primary text | var(--color-text-primary) | Primary | Headers, exercise names |
| Secondary text | var(--color-text-secondary) | Secondary | Subtitles, hints |
| Background | var(--color-background-primary) | White | Card backgrounds |
| Page background | var(--color-background-tertiary) | Tertiary | Main area |
| Borders | var(--color-border-tertiary) | Tertiary (0.5px) | Card borders |

---

## Typography

### Font Family
`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Anthropic Sans', sans-serif;`

### Text Styles

| Element | Size | Weight | Line-height | Color |
|---------|------|--------|------------|-------|
| Page header | 22px | 500 | 1.2 | Primary text |
| Month subtitle | 13px | 400 | 1.5 | Secondary text |
| Workout list title | 16px | 500 | 1.3 | Primary text |
| Exercise name | 15px | 500 | 1.3 | Primary text |
| Time ago | 12px | 400 | 1.5 | Secondary text |
| Badge text | 12px | 400/500 | 1.5 | Secondary/white |
| Set details | 13px | 400 | 1.5 | Primary text |
| Nav label | 12px | 400/500 | 1.5 | Secondary/info |

---

## Interactive States

### Calendar Day Button
```css
.calendar-day {
  aspect-ratio: 1 / 1;
  transition: all 0.3s ease;
}

/* Default state */
.calendar-day:not(.has-workout) {
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
  border: 0.5px solid var(--color-border-tertiary);
}

/* Has workout state */
.calendar-day.has-workout {
  background: var(--color-info);
  color: white;
  border: 0.5px solid var(--color-info);
  font-weight: 600;
}

/* Selected state */
.calendar-day.selected {
  background: var(--color-info);
  color: white;
  border: 2px solid var(--color-info); /* Note: 2px, not 0.5px */
  font-weight: 600;
}

/* Hover state */
.calendar-day:hover:not(.selected) {
  background: var(--color-background-secondary);
}

/* Active state */
.calendar-day:active {
  transform: scale(0.98);
}
```

### Workout Card
```css
.workout-card {
  background: var(--color-background-primary);
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.workout-card:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-border-secondary);
}

.workout-card:active {
  transform: scale(0.98);
}
```

### Bottom Navigation Item
```css
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
  transition: color 0.3s ease;
}

.nav-item i {
  font-size: 24px;
}

.nav-item.active {
  color: var(--color-info);
  font-weight: 500;
}
```

---

## Responsive Design

### Mobile (< 640px)
```css
.calendar-grid {
  grid-template-columns: repeat(7, 1fr);
  gap: 6px; /* Slightly smaller gap */
}

.calendar-day {
  font-size: 13px;
}

.workout-card {
  padding: 0.75rem;
}

.log-page-main {
  padding: 1rem;
  gap: 1.5rem;
}
```

### Tablet (640px - 1024px)
- Same as desktop
- Full layout visible
- Comfortable spacing

### Desktop (> 1024px)
- Max-width: 680px (Claude chat width)
- Centered layout
- Full spacing

### Safe Area (Mobile)
```css
.bottom-nav {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
```

---

## Component Hierarchy

```
LogPage
├── LogPageHeader
│   ├── Title: "Log Workout"
│   └── Subtitle: Month/Year
├── LogPageMain
│   ├── CalendarCard
│   │   ├── CalendarHeader (Sun-Sat)
│   │   └── CalendarGrid
│   │       └── CalendarDay (×30/31)
│   └── WorkoutList
│       ├── ListTitle (Selected Date)
│       ├── WorkoutCard (×N)
│       │   ├── WorkoutHeader
│       │   ├── WorkoutBadges
│       │   └── WorkoutSets
│       └── EmptyState (if no workouts)
└── BottomNav
    ├── NavItem (Home)
    ├── NavItem (Log) [active]
    └── NavItem (Analytics)
```

---

## Data Structure

### Workout Object
```javascript
{
  id: string,
  userId: string,
  userExerciseId: string,
  exerciseName: string,
  equipment: string,
  primaryMuscle: string,
  secondaryMuscle?: string,
  workoutDate: Date,
  sets: WorkoutSet[],
  notes?: string,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### WorkoutSet Object
```javascript
{
  id: string,
  setNumber: number,
  weight: number, // kg
  reps: number,
  notes?: string
}
```

### Workout Days Array
```javascript
workoutDays = [3, 5, 8, 9, 11, 14, 15] // Days with workouts in June
```

---

## Key Features

✅ **Calendar with visual indicators** - Blue for days with workouts
✅ **Date selection** - Click to select, updates list below
✅ **Workout list** - All exercises logged on selected date
✅ **Bottom navigation** - Quick access to Home, Log, Analytics
✅ **Time display** - "20min ago", "2 hours ago", etc.
✅ **Empty state** - User-friendly message when no workouts
✅ **Mobile optimized** - Safe area insets, responsive grid
✅ **Accessible** - Semantic HTML, proper contrast, keyboard nav
✅ **Dark mode ready** - Uses CSS variables for auto-adaptation
✅ **Smooth interactions** - Hover effects, active states, transitions

---

## User Flows

### Flow 1: View Workouts for a Date
```
User sees calendar
  ↓
Clicks a date with blue indicator
  ↓
Workout list updates for that date
  ↓
Sees all exercises logged that day
  ↓
Can click workout card for details
```

### Flow 2: Navigate Between Pages
```
User on Log page
  ↓
Clicks Home in bottom nav
  ↓
Navigates to Dashboard
  ↓
Log button becomes inactive

OR

User clicks Analytics in bottom nav
  ↓
Navigates to Analytics page
  ↓
Bottom nav updates active indicator
```

### Flow 3: No Workouts for Date
```
User selects a date with no workouts
  ↓
Empty state message displayed
  ↓
CTA button "+ Add workout"
  ↓
Click button opens log form
```

---

## Implementation Checklist

### React Components
- [ ] LogPage.jsx - Main page container
- [ ] LogPageHeader.jsx - Header with title/month
- [ ] CalendarCard.jsx - Calendar grid component
- [ ] CalendarDay.jsx - Individual day button
- [ ] WorkoutList.jsx - List container
- [ ] WorkoutCard.jsx - Individual workout card
- [ ] BottomNav.jsx - Navigation bar
- [ ] NavItem.jsx - Individual nav item

### Styling
- [ ] LogPage.css - Main layout
- [ ] CalendarCard.css - Calendar styles
- [ ] WorkoutCard.css - Workout card styles
- [ ] BottomNav.css - Navigation styles
- [ ] Responsive utilities - Mobile breakpoints

### State Management
- [ ] selectedDate state - Current selected date
- [ ] workouts state - List of workouts for date
- [ ] activeTab state - Bottom nav active tab

### Functionality
- [ ] Load workouts for selected date
- [ ] Highlight days with workouts
- [ ] Update list on date selection
- [ ] Navigate between tabs
- [ ] Format dates (DD Mon YYYY)
- [ ] Format times ("20min ago")
- [ ] Handle empty state
- [ ] Click workout card → details page

### API Integration
- [ ] GET /api/workouts?date=YYYY-MM-DD
- [ ] GET /api/workouts/summary/month (for calendar indicators)
- [ ] Update workouts on date change

---

## Accessibility

### WCAG 2.1 AA Compliance
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`)
- [ ] Proper heading hierarchy (h1, h2)
- [ ] Color not sole means of distinction
- [ ] Minimum touch target size: 44px × 44px
- [ ] Focus indicators visible
- [ ] Keyboard navigation support
- [ ] Screen reader friendly labels
- [ ] Sufficient color contrast (4.5:1 for text)

### Testing Checklist
- [ ] Tab through all interactive elements
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Test zoom to 200%
- [ ] Test with keyboard only
- [ ] Test with Windows High Contrast mode

---

## Performance Considerations

### Optimization Strategies
- **Lazy load workouts** - Only load for visible months
- **Virtual scrolling** - If 30+ workouts for single day
- **Memoization** - useMemo for calendar calculations
- **Debounce** - Date selection with small delay before fetch
- **Caching** - Store workouts locally (Redux/Context)

### Metrics
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

---

## Future Enhancements

### Phase 2
- [ ] **Add workout button** - Floating action button for quick add
- [ ] **Bulk operations** - Select multiple dates, copy/move workouts
- [ ] **Filters** - By muscle group, equipment
- [ ] **Statistics** - Total volume, average reps per date
- [ ] **Animations** - Smooth transitions between dates

### Phase 3
- [ ] **Workout templates** - Save and repeat routines
- [ ] **Rest days** - Mark intentional rest days
- [ ] **Export** - Download workout history as PDF/CSV
- [ ] **Sharing** - Share workout day with friends
- [ ] **Notifications** - Remind to log workout

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Safari | 13+ | ✅ Full |
| Firefox | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| iOS Safari | 13+ | ✅ Full |
| Android Chrome | Latest | ✅ Full |

---

## File Structure

```
src/
├── pages/
│   └── LogPage/
│       ├── LogPage.jsx
│       ├── LogPage.css
│       ├── components/
│       │   ├── LogPageHeader.jsx
│       │   ├── CalendarCard.jsx
│       │   ├── CalendarDay.jsx
│       │   ├── WorkoutList.jsx
│       │   ├── WorkoutCard.jsx
│       │   └── index.js
│       └── hooks/
│           ├── useWorkoutDays.js
│           ├── useWorkoutsByDate.js
│           └── index.js
├── common/
│   └── BottomNav/
│       ├── BottomNav.jsx
│       ├── NavItem.jsx
│       └── BottomNav.css
└── styles/
    └── variables.css
```

---

## CSS Variables Reference

```css
/* Colors */
--color-background-primary: #FFFFFF
--color-background-secondary: #F5F5F5
--color-background-tertiary: #FAFAFA
--color-text-primary: #1A1A1A
--color-text-secondary: #666666
--color-text-tertiary: #999999
--color-info: #378ADD
--color-border-tertiary: rgba(0, 0, 0, 0.15)
--color-border-secondary: rgba(0, 0, 0, 0.3)

/* Layout */
--border-radius-md: 8px
--border-radius-lg: 12px

/* Typography */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-size-xs: 12px
--font-size-sm: 13px
--font-size-base: 16px
--font-size-lg: 22px

/* Spacing */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px

/* Transitions */
--transition-speed: 0.3s
```

---

## Notes for Developers

### Important Points
1. **Calendar aspect ratio:** Must be 1:1 (square) for proper layout
2. **Selected border:** Use 2px, not 0.5px (this is an exception)
3. **Safe area inset:** Required for mobile devices with notch
4. **Time formatting:** Use relative time ("20min ago") for better UX
5. **Empty state:** Show helpful CTA, not just empty message
6. **Navigation active state:** Must be visually distinct from inactive
7. **Calendar grid:** Always 7 columns, not responsive width
8. **Workout card:** Clickable entire card, not just specific elements

### Common Gotchas
- ❌ Don't use `position: fixed` for bottom nav (use sticky instead)
- ❌ Don't crop workout names - use ellipsis or wrap text
- ❌ Don't forget safe-area-inset for bottom nav on mobile
- ❌ Don't make calendar days too small - min 40px × 40px
- ❌ Don't forget hover states on interactive elements

---

## Testing Guide

### Manual Testing Steps
1. Open Log page
2. Verify calendar displays correctly
3. Click a date with blue indicator
4. Verify workout list updates
5. Click a date without blue indicator
6. Verify empty state shows
7. Click workout card
8. Verify detail view opens
9. Click bottom nav items
10. Verify page navigation works

### Automated Testing
```javascript
describe('LogPage', () => {
  test('renders calendar', () => {
    render(<LogPage />);
    expect(screen.getByRole('heading', { name: /Log Workout/i })).toBeInTheDocument();
  });

  test('displays workouts for selected date', () => {
    render(<LogPage />);
    const dateButton = screen.getByRole('button', { name: '9' });
    fireEvent.click(dateButton);
    expect(screen.getByText(/Lat Pulldown - Wide/)).toBeInTheDocument();
  });

  test('highlights days with workouts', () => {
    render(<LogPage />);
    const workoutDay = screen.getByRole('button', { name: '3' });
    expect(workoutDay).toHaveClass('has-workout');
  });
});
```

---

**Log Page Design is production-ready! Ready to build!** 🚀
