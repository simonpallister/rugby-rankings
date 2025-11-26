# World Rugby Rankings Calculator - Codebase Guide

This document provides essential information for Claude Code instances working on this repository.

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm lint

# Database commands (requires PostgreSQL)
npx prisma migrate dev     # Apply migrations
npx prisma generate        # Generate Prisma client

# Data snapshot commands
npm run snapshot           # Snapshot both men's and women's rankings
npm run snapshot:men       # Snapshot men's rankings only
npm run snapshot:women     # Snapshot women's rankings only

# Backfill commands (for populating historical data)
npm run backfill           # Generate sample data
npm run backfill:daily     # Backfill with daily snapshots
npm run backfill:real      # Backfill with real historical data
```

## Project Overview

A modern web application that calculates World Rugby rankings based on match results. Users can:
- View current official World Rugby rankings (men's and women's)
- See upcoming international fixtures (next 7 days)
- Predict match outcomes and see instant ranking calculations
- Track completed matches that have been applied to rankings
- **NEW:** View historical ranking trends over time with interactive charts
- **NEW:** Compare multiple teams' rankings across different time periods
- **PLANNED:** Track Raeburn Shield holders and history
- **PLANNED:** View tournament standings (Six Nations, Rugby Championship)

**Key Features:**
- Live data from World Rugby API
- Official World Rugby calculation methodology
- Server-side rendering with 1-hour caching
- PostgreSQL database for historical data storage
- Interactive charting with Recharts
- Dual gender support (men's and women's rugby)
- Modern responsive UI with dark mode support

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 (using `@tailwindcss/postcss`)
- **UI**: React 19
- **Database**: PostgreSQL with Prisma ORM
- **Charting**: Recharts
- **Module System**: ES Modules (`"type": "module"` in package.json)

### Key Architectural Decisions

**Server Components Pattern:**
The app uses Next.js Server Components for optimal performance:
- `app/[gender]/page.tsx` - Server component that fetches all data server-side
- Direct API calls to World Rugby for live rankings
- Data cached with `next: { revalidate: 3600 }` (1 hour)
- Client components only for interactive state (user predictions, chart interactions)

**Route Structure:**
The app uses dynamic routing with gender segments:
- `/men` and `/women` - Main rankings calculators
- `/men/history` and `/women/history` - Historical rankings charts
- `/men/raeburn-shield` and `/women/raeburn-shield` - (Planned) Shield tracking
- `/men/tournaments` and `/women/tournaments` - (Planned) Tournament standings

**Data Flow:**
```
Live Rankings:
World Rugby API → Server Component (page.tsx) → Client Component (RankingsCalculator)
                                                       ↓
                                    User Predictions + Completed Matches
                                                       ↓
                                            Calculated Rankings

Historical Data:
Daily Snapshot Job → PostgreSQL → API Route → Client Component (HistoricalRankingsView)
                                                       ↓
                                              Recharts Line Chart
```

**Database Strategy:**
- Daily snapshots of rankings stored in PostgreSQL
- Historical data queried via API routes (`/api/rankings/history`)
- Prisma ORM for type-safe database access
- API responses cached for 5 minutes
- Backfill scripts available for populating historical data

## Project Structure

```
rugby-rankings-2/
├── app/
│   ├── [gender]/                  # Dynamic gender routing
│   │   ├── page.tsx              # Rankings calculator page
│   │   ├── layout.tsx            # Gender-specific layout with nav
│   │   └── history/
│   │       └── page.tsx          # Historical rankings page
│   ├── api/
│   │   └── rankings/
│   │       ├── history/route.ts  # Historical data API
│   │       └── snapshot/route.ts # Snapshot trigger API
│   ├── page.tsx                  # Root redirect to /men
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Tailwind imports (@import "tailwindcss")
├── components/
│   ├── RankingsCalculator.tsx    # Main client component (state management)
│   ├── RankingsTable.tsx         # Display rankings with flags
│   ├── FixtureList.tsx           # Show completed/predicted matches
│   ├── FixtureWithOutcomes.tsx   # Interactive fixture with outcome buttons
│   ├── HistoricalRankingsView.tsx # Historical data viewer with controls
│   ├── charts/
│   │   └── RankingsLineChart.tsx # Recharts line chart component
│   └── layout/
│       ├── Header.tsx            # App header with logo
│       ├── GenderToggle.tsx      # Men/Women toggle
│       └── MainNav.tsx           # Main navigation tabs
├── lib/
│   ├── rankings.ts               # World Rugby calculation algorithm
│   ├── api.ts                    # Server-side data fetching + transformations
│   ├── countries.ts              # Country flag emoji mappings
│   ├── db/
│   │   ├── client.ts             # Prisma client instance
│   │   └── rankings.ts           # Database query functions
│   └── generated/
│       └── prisma/               # Generated Prisma client
├── scripts/
│   ├── snapshot-rankings.ts      # Daily snapshot script
│   ├── backfill-sample-data.ts   # Generate test data
│   ├── backfill-daily-data.ts    # Backfill daily snapshots
│   └── backfill-real-historical-data.ts # Real data backfill
├── prisma/
│   └── schema.prisma             # Database schema
├── types/
│   └── index.ts                  # TypeScript interfaces
├── postcss.config.js             # PostCSS with @tailwindcss/postcss plugin
└── tsconfig.json                 # TypeScript configuration
```

## World Rugby Ranking Algorithm

The core calculation logic is in `lib/rankings.ts`. It implements the official World Rugby methodology:

### Formula Overview

```typescript
// 1. Home advantage: +3 points to home team (unless neutral venue)
const homeAdvantage = noHome ? 0 : 3;
const adjustedHomeRating = homeRating + homeAdvantage;

