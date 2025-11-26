/**
 * Backfill script to create sample historical data
 * This generates variations of current rankings for past dates
 * so you can visualize the historical rankings chart
 *
 * Usage: npm run backfill
 */

import 'dotenv/config';
import { fetchRankings } from '../lib/api.js';
import { saveRankingsSnapshot } from '../lib/db/rankings.js';
import { Gender } from '../types/index.js';

async function backfillSampleData(gender: Gender, daysBack: number = 90) {
  console.log(`\nBackfilling ${gender}'s rankings for the last ${daysBack} days...`);

  // Fetch current rankings as baseline
  const { rankings } = await fetchRankings(gender);
  console.log(`  Using ${rankings.length} teams as baseline`);

  // Generate snapshots for past dates (weekly)
  const today = new Date();
  const snapshotsToCreate = Math.floor(daysBack / 7); // Weekly snapshots

  for (let i = 0; i < snapshotsToCreate; i++) {
    const daysAgo = (snapshotsToCreate - i) * 7;
    const snapshotDate = new Date(today);
    snapshotDate.setDate(snapshotDate.getDate() - daysAgo);

    // Create variations in the rankings to simulate changes over time
    const modifiedRankings = rankings.map((ranking, index) => {
      // Add some random variation to points (±2 points)
      const variation = (Math.random() - 0.5) * 4;
      const newPoints = ranking.pts + variation;

      return {
        ...ranking,
        pts: Math.max(0, newPoints), // Ensure non-negative
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
    console.log(`  ✓ Created snapshot for ${snapshotDate.toISOString().split('T')[0]} (${modifiedRankings.length} teams)`);
  }

  console.log(`✓ Backfill complete for ${gender}'s rugby`);
}

async function main() {
  console.log('=== Historical Rankings Backfill ===');
  console.log('Generating sample historical data...\n');

  try {
    await backfillSampleData('men', 90);
    await backfillSampleData('women', 90);

    console.log('\n✅ Backfill completed successfully!');
    console.log('\nYou can now view the historical rankings at:');
    console.log('  - http://localhost:3000/men/history');
    console.log('  - http://localhost:3000/women/history');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  }
}

main();
