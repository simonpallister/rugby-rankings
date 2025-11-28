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

The app integrates with the World Rugby RIMS (Rugby Information Management System) API. Detailed documentation for each endpoint is available:

- **[Rankings API Documentation](api-documentation-rankings.md)** - Complete reference for rankings endpoints
- **[Match API Documentation](api-documentation-match.md)** - Match data and fixtures
- **[Event API Documentation](api-documentation-events.md)** - Tournament and competition events

**Rankings API:**
```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/mru?language=en&client=pulse  # Men's
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/wru?language=en&client=pulse  # Women's
```
Returns current rankings with `effectiveTime` timestamp.

**Fixtures API:**
```
GET https://api.wr-rims-prod.pulselive.com/rugby/v3/match?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}&sort=asc&pageSize=100&page={N}
```
Returns paginated match data. App fetches all pages (increments page until <100 results).

### Internal API Routes

**Historical Rankings API:**
```
GET /api/rankings/history?gender={men|women}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}&teamIds={id1,id2}
```
Query parameters:
- `gender` (required): `men` or `women`
- `action` (optional): `list` (default), `dates`, `teams`, `latest`, `atDate`, `team`
- `startDate`, `endDate`: Date range for historical data
- `teamIds`: Comma-separated team IDs for filtering (improves performance)
- `teamId`: Specific team ID for team history action
- `date`: Specific date for atDate action

Response cached for 5 minutes. Returns rankings data from PostgreSQL.

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

### Server Components

**`app/[gender]/page.tsx`**
- Async function that fetches rankings + fixtures server-side
- Validates gender parameter (men/women), redirects if invalid
- Calculates date ranges and filters fixtures
- Splits fixtures into completed and upcoming
- Passes data as props to `RankingsCalculator`

**`app/[gender]/history/page.tsx`**
- Fetches latest snapshot date and available teams
- Validates gender parameter
- Shows helpful message if no historical data available
- Passes initial data to `HistoricalRankingsView`

**`app/[gender]/layout.tsx`**
- Gender-specific layout wrapper
- Includes Header with GenderToggle
- Includes MainNav with tabs for different sections
- Provides gender context to child components

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

**`components/HistoricalRankingsView.tsx`** (Historical Data Viewer)
- Manages team selection, date range, and metric (position/points) state
- Fetches historical data from API with debouncing (300ms)
- Supports selecting up to 12 teams for comparison
- Time period options: 30 days to 10 years
- Displays RankingsLineChart with fetched data
- Splits teams into top 20 (visible) and others (collapsible)
- Shows loading states and error handling

**`components/charts/RankingsLineChart.tsx`** (Recharts Component)
- Renders interactive line chart with Recharts library
- Supports both position and points metrics
- Reverses Y-axis for position (lower is better)
- Custom tooltip that sorts teams by current rank
- Color-coded lines for up to 12 teams
- Includes country flags in legend and tooltip
- Responsive container for mobile support

**Layout Components:**

**`components/layout/Header.tsx`**
- App header with logo and title
- Includes GenderToggle for switching between men/women

**`components/layout/GenderToggle.tsx`**
- Toggle button for men's/women's rugby
- Preserves current page when switching (e.g., /men/history → /women/history)
- Active state styling

**`components/layout/MainNav.tsx`**
- Tab navigation for different sections
- Tabs: Rankings Calculator, Historical Rankings, Raeburn Shield, Tournaments
- Active state with green underline
- Responsive with horizontal scroll on mobile

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

### `lib/db/client.ts`
Prisma client singleton:
- Exports configured Prisma client instance
- Prevents multiple instances in development (hot reloading)
- Uses PostgreSQL connection string from environment

### `lib/db/rankings.ts`
Database query functions for historical rankings:
- `saveRankingsSnapshot()` - Saves current rankings as snapshot (upsert)
- `getHistoricalRankings()` - Gets rankings for date range, optionally filtered by teams
- `getTeamHistory()` - Gets historical data for specific team
- `getSnapshotDates()` - Lists all dates with snapshots
- `getRankingsAtDate()` - Gets rankings for specific date
- `getLatestSnapshotDate()` - Returns most recent snapshot date
- `getRankedTeams()` - Returns all teams ordered by latest position
- Converts Gender type to Prisma enum (MEN/WOMEN)

### `types/index.ts`
Core TypeScript interfaces:
- `Team` - id, name, abbreviation
- `Ranking` - team, pts, pos, previousPts, previousPos
- `CalculatedRanking` - extends Ranking with change metrics
- `Fixture` - match data with scores, flags (isRwc, noHome)
- `Gender` - Type alias for 'men' | 'women'

### `prisma/schema.prisma`
Database schema with models:
- `HistoricalRanking` - Snapshots of team rankings over time
- `HistoricalFixture` - Completed matches (planned for Raeburn Shield tracking)
- `RaeburnShield` - Current shield holder (planned)
- `RaeburnShieldHistory` - Shield lineage (planned)
- `Tournament` - Six Nations, Rugby Championship (planned)
- `TournamentStanding` - Tournament tables (planned)
- `TournamentMatch` - Links fixtures to tournaments (planned)
- `Gender` enum (MEN, WOMEN)
- `TournamentType` enum (SIX_NATIONS, RUGBY_CHAMPIONSHIP)

### Scripts

**`scripts/snapshot-rankings.ts`**
- Daily snapshot script that saves current rankings to database
- Can be run for specific gender or both: `npm run snapshot:men`
- Fetches live rankings from World Rugby API
- Calls `saveRankingsSnapshot()` to persist data
- Designed to run as cron job

**`scripts/backfill-sample-data.ts`**
- Generates sample historical data for testing
- Creates synthetic data with realistic point movements
- Useful for development without real historical data

