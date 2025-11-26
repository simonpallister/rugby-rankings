/**
 * Script to snapshot current World Rugby rankings to the database
 *
 * World Rugby updates rankings every Monday (UTC) after international matches.
 * Run this script weekly on Mondays to capture updated rankings.
 *
 * Recommended schedule: Mondays at 12:00 UTC via cron
 * Cron expression: 0 12 * * 1
 *
 * Usage:
 *   npm run snapshot           # Snapshot both men's and women's
 *   npm run snapshot men       # Men's only
 *   npm run snapshot women     # Women's only
 */

import 'dotenv/config';
import { fetchRankings } from '../lib/api.js';
import { saveRankingsSnapshot } from '../lib/db/rankings.js';
import { Gender } from '../types/index.js';

async function snapshotRankings(gender: Gender) {
  console.log(`Fetching ${gender}'s rankings...`);

  try {
    const { rankings, effectiveTime } = await fetchRankings(gender);

    console.log(`  Found ${rankings.length} teams`);
    console.log(`  Raw effective time: ${effectiveTime}`);

    // Parse the effective time - it might already be a Date object or an ISO string
    let effectiveDate: Date;
    if (effectiveTime instanceof Date) {
      effectiveDate = effectiveTime;
    } else if (typeof effectiveTime === 'string') {
      effectiveDate = new Date(effectiveTime);
    } else {
      // If it's a timestamp in milliseconds
      effectiveDate = new Date(Number(effectiveTime));
    }

    if (isNaN(effectiveDate.getTime())) {
      throw new Error(`Invalid effective time: ${effectiveTime}`);
    }

    console.log(`  Effective date: ${effectiveDate.toISOString()}`);

    const result = await saveRankingsSnapshot(rankings, effectiveDate, gender);

    console.log(`  ✓ Saved ${result.count} ${gender}'s rankings to database`);
    return result;
  } catch (error) {
    console.error(`  ✗ Error saving ${gender}'s rankings:`, error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const genderArg = args[0] as Gender | undefined;

  console.log('=== Rugby Rankings Snapshot ===');
  console.log(`Time: ${new Date().toISOString()}\n`);

  try {
    if (genderArg === 'men' || genderArg === 'women') {
      await snapshotRankings(genderArg);
    } else {
      // Snapshot both
      await snapshotRankings('men');
      await snapshotRankings('women');
    }

    console.log('\n✓ Snapshot completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Snapshot failed:', error);
    process.exit(1);
  }
}

main();
