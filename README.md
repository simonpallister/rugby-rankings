# World Rugby Rankings Calculator

A modern web application for calculating World Rugby rankings based on match results. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

### 🏉 Live Data Integration
- Fetches current World Rugby rankings from official RIMS API
- Loads upcoming international fixtures automatically
- Updates every hour with server-side caching
- Support for both men's and women's rugby

### 📊 Rankings Calculator
- Implements official World Rugby ranking methodology:
  - Home advantage (+3 points)
  - Margin of victory multipliers (1.5x for wins >15 points)
  - Rugby World Cup multipliers (2x points)
  - Neutral venue support
  - Zero-sum points exchange system

### 📈 Historical Rankings
- View ranking trends over time with interactive charts
- Compare up to 12 teams simultaneously
- Track position and points changes historically
- Time periods from 30 days to 10 years
- Daily ranking snapshots stored in PostgreSQL

### 🎯 Predict Match Results
- Click on upcoming fixtures to predict scores
- Five preset outcome scenarios for quick predictions
- Add completed match results not yet in rankings
- See instant ranking updates
- Visual indicators for position and points changes

### 🎨 Modern UI
- Clean, responsive design with Tailwind CSS 4
- Dark mode support
- Dual gender support (men's/women's rugby)
- Tab-based navigation
- Country flag emojis
- Mobile-friendly layout with smooth animations

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/rugby_rankings?schema=public"

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Populate initial data (choose one method)
npm run snapshot           # Snapshot current rankings
npm run backfill           # Generate sample historical data
npm run backfill:daily     # Backfill with daily snapshots
npm run backfill:real      # Backfill with real historical data

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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
│   └── globals.css               # Tailwind imports
├── components/
│   ├── RankingsCalculator.tsx    # Main calculator component
│   ├── RankingsTable.tsx         # Rankings display table
│   ├── FixtureList.tsx           # Completed/predicted matches
│   ├── FixtureWithOutcomes.tsx   # Interactive fixture predictions
│   ├── HistoricalRankingsView.tsx # Historical data viewer
│   ├── charts/
│   │   └── RankingsLineChart.tsx # Recharts line chart
│   └── layout/
│       ├── Header.tsx            # App header
│       ├── GenderToggle.tsx      # Men/Women toggle
│       └── MainNav.tsx           # Main navigation tabs
├── lib/
│   ├── rankings.ts               # Ranking calculation logic
│   ├── api.ts                    # API client and transformers
│   ├── countries.ts              # Country flag mappings
│   └── db/
│       ├── client.ts             # Prisma client instance
│       └── rankings.ts           # Database query functions
├── scripts/
│   ├── snapshot-rankings.ts      # Daily snapshot script
│   ├── backfill-sample-data.ts   # Generate test data
│   ├── backfill-daily-data.ts    # Backfill daily snapshots
│   └── backfill-real-historical-data.ts # Real data backfill
├── prisma/
│   └── schema.prisma             # Database schema
└── types/
    └── index.ts                  # TypeScript type definitions
```

## World Rugby Ranking Calculation

The calculator implements the official World Rugby ranking system:

1. **Home Advantage**: Home team treated as 3 points stronger (unless neutral venue)
2. **Rating Differential**: Calculate difference between teams (capped at ±10)
3. **Draw Change**: Base change = differential / 10
4. **Match Result**: Apply different multipliers based on outcome:
   - Big win (>15 points): 1.5x(drawChange ± 1)
   - Small win: 1x(drawChange ± 1)
   - Draw: drawChange
5. **World Cup**: Double all point changes during RWC

## API Documentation

Detailed API documentation is available for the World Rugby RIMS endpoints:

- [Rankings API Documentation](api-documentation-rankings.md) - Complete reference for rankings endpoints
- [Match API Documentation](api-documentation-match.md) - Match data and fixtures
- [Event API Documentation](api-documentation-events.md) - Tournament and competition events

### Internal API Routes

#### GET /api/rankings/history
Fetches historical ranking data from PostgreSQL database

**Query Parameters:**
- `gender` (required): `men` or `women`
- `action` (optional): `list` (default), `dates`, `teams`, `latest`, `atDate`, `team`
- `startDate`, `endDate`: Date range for historical data
- `teamIds`: Comma-separated team IDs for filtering
- `teamId`: Specific team ID for team history action
- `date`: Specific date for atDate action

**Response:** Cached for 5 minutes. Returns rankings data with historical snapshots.

## Database Schema

The app uses PostgreSQL with Prisma ORM. Key models:

- **HistoricalRanking**: Snapshots of team rankings over time
- **HistoricalFixture**: Completed matches (planned for Raeburn Shield tracking)
- **RaeburnShield**: Current shield holder (planned)
- **RaeburnShieldHistory**: Shield lineage (planned)
- **Tournament**: Six Nations, Rugby Championship (planned)
- **TournamentStanding**: Tournament tables (planned)

## Snapshot Scripts

The app includes scripts for managing historical data:

```bash
# Snapshot current rankings
npm run snapshot           # Both men's and women's
npm run snapshot:men       # Men's only
npm run snapshot:women     # Women's only

# Backfill historical data
npm run backfill           # Generate sample data
npm run backfill:daily     # Backfill with daily snapshots
npm run backfill:real      # Backfill with real historical data
```

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 (with @tailwindcss/postcss)
- **UI**: React 19
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Charting**: Recharts
- **Data Source**: World Rugby RIMS API
- **Module System**: ES Modules

## Pages

### Rankings Calculator (`/men`, `/women`)
- View official World Rugby rankings
- See upcoming fixtures (next 7 days)
- Predict match outcomes with preset scenarios
- Track completed matches since last rankings update
- Instant ranking recalculation

### Historical Rankings (`/men/history`, `/women/history`)
- Interactive line charts showing ranking trends
- Compare up to 12 teams
- Toggle between position and points metrics
- Configurable time periods (30 days to 10 years)
- Sorted team selection with top 20 teams visible by default

### Planned Features
- **Raeburn Shield Tracking** (`/men/raeburn-shield`, `/women/raeburn-shield`)
- **Tournament Standings** (`/men/tournaments`, `/women/tournaments`)

## Caching Strategy

- **Server-side fetches**: 1-hour cache (`next: { revalidate: 3600 }`)
- **API routes**: 5-minute cache for historical data
- **First load**: ~11s (API fetch)
- **Subsequent loads**: ~33-93ms (cached)

## Inspiration

Inspired by [rawling/wr-calc](https://github.com/rawling/wr-calc) with modern improvements:
- Fresh, modern UI design
- Dual gender support
- Historical data tracking with charts
- Database-backed persistence
- Server-side rendering with caching
- Dark mode support
- Better mobile experience

## License

ISC

## Credits

- Ranking methodology: [World Rugby](https://www.world.rugby/tournaments/rankings/explanation)
- Data source: [World Rugby RIMS API](https://www.world.rugby/rankings)
- Original concept: [rawling/wr-calc](https://github.com/rawling/wr-calc)
- Charts: [Recharts](https://recharts.org/)
