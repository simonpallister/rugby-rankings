/**
 * Backfill script to create DAILY historical data
 * Creates one snapshot per day for smoother charts
 *
 * Usage: npm run backfill:daily
 */

import 'dotenv/config';
import { fetchRankings } from '../lib/api.js';
import { saveRankingsSnapshot } from '../lib/db/rankings.js';
import { Gender } from '../types/index.js';

async function backfillDailyData(gender: Gender, daysBack: number = 90) {
  console.log(`\nBackfilling ${gender}'s rankings with DAILY snapshots for the last ${daysBack} days...`);

  // Fetch current rankings as baseline
  const { rankings } = await fetchRankings(gender);
  console.log(`  Using ${rankings.length} teams as baseline`);

  const today = new Date();
  let snapshotsCreated = 0;

  // Create daily snapshots
  for (let daysAgo = daysBack; daysAgo >= 0; daysAgo--) {
    const snapshotDate = new Date(today);
    snapshotDate.setDate(snapshotDate.getDate() - daysAgo);

    // Create variations in the rankings to simulate changes over time
    const modifiedRankings = rankings.map((ranking) => {
      // Add some random variation to points (±2 points)
      // Variation is smaller for more recent dates to simulate stability
      const variationRange = 2 + (daysAgo / daysBack) * 2; // 2-4 points variation
      const variation = (Math.random() - 0.5) * variationRange;
      const newPoints = ranking.pts + variation;

      return {
        ...ranking,
        pts: Math.max(0, newPoints),
        previousPts: ranking.pts,
      };
    });

    // Sort by new points to get new positions
    modifiedRankings.sort((a, b) => b.pts - a.pts);

    // Update positions
    modifiedRankings.forEach((ranking, index) => {
      ranking.pos = index + 1;
      ranking.previousPos = ranking.pos;
    });

    // Save snapshot
    await saveRankingsSnapshot(modifiedRankings, snapshotDate, gender);
    snapshotsCreated++;

    // Show progress every 10 days
    if (snapshotsCreated % 10 === 0) {
      console.log(`  ✓ Created ${snapshotsCreated} daily snapshots...`);
    }
  }

  console.log(`  ✓ Completed: ${snapshotsCreated} daily snapshots for ${gender}'s rugby`);
}

async function main() {
  const args = process.argv.slice(2);
  const daysArg = args[0] ? parseInt(args[0]) : 90;

  console.log('=== Daily Historical Rankings Backfill ===');
  console.log(`Creating daily snapshots for the last ${daysArg} days...\n`);

  try {
    await backfillDailyData('men', daysArg);
    await backfillDailyData('women', daysArg);

    console.log('\n✅ Daily backfill completed successfully!');
    console.log(`\nCreated ${daysArg + 1} data points per team for smoother charts.`);
    console.log('\nView at:');
    console.log('  - http://localhost:3000/men/history');
    console.log('  - http://localhost:3000/women/history');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  }
}

main();
