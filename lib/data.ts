import { Ranking, Team } from "@/types";

/**
 * Sample World Rugby rankings data
 * This is placeholder data - in production, this would be fetched from the World Rugby API
 */
export const sampleRankings: Ranking[] = [
  {
    team: { id: "IRE", name: "Ireland", abbreviation: "IRE" },
    pts: 92.12,
    pos: 1,
    previousPts: 92.12,
    previousPos: 1,
  },
  {
    team: { id: "RSA", name: "South Africa", abbreviation: "RSA" },
    pts: 91.77,
    pos: 2,
    previousPts: 91.77,
    previousPos: 2,
  },
  {
    team: { id: "NZL", name: "New Zealand", abbreviation: "NZL" },
    pts: 88.70,
    pos: 3,
    previousPts: 88.70,
    previousPos: 3,
  },
  {
    team: { id: "FRA", name: "France", abbreviation: "FRA" },
    pts: 87.46,
    pos: 4,
    previousPts: 87.46,
    previousPos: 4,
  },
  {
    team: { id: "ENG", name: "England", abbreviation: "ENG" },
    pts: 85.40,
    pos: 5,
    previousPts: 85.40,
    previousPos: 5,
  },
  {
    team: { id: "ARG", name: "Argentina", abbreviation: "ARG" },
    pts: 84.30,
    pos: 6,
    previousPts: 84.30,
    previousPos: 6,
  },
  {
    team: { id: "SCO", name: "Scotland", abbreviation: "SCO" },
    pts: 82.82,
    pos: 7,
    previousPts: 82.82,
    previousPos: 7,
  },
  {
    team: { id: "ITA", name: "Italy", abbreviation: "ITA" },
    pts: 79.98,
    pos: 8,
    previousPts: 79.98,
    previousPos: 8,
  },
  {
    team: { id: "AUS", name: "Australia", abbreviation: "AUS" },
    pts: 79.85,
    pos: 9,
    previousPts: 79.85,
    previousPos: 9,
  },
  {
    team: { id: "FJI", name: "Fiji", abbreviation: "FJI" },
    pts: 78.61,
    pos: 10,
    previousPts: 78.61,
    previousPos: 10,
  },
  {
    team: { id: "WAL", name: "Wales", abbreviation: "WAL" },
    pts: 75.04,
    pos: 11,
    previousPts: 75.04,
    previousPos: 11,
  },
  {
    team: { id: "GEO", name: "Georgia", abbreviation: "GEO" },
    pts: 73.49,
    pos: 12,
    previousPts: 73.49,
    previousPos: 12,
  },
  {
    team: { id: "SAM", name: "Samoa", abbreviation: "SAM" },
    pts: 71.24,
    pos: 13,
    previousPts: 71.24,
    previousPos: 13,
  },
  {
    team: { id: "JPN", name: "Japan", abbreviation: "JPN" },
    pts: 70.02,
    pos: 14,
    previousPts: 70.02,
    previousPos: 14,
  },
  {
    team: { id: "POR", name: "Portugal", abbreviation: "POR" },
    pts: 68.36,
    pos: 15,
    previousPts: 68.36,
    previousPos: 15,
  },
  {
    team: { id: "USA", name: "USA", abbreviation: "USA" },
    pts: 66.12,
    pos: 16,
    previousPts: 66.12,
    previousPos: 16,
  },
  {
    team: { id: "URU", name: "Uruguay", abbreviation: "URU" },
    pts: 65.45,
    pos: 17,
    previousPts: 65.45,
    previousPos: 17,
  },
  {
    team: { id: "ESP", name: "Spain", abbreviation: "ESP" },
    pts: 64.88,
    pos: 18,
    previousPts: 64.88,
    previousPos: 18,
  },
  {
    team: { id: "TON", name: "Tonga", abbreviation: "TON" },
    pts: 64.16,
    pos: 19,
    previousPts: 64.16,
    previousPos: 19,
  },
  {
    team: { id: "CHI", name: "Chile", abbreviation: "CHI" },
    pts: 61.23,
    pos: 20,
    previousPts: 61.23,
    previousPos: 20,
  },
];

export const allTeams: Team[] = sampleRankings.map((r) => r.team);