**`scripts/backfill-daily-data.ts`**
- Backfills daily snapshots for a date range
- Uses current World Rugby rankings for each day (not historical)
- Good for initializing the database

**`scripts/backfill-real-historical-data.ts`**
- Backfills with real historical rankings from World Rugby API
- Fetches past matches and recalculates rankings retroactively
- Most accurate but slowest backfill method

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

### Database Configuration
Requires PostgreSQL database and environment variable:
```
DATABASE_URL="postgresql://user:password@localhost:5432/rugby_rankings?schema=public"
```
After setting up database:
1. Run `npx prisma migrate dev` to create tables
2. Run `npx prisma generate` to generate Prisma client
3. Run `npm run backfill` or `npm run snapshot` to populate data

### Prisma Client Generation
The Prisma client is generated to `lib/generated/prisma` (custom output path). If you get import errors:
- Run `npx prisma generate`
- Check that `lib/generated/prisma` directory exists
- Verify `prisma/schema.prisma` has correct output path

## Development Patterns

### Adding New Features
1. **State changes**: Add to relevant client components (RankingsCalculator, HistoricalRankingsView)
2. **New calculations**: Add to `lib/rankings.ts`
3. **API changes**: Modify `lib/api.ts` and update types
4. **Database changes**:
   - Update `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name migration_name`
   - Add query functions to `lib/db/`
5. **New pages**: Add to `app/[gender]/` directory
6. **UI components**: Create in `components/` directory
7. **API routes**: Add to `app/api/` directory

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind utility classes (no custom CSS)
- Server components by default, client only when needed ("use client")

### Performance Considerations
- Keep server components async for SSR benefits
- Use `useMemo` for expensive calculations (rankings)
- Minimize client-side state (only user predictions, chart selections)
- Let Next.js handle caching (don't add custom caching)
- Use debouncing for API calls in interactive components (300ms)
- Filter database queries by teamIds when possible to reduce result set
- API routes use 5-minute cache, client components revalidate

## Testing the App

### Expected Behavior

**Rankings Calculator (`/men` or `/women`):**
1. **On load**: Shows official rankings + upcoming fixtures (next 7 days)
2. **Completed matches**: Displays if any happened since last rankings update
3. **Fixture outcomes**: Click any of 5 buttons to add prediction
4. **Rankings update**: Instant recalculation with green/red changes
5. **Clear predictions**: Removes all user predictions, shows official rankings again
6. **Gender toggle**: Switch between men's and women's rankings

**Historical Rankings (`/men/history` or `/women/history`):**
1. **On load**: Shows top 10 teams selected by default
2. **Chart display**: Interactive line chart with position or points over time
3. **Team selection**: Toggle up to 12 teams for comparison
4. **Time periods**: Select from 30 days to 10 years
5. **Metric toggle**: Switch between position and points
6. **Tooltip**: Hover shows values for all teams at that date, sorted by rank
7. **No data message**: Shows helpful message if no snapshots exist yet

### Data Validation
- Rankings should have ~25 teams for men, ~30+ for women (all Tier 1/2 nations)
- Points typically range from 75-95
- Position changes should be rare without predictions
- All fixtures should be international matches (not club/domestic)
- Historical data requires database snapshots (run `npm run snapshot` first)

## Links & Resources

- **World Rugby Rankings**: https://www.world.rugby/rankings (men's and women's)
- **Ranking Methodology**: https://www.world.rugby/tournaments/rankings/explanation
- **Original Inspiration**: https://rawling.github.io/wr-calc/
- **Original Source**: https://github.com/rawling/wr-calc
- **Recharts Documentation**: https://recharts.org/
- **Prisma Documentation**: https://www.prisma.io/docs

## Recent Changes (Latest Commit: "feat: ranking history")

### Major Features Added:
1. **Gender Support**: Full men's/women's rugby support with dynamic routing
2. **Historical Rankings**: Database-backed historical data with charting
3. **Interactive Charts**: Recharts integration with custom tooltips and legends
4. **Database Layer**: PostgreSQL with Prisma ORM
5. **Navigation System**: Header, gender toggle, and tab-based navigation
6. **Snapshot Scripts**: Automated daily ranking snapshots
7. **Backfill Scripts**: Multiple strategies for populating historical data

### Architecture Changes:
- Migrated from single page to dynamic `[gender]` routes
- Added API routes for historical data queries
- Introduced Prisma schema with multiple models for future features
- Split components into layout, charts, and feature-specific directories
- Added server-side validation and redirects for invalid gender params

### Database Schema:
- `HistoricalRanking` - Core table for tracking rankings over time
- Additional tables prepared for future features (Raeburn Shield, Tournaments)
- Composite unique indexes for efficient queries
- Gender enum for type safety

## Future Enhancement Ideas

### Planned Features:
1. **Raeburn Shield Tracking**:
   - Track current holder and defense count
   - Historical lineage of shield changes
   - Longest holding periods analysis

2. **Tournament Standings**:
   - Six Nations tables and fixtures
   - Rugby Championship tables and fixtures
   - Bonus points calculation
   - Head-to-head records

3. **AI-Powered Scenarios** (deferred):
   - Analyze queries like "Can Ireland reach #1 before 6 Nations?"
   - Generate fixture scenarios and probability analysis
   - Natural language queries about ranking possibilities

### Technical Improvements:
- Add proper error boundaries and loading states
- Implement optimistic updates for predictions
- Add ability to save/share prediction scenarios
- Export charts as images
- Add team comparison views (head-to-head statistics)
- Implement search/filter for team selection
- Add keyboard shortcuts for power users
