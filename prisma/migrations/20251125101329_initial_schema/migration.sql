-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN');

-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('SIX_NATIONS', 'RUGBY_CHAMPIONSHIP');

-- CreateTable
CREATE TABLE "HistoricalRanking" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "position" INTEGER NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricalRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalFixture" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "homeTeamName" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "awayTeamName" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "isRwc" BOOLEAN NOT NULL DEFAULT false,
    "noHome" BOOLEAN NOT NULL DEFAULT false,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricalFixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaeburnShield" (
    "id" TEXT NOT NULL,
    "holderId" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "holderSince" TIMESTAMP(3) NOT NULL,
    "defenses" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RaeburnShield_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaeburnShieldHistory" (
    "id" TEXT NOT NULL,
    "holderId" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "acquiredDate" TIMESTAMP(3) NOT NULL,
    "acquiredMatchId" TEXT NOT NULL,
    "lostDate" TIMESTAMP(3),
    "lostMatchId" TEXT,
    "defenses" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaeburnShieldHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "type" "TournamentType" NOT NULL,
    "year" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentStanding" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "drawn" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "pointsFor" INTEGER NOT NULL DEFAULT 0,
    "pointsAgainst" INTEGER NOT NULL DEFAULT 0,
    "pointsDiff" INTEGER NOT NULL DEFAULT 0,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TournamentStanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentMatch" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "round" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShieldDefenses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShieldDefenses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "HistoricalRanking_gender_effectiveDate_idx" ON "HistoricalRanking"("gender", "effectiveDate");

-- CreateIndex
CREATE INDEX "HistoricalRanking_teamId_gender_idx" ON "HistoricalRanking"("teamId", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalRanking_teamId_effectiveDate_gender_key" ON "HistoricalRanking"("teamId", "effectiveDate", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalFixture_matchId_key" ON "HistoricalFixture"("matchId");

-- CreateIndex
CREATE INDEX "HistoricalFixture_gender_date_idx" ON "HistoricalFixture"("gender", "date");

-- CreateIndex
CREATE INDEX "HistoricalFixture_homeTeamId_gender_idx" ON "HistoricalFixture"("homeTeamId", "gender");

-- CreateIndex
CREATE INDEX "HistoricalFixture_awayTeamId_gender_idx" ON "HistoricalFixture"("awayTeamId", "gender");

-- CreateIndex
CREATE INDEX "RaeburnShield_gender_idx" ON "RaeburnShield"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "RaeburnShield_gender_isCurrent_key" ON "RaeburnShield"("gender", "isCurrent");

-- CreateIndex
CREATE INDEX "RaeburnShieldHistory_gender_acquiredDate_idx" ON "RaeburnShieldHistory"("gender", "acquiredDate");

-- CreateIndex
CREATE INDEX "RaeburnShieldHistory_holderId_gender_idx" ON "RaeburnShieldHistory"("holderId", "gender");

-- CreateIndex
CREATE INDEX "Tournament_gender_year_idx" ON "Tournament"("gender", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_type_year_gender_key" ON "Tournament"("type", "year", "gender");

-- CreateIndex
CREATE INDEX "TournamentStanding_tournamentId_position_idx" ON "TournamentStanding"("tournamentId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentStanding_tournamentId_teamId_key" ON "TournamentStanding"("tournamentId", "teamId");

-- CreateIndex
CREATE INDEX "TournamentMatch_tournamentId_idx" ON "TournamentMatch"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentMatch_tournamentId_fixtureId_key" ON "TournamentMatch"("tournamentId", "fixtureId");

-- CreateIndex
CREATE INDEX "_ShieldDefenses_B_index" ON "_ShieldDefenses"("B");

-- AddForeignKey
ALTER TABLE "RaeburnShieldHistory" ADD CONSTRAINT "RaeburnShieldHistory_lostMatchId_fkey" FOREIGN KEY ("lostMatchId") REFERENCES "HistoricalFixture"("matchId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentStanding" ADD CONSTRAINT "TournamentStanding_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentMatch" ADD CONSTRAINT "TournamentMatch_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentMatch" ADD CONSTRAINT "TournamentMatch_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "HistoricalFixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShieldDefenses" ADD CONSTRAINT "_ShieldDefenses_A_fkey" FOREIGN KEY ("A") REFERENCES "HistoricalFixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShieldDefenses" ADD CONSTRAINT "_ShieldDefenses_B_fkey" FOREIGN KEY ("B") REFERENCES "RaeburnShieldHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
