# World Rugby Rankings Calculator

A modern web application for calculating World Rugby rankings based on match results. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🏉 Live Data Integration
- Fetches current World Rugby rankings from official API
- Loads upcoming international fixtures automatically
- Updates every hour with fresh data

### 📊 Rankings Calculator
- Implements official World Rugby ranking methodology:
  - Home advantage (+3 points)
  - Margin of victory multipliers (1.5x for wins >15 points)
  - Rugby World Cup multipliers (2x points)
  - Neutral venue support
  - Zero-sum points exchange system

### 🎯 Predict Match Results
- Click on upcoming fixtures to predict scores
- Add completed match results not yet in rankings
- See instant ranking updates
- Visual indicators for position and points changes

### 🎨 Modern UI
- Clean, responsive design with Tailwind CSS
- Dark mode support
- Gradient backgrounds and smooth animations
- Mobile-friendly layout

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

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
│   ├── api/
│   │   ├── rankings/      # World Rugby rankings API proxy
│   │   └── fixtures/      # World Rugby fixtures API proxy
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main calculator page
│   └── globals.css       # Global styles
├── components/
│   ├── RankingsTable.tsx        # Rankings display table
│   ├── FixtureInput.tsx         # Manual fixture entry form
│   ├── FixtureList.tsx          # User's predicted fixtures
│   ├── UpcomingFixtures.tsx     # API-loaded upcoming matches
│   └── FixtureScoreModal.tsx    # Score prediction modal
├── lib/
│   ├── rankings.ts       # Ranking calculation logic
│   ├── api.ts           # API client and data transformers
│   └── data.ts          # Sample/fallback data
└── types/
    └── index.ts         # TypeScript type definitions
```

## World Rugby Ranking Calculation

The calculator implements the official World Rugby ranking system:

1. **Home Advantage**: Home team treated as 3 points stronger
2. **Rating Differential**: Calculate difference between teams (capped at ±10)
3. **Draw Change**: Base change = differential / 10
4. **Match Result**: Apply different multipliers based on outcome:
   - Big win (>15 points): 1.5x(drawChange ± 1)
   - Small win: 1x(drawChange ± 1)
   - Draw: drawChange
5. **World Cup**: Double all point changes during RWC

## API Routes

### GET /api/rankings
Fetches current World Rugby rankings (Men's)

**Response:**
```json
{
  "entries": [
    {
      "team": { "id": 1, "name": "Ireland", "abbreviation": "IRE" },
      "pts": 92.12,
      "pos": 1,
      "previousPts": 92.12,
      "previousPos": 1
    }
  ],
  "effectiveTime": "2024-11-18T00:00:00.000Z"
}
```

### GET /api/fixtures
Fetches upcoming international rugby fixtures

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response:**
```json
{
  "content": [
    {
      "id": 12345,
      "time": { "label": "2024-11-25", "millis": 1700928000000 },
      "teams": [
        { "id": 1, "name": "Ireland", "abbreviation": "IRE" },
        { "id": 2, "name": "South Africa", "abbreviation": "RSA" }
      ],
      "status": "U",
      "venue": { "name": "Aviva Stadium", "city": "Dublin", "country": "Ireland" }
    }
  ]
}
```

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: React 19
- **Data Source**: World Rugby API

## Inspiration

Inspired by [rawling/wr-calc](https://github.com/rawling/wr-calc) with modern improvements:
- Fresh, modern UI design
- Live API integration
- Modal-based score prediction
- Dark mode support
- Better mobile experience

## License

ISC

## Credits

- Ranking methodology: [World Rugby](https://www.world.rugby/tournaments/rankings/explanation)
- Data source: [World Rugby API](https://www.world.rugby/rankings)
- Original concept: [rawling/wr-calc](https://github.com/rawling/wr-calc)