// 2. Rating differential (capped at ±10)
const rankingDiff = awayRating - adjustedHomeRating;
const cappedDiff = Math.max(-10, Math.min(10, rankingDiff));

// 3. Draw change (base change)
const drawChange = cappedDiff / 10;

// 4. RWC multiplier (2x during World Cup)
const rwcMult = isRwc ? 2 : 1;

// 5. Calculate based on outcome:
// - Home big win (>15 margin): rwcMult * 1.5 * (drawChange + 1)
// - Home small win:            rwcMult * (drawChange + 1)
// - Draw:                      rwcMult * drawChange
// - Away small win:            rwcMult * (drawChange - 1)
// - Away big win (>15 margin): rwcMult * 1.5 * (drawChange - 1)

// 6. Zero-sum exchange
awayChange = -homeChange;
```

### Key Functions

**`calculatePointsExchange()`**
- Calculates point changes for a single match
- Returns `{ homeChange, awayChange }` (always zero-sum)
- Handles: home advantage, margin multipliers, RWC multipliers, neutral venues

**`applyFixture()`**
- Applies a single fixture to rankings
- Updates team points but not positions

**`applyFixtures()`**
- Applies multiple fixtures in sequence
- Recalculates positions after all fixtures
- Returns `CalculatedRanking[]` with change metrics

**`getFixtureOutcomes()`**
- Generates 5 preset outcome scenarios for UI display
- Used by `FixtureWithOutcomes` component
- Scenarios: home big win, home small win, draw, away small win, away big win

## API Integration

### World Rugby Endpoints

**Rankings API:**
```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/mru?language=en&client=pulse
```
Returns current men's rankings with `effectiveTime` timestamp.

**Fixtures API:**
```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}&sort=asc&pageSize=100&page={N}
```
Returns paginated match data. App fetches all pages (increments page until <100 results).

### Data Filtering

**Fixtures are filtered to only show:**
1. Matches after the rankings `effectiveTime` (future or recent completed)
2. Matches with exactly 2 teams
3. Both teams exist in the rankings (international test matches only)
4. Date range: 1 month ago to 6 months ahead
5. **Upcoming fixtures section**: Next 7 days only, no scores yet

### Caching Strategy
- Server-side fetch with `next: { revalidate: 3600 }`
- Data refreshes every 1 hour
- First load: ~11s (API fetch)
- Subsequent loads: ~33-93ms (cached)

## Components

### Server Component

**`app/page.tsx`**
- Async function that fetches rankings + fixtures server-side
- Calculates date ranges and filters fixtures
- Passes data as props to `RankingsCalculator`
- Includes header and footer with links to World Rugby

### Client Components

**`components/RankingsCalculator.tsx`** (Main Interactive Component)
- Manages user prediction state: `useState<Fixture[]>`
- Combines completed fixtures + user predictions
- Calculates rankings with `useMemo(() => applyFixtures(...))`
- Handles add/remove/clear fixture actions
- Two-column grid layout (50/50 split): Rankings | Fixtures

**`components/RankingsTable.tsx`**
- Displays rankings in table format
- Shows position changes with arrows (▲ ▼)
- Shows point changes in green (positive) / red (negative)
- Includes country flags via `getCountryFlag()`
- Title changes based on context: "Official Rankings" vs "Calculated Rankings"

**`components/FixtureList.tsx`**
- Displays completed matches or user predictions
- Two modes: readonly (completed) or editable (predictions)
- Shows scores, flags, RWC badge, neutral venue badge
- Remove button for user predictions

**`components/FixtureWithOutcomes.tsx`**
- Interactive fixture card with 5 outcome buttons
- Each button shows calculated point change for that outcome
- Color-coded: green (home win), yellow (draw), red (away win)
- Clicking adds prediction to user fixtures
- Shows "Added" state when prediction is active

## Important Files

### `lib/api.ts`
Contains server-side data fetching logic:
- `fetchRankings()` - Gets current rankings with caching
- `fetchFixtures(startDate, endDate)` - Paginated fixture fetching
- `transformRankings()` - Converts World Rugby format to internal types
- `transformFixtures()` - Filters and converts fixture data

**Key detail:** Match IDs use `match.matchId || match.id?.toString() || \`${match.time.millis}\`` because the API inconsistently returns `matchId` (string) or `id` (number).

