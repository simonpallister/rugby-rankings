/**
 * Backfill script to fetch REAL historical rankings from World Rugby API
 *
 * This script will:
 * 1. Clear existing (fake) historical data
 * 2. Fetch real rankings from World Rugby API going back to:
 *    - 2003 for men's rugby (when rankings were introduced)
 *    - 2016 for women's rugby (when rankings were introduced)
 * 3. Create weekly snapshots to balance data granularity with API requests
 *
 * Usage: npm run backfill:real
 */

import 'dotenv/config';
import { fetchRankings } from '../lib/api.js';
import { saveRankingsSnapshot } from '../lib/db/rankings.js';
import { prisma } from '../lib/db/client.js';
import { Gender } from '../types/index.js';

/**
 * Generate array of dates for weekly snapshots
 */
function generateWeeklyDates(startYear: number, endDate: Date): string[] {
  const dates: string[] = [];
  const startDate = new Date(startYear, 0, 1); // January 1st of start year

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Format as YYYY-MM-DD
    const dateStr = currentDate.toISOString().split('T')[0];
    dates.push(dateStr);

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return dates;
}

/**
 * Backfill historical rankings for a gender
 */
async function backfillHistoricalRankings(gender: Gender) {
  const startYear = gender === 'men' ? 2003 : 2016;
  const today = new Date();

  console.log(`\n=== Backfilling ${gender}'s rankings ===`);
  console.log(`  Start year: ${startYear}`);
  console.log(`  End date: ${today.toISOString().split('T')[0]}`);

  // Generate weekly dates
  const dates = generateWeeklyDates(startYear, today);
  console.log(`  Total snapshots to fetch: ${dates.length}`);

  let successCount = 0;
  let errorCount = 0;

  // Fetch rankings for each date
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    try {
      // Fetch rankings for this date
      const { rankings, effectiveTime } = await fetchRankings(gender, date);

      // Save to database
      const effectiveDate = new Date(effectiveTime);
      await saveRankingsSnapshot(rankings, effectiveDate, gender);

      successCount++;

      // Show progress every 50 snapshots
      if ((i + 1) % 50 === 0) {
        console.log(`  ✓ Processed ${i + 1}/${dates.length} snapshots (${Math.round(((i + 1) / dates.length) * 100)}%)`);
      }

      // Add small delay to avoid rate limiting (100ms between requests)
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      errorCount++;
      console.error(`  ✗ Failed to fetch rankings for ${date}:`, error instanceof Error ? error.message : error);

      // Continue with next date even if one fails
      continue;
    }
  }

  console.log(`\n  ${gender}'s rankings complete:`);
  console.log(`    ✓ Success: ${successCount}`);
  console.log(`    ✗ Errors: ${errorCount}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Real Historical Rankings Backfill from World Rugby API  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // Step 1: Clear existing data
    console.log('\n[1/3] Clearing existing historical rankings data...');
    const deleteResult = await prisma.historicalRanking.deleteMany({});
    console.log(`  ✓ Cleared ${deleteResult.count} existing records`);

    // Step 2: Backfill men's rankings (2003-present)
    console.log('\n[2/3] Fetching real historical data for men\'s rugby...');
    await backfillHistoricalRankings('men');

    // Step 3: Backfill women's rankings (2016-present)
    console.log('\n[3/3] Fetching real historical data for women\'s rugby...');
    await backfillHistoricalRankings('women');

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ Backfill Complete!                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\nYour database now contains real historical rankings from:');
    console.log('  • Men\'s Rugby: 2003 to present');
    console.log('  • Women\'s Rugby: 2016 to present');
    console.log('\nView the data at:');
    console.log('  • http://localhost:3000/men/history');
    console.log('  • http://localhost:3000/women/history');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  }
}

main();
