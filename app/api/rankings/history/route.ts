import { NextRequest, NextResponse } from 'next/server';
import {
  getHistoricalRankings,
  getTeamHistory,
  getSnapshotDates,
  getRankingsAtDate,
  getLatestSnapshotDate,
  getRankedTeams
} from '@/lib/db/rankings';
import { Gender } from '@/types';

// Cache responses for 5 minutes
export const revalidate = 300;

/**
 * GET /api/rankings/history
 * Get historical rankings data
 *
 * Query params:
 * - gender: men|women (required)
 * - action: list|dates|teams|latest (default: list)
 * - teamId: specific team ID (for team history)
 * - startDate: YYYY-MM-DD
 * - endDate: YYYY-MM-DD
 * - date: YYYY-MM-DD (for specific date rankings)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gender = searchParams.get('gender') as Gender;
    const action = searchParams.get('action') || 'list';
    const teamId = searchParams.get('teamId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const dateStr = searchParams.get('date');

    // Validate gender
    if (!gender || (gender !== 'men' && gender !== 'women')) {
      return NextResponse.json(
        { error: 'Valid gender parameter (men|women) is required' },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'dates':
        // Get all snapshot dates
        const dates = await getSnapshotDates(gender);
        return NextResponse.json({ dates });

      case 'teams':
        // Get all ranked teams
        const teams = await getRankedTeams(gender);
        return NextResponse.json({ teams });

      case 'latest':
        // Get latest snapshot date
        const latestDate = await getLatestSnapshotDate(gender);
        return NextResponse.json({ date: latestDate });

      case 'atDate':
        // Get rankings at specific date
        if (!dateStr) {
          return NextResponse.json(
            { error: 'date parameter is required for atDate action' },
            { status: 400 }
          );
        }
        const specificDate = new Date(dateStr);
        const rankingsAtDate = await getRankingsAtDate(gender, specificDate);
        return NextResponse.json({ rankings: rankingsAtDate, date: specificDate });

      case 'team':
        // Get team history
        if (!teamId) {
          return NextResponse.json(
            { error: 'teamId parameter is required for team action' },
            { status: 400 }
          );
        }
        const startDate = startDateStr ? new Date(startDateStr) : undefined;
        const endDate = endDateStr ? new Date(endDateStr) : undefined;
        const teamHistory = await getTeamHistory(teamId, gender, startDate, endDate);
        return NextResponse.json({ history: teamHistory });

      case 'list':
      default:
        // Get historical rankings for date range
        if (!startDateStr || !endDateStr) {
          return NextResponse.json(
            { error: 'startDate and endDate parameters are required' },
            { status: 400 }
          );
        }
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);

        // Optional: filter by specific teams for better performance
        const teamIdsParam = searchParams.get('teamIds');
        const teamIds = teamIdsParam ? teamIdsParam.split(',') : undefined;

        const rankings = await getHistoricalRankings(gender, start, end, teamIds);

        const response = NextResponse.json({ rankings });
        // Cache in browser for 5 minutes, serve stale content for 10 minutes while revalidating
        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        return response;
    }
  } catch (error) {
    console.error('Error fetching historical rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical rankings' },
      { status: 500 }
    );
  }
}