### `lib/countries.ts`
Maps country names to emoji flags:
```typescript
export const countryFlags: Record<string, string> = {
  "New Zealand": "🇳🇿",
  "South Africa": "🇿🇦",
  "Ireland": "🇮🇪",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  // ... all World Rugby ranked nations
};
```

### `types/index.ts`
Core TypeScript interfaces:
- `Team` - id, name, abbreviation
- `Ranking` - team, pts, pos, previousPts, previousPos
- `CalculatedRanking` - extends Ranking with change metrics
- `Fixture` - match data with scores, flags (isRwc, noHome)

## Common Issues & Solutions

### Tailwind CSS v4 Configuration
Must use `@tailwindcss/postcss` plugin, not `tailwindcss` directly:

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

```css
/* app/globals.css */
@import "tailwindcss";
```

### Module Format
Must use ES modules (`"type": "module"` in package.json) because Next.js 16 uses ESM.

### API Data Inconsistencies
- Match IDs: Use `matchId || id?.toString() || fallback`
- Status codes: "C" = completed, "U" = upcoming
- Fixtures include club matches: Filter by `rankedTeamIds.has(team.id)`

### Date Filtering
Rankings have an `effectiveTime`. Only apply fixtures that occur after this timestamp:
```typescript
match.status !== "C" || match.time.millis > rankingsTime
```

## Development Patterns

### Adding New Features
1. **State changes**: Add to `RankingsCalculator` component
2. **New calculations**: Add to `lib/rankings.ts`
3. **API changes**: Modify `lib/api.ts` and update types
4. **UI components**: Create in `components/` directory

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind utility classes (no custom CSS)
- Server components by default, client only when needed ("use client")

### Performance Considerations
- Keep server components async for SSR benefits
- Use `useMemo` for expensive calculations (rankings)
- Minimize client-side state (only user predictions)
- Let Next.js handle caching (don't add custom caching)

## Testing the App

### Expected Behavior
1. **On load**: Shows official rankings + upcoming fixtures (next 7 days)
2. **Completed matches**: Displays if any happened since last rankings update
3. **Fixture outcomes**: Click any of 5 buttons to add prediction
4. **Rankings update**: Instant recalculation with green/red changes
5. **Clear predictions**: Removes all user predictions, shows official rankings again

### Data Validation
- Rankings should have ~25 teams (all Tier 1/2 nations)
- Points typically range from 75-95
- Position changes should be rare without predictions
- All fixtures should be international matches (not club/domestic)

## Links & Resources

- **World Rugby Rankings**: https://www.world.rugby/rankings
- **Ranking Methodology**: https://www.world.rugby/tournaments/rankings/explanation
- **Original Inspiration**: https://rawling.github.io/wr-calc/
- **Original Source**: https://github.com/rawling/wr-calc

## Future Enhancement Ideas

The user mentioned wanting to add AI-powered scenario extrapolation:
- Analyze statements like "Can Ireland reach #1 before 6 Nations?"
- Generate fixture scenarios and probability analysis
- Natural language queries about ranking possibilities

This feature was deferred to focus on the core calculator first.
