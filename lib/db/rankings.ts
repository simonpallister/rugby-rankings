import { prisma } from './client';
import { Gender as PrismaGender } from '../generated/prisma';
import { Ranking, Gender } from '@/types';

/**
 * Convert our Gender type to Prisma's Gender enum
 */
function toPrismaGender(gender: Gender): PrismaGender {
  return gender === 'men' ? PrismaGender.MEN : PrismaGender.WOMEN;
}

/**
 * Save current rankings as a historical snapshot
 */
export async function saveRankingsSnapshot(
  rankings: Ranking[],
  effectiveDate: Date,
  gender: Gender
) {
  const prismaGender = toPrismaGender(gender);

  // Save all rankings in a transaction
  await prisma.$transaction(
    rankings.map((ranking) =>
      prisma.historicalRanking.upsert({
        where: {
          teamId_effectiveDate_gender: {
            teamId: ranking.team.id,
            effectiveDate,
            gender: prismaGender,
          },
        },
        update: {
          teamName: ranking.team.name,
          abbreviation: ranking.team.abbreviation,
          points: ranking.pts,
          position: ranking.pos,
        },
        create: {
          teamId: ranking.team.id,
          teamName: ranking.team.name,
          abbreviation: ranking.team.abbreviation,
          points: ranking.pts,
          position: ranking.pos,
          effectiveDate,
          gender: prismaGender,
        },
      })
    )
  );

  return { success: true, count: rankings.length };
}

/**
 * Get historical rankings for a date range
 * Optionally filter by specific team IDs for better performance
 */
export async function getHistoricalRankings(
  gender: Gender,
  startDate: Date,
  endDate: Date,
  teamIds?: string[]
) {
  const prismaGender = toPrismaGender(gender);

  const where: any = {
    gender: prismaGender,
    effectiveDate: {
      gte: startDate,
      lte: endDate,
    },
  };

  // Filter by specific teams if provided (significantly reduces result set)
  if (teamIds && teamIds.length > 0) {
    where.teamId = { in: teamIds };
  }

  const rankings = await prisma.historicalRanking.findMany({
    where,
    orderBy: [{ effectiveDate: 'asc' }, { position: 'asc' }],
  });

  return rankings;
}

/**
 * Get historical rankings for a specific team
 */
export async function getTeamHistory(
  teamId: string,
  gender: Gender,
  startDate?: Date,
  endDate?: Date
) {
  const prismaGender = toPrismaGender(gender);

  const where: any = {
    teamId,
    gender: prismaGender,
  };

  if (startDate || endDate) {
    where.effectiveDate = {};
    if (startDate) where.effectiveDate.gte = startDate;
    if (endDate) where.effectiveDate.lte = endDate;
  }

  const rankings = await prisma.historicalRanking.findMany({
    where,
    orderBy: { effectiveDate: 'asc' },
  });

  return rankings;
}

/**
 * Get all unique dates with ranking snapshots
 */
export async function getSnapshotDates(gender: Gender) {
  const prismaGender = toPrismaGender(gender);

  const dates = await prisma.historicalRanking.findMany({
    where: { gender: prismaGender },
    select: { effectiveDate: true },
    distinct: ['effectiveDate'],
    orderBy: { effectiveDate: 'desc' },
  });

  return dates.map((d) => d.effectiveDate);
}

/**
 * Get rankings for a specific date
 */
export async function getRankingsAtDate(gender: Gender, date: Date) {
  const prismaGender = toPrismaGender(gender);

  const rankings = await prisma.historicalRanking.findMany({
    where: {
      gender: prismaGender,
      effectiveDate: date,
    },
    orderBy: { position: 'asc' },
  });

  return rankings;
}

/**
 * Get the most recent snapshot date
 */
export async function getLatestSnapshotDate(gender: Gender) {
  const prismaGender = toPrismaGender(gender);

  const latest = await prisma.historicalRanking.findFirst({
    where: { gender: prismaGender },
    orderBy: { effectiveDate: 'desc' },
    select: { effectiveDate: true },
  });

  return latest?.effectiveDate || null;
}

/**
 * Get all teams that have been ranked, ordered by their latest position
 */
export async function getRankedTeams(gender: Gender) {
  const prismaGender = toPrismaGender(gender);

  // Get the most recent snapshot date
  const latestDate = await getLatestSnapshotDate(gender);

  if (!latestDate) {
    return [];
  }

  // Get teams from the latest snapshot, ordered by position
  const teams = await prisma.historicalRanking.findMany({
    where: {
      gender: prismaGender,
      effectiveDate: latestDate,
    },
    select: {
      teamId: true,
      teamName: true,
      abbreviation: true,
    },
    orderBy: { position: 'asc' }, // Order by ranking position
  });

  return teams;
}
