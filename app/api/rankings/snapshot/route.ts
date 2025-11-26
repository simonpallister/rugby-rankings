import { NextRequest, NextResponse } from 'next/server';
import { fetchRankings } from '@/lib/api';
import { saveRankingsSnapshot } from '@/lib/db/rankings';
import { Gender } from '@/types';

/**
 * POST /api/rankings/snapshot
 * Save current rankings as a historical snapshot
 * Query params: ?gender=men|women
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gender = (searchParams.get('gender') || 'men') as Gender;

    // Validate gender
    if (gender !== 'men' && gender !== 'women') {
      return NextResponse.json(
        { error: 'Invalid gender parameter' },
        { status: 400 }
      );
    }

    // Fetch current rankings from World Rugby API
    const { rankings, effectiveTime } = await fetchRankings(gender);
    const effectiveDate = new Date(effectiveTime);

    // Save to database
    const result = await saveRankingsSnapshot(rankings, effectiveDate, gender);

    return NextResponse.json({
      success: true,
      message: `Saved ${result.count} ${gender}'s rankings`,
      effectiveDate: effectiveDate.toISOString(),
    });
  } catch (error) {
    console.error('Error saving rankings snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to save rankings snapshot' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rankings/snapshot
 * Trigger snapshot for both men's and women's rankings
 */
export async function GET() {
  try {
    const results = await Promise.allSettled([
      // Save men's rankings
      (async () => {
        const { rankings, effectiveTime } = await fetchRankings('men');
        return saveRankingsSnapshot(rankings, new Date(effectiveTime), 'men');
      })(),
      // Save women's rankings
      (async () => {
        const { rankings, effectiveTime } = await fetchRankings('women');
        return saveRankingsSnapshot(rankings, new Date(effectiveTime), 'women');
      })(),
    ]);

    const menResult = results[0];
    const womenResult = results[1];

    return NextResponse.json({
      success: true,
      men: menResult.status === 'fulfilled' ? menResult.value : { error: menResult.reason },
      women: womenResult.status === 'fulfilled' ? womenResult.value : { error: womenResult.reason },
    });
  } catch (error) {
    console.error('Error in snapshot GET:', error);
    return NextResponse.json(
      { error: 'Failed to save snapshots' },
      { status: 500 }
    );
  }
}
