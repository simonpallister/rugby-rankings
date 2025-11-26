# Cron Job Setup for Weekly Rankings Snapshots

## Overview
To maintain historical rankings data, you need to snapshot the current rankings weekly. World Rugby updates their rankings **every Monday (UTC)** after international matches, so weekly snapshots are sufficient.

## Option 1: System Cron (Recommended for VM/Docker)

### Setup
1. Edit your crontab:
   ```bash
   crontab -e
   ```

2. Add this line to run weekly on Mondays at 12:00 UTC (noon, after rankings update):
   ```cron
   0 12 * * 1 cd /path/to/rugby-rankings-2 && npm run snapshot >> /var/log/rugby-snapshot.log 2>&1
   ```

### Docker Environment
If running in Docker, you can add a cron service to your docker-compose.yml:

```yaml
services:
  # ... existing services (postgres, app)

  cron:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    command: sh -c "npm install -g tsx && while true; do npm run snapshot && sleep 604800; done"  # 604800 seconds = 7 days
    depends_on:
      - postgres
    environment:
      DATABASE_URL: ${DATABASE_URL}
```

## Option 2: API Endpoint (HTTP-based)

You can trigger snapshots via HTTP by calling:
```bash
curl http://localhost:3000/api/rankings/snapshot
```

### External Cron Services
Use services like:
- **cron-job.org** - Free HTTP cron
- **EasyCron** - HTTP-based scheduler
- **GitHub Actions** - If code is on GitHub

Example GitHub Action (`.github/workflows/snapshot.yml`):
```yaml
name: Weekly Rankings Snapshot
on:
  schedule:
    - cron: '0 12 * * 1'  # Weekly on Mondays at 12:00 UTC
  workflow_dispatch:

jobs:
  snapshot:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Snapshot
        run: |
          curl -X GET https://your-domain.com/api/rankings/snapshot
```

## Manual Snapshot

You can manually trigger a snapshot anytime:

```bash
# Snapshot both men's and women's rankings
npm run snapshot

# Men's only
npm run snapshot:men

# Women's only
npm run snapshot:women
```

## Monitoring

Check if snapshots are working:
```bash
# View recent logs (if using cron with logging)
tail -f /var/log/rugby-snapshot.log

# Or check the database directly
psql -U rugby rugby_rankings -c "SELECT gender, effectiveDate, COUNT(*) FROM \"HistoricalRanking\" GROUP BY gender, effectiveDate ORDER BY effectiveDate DESC LIMIT 10;"
```

## Recommended Schedule

- **Weekly snapshots**: Mondays at 12:00 UTC (World Rugby updates rankings on Mondays)
- **During major tournaments**: You may want to run more frequently (e.g., twice weekly) to capture mid-week updates
- **Manual trigger**: After any major international match weekend if you want immediate updates

## Troubleshooting

### Cron job not running
```bash
# Check cron logs
grep CRON /var/log/syslog

# Test the command manually
cd /path/to/rugby-rankings-2 && npm run snapshot
```

### Database connection errors
Ensure the DATABASE_URL environment variable is set correctly in your cron environment.

### API rate limiting
World Rugby API is generally permissive. Since rankings only update weekly (Mondays), there's no benefit to running snapshots more frequently than once per week under normal circumstances.
