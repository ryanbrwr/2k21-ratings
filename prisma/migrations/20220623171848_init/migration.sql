/*
  Warnings:

  - You are about to drop the `Prisma` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Prisma";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "outside" INTEGER NOT NULL,
    "inside" INTEGER NOT NULL,
    "defending" INTEGER NOT NULL,
    "athleticism" INTEGER NOT NULL,
    "playmaking" INTEGER NOT NULL,
    "rebounding" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "closeShot" INTEGER NOT NULL,
    "midRangeShot" INTEGER NOT NULL,
    "threePointShot" INTEGER NOT NULL,
    "freeThrow" INTEGER NOT NULL,
    "shotIQ" INTEGER NOT NULL,
    "offensiveConsistency" INTEGER NOT NULL,
    "layup" INTEGER NOT NULL,
    "standingDunk" INTEGER NOT NULL,
    "drivingDunk" INTEGER NOT NULL,
    "postHook" INTEGER NOT NULL,
    "postFade" INTEGER NOT NULL,
    "postControl" INTEGER NOT NULL,
    "drawFoul" INTEGER NOT NULL,
    "hands" INTEGER NOT NULL,
    "interiorDefense" INTEGER NOT NULL,
    "perimeterDefense" INTEGER NOT NULL,
    "steal" INTEGER NOT NULL,
    "block" INTEGER NOT NULL,
    "lateralQuickness" INTEGER NOT NULL,
    "helpDefenseIQ" INTEGER NOT NULL,
    "passPerception" INTEGER NOT NULL,
    "defensiveConsistency" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "acceleration" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "vertical" INTEGER NOT NULL,
    "stamina" INTEGER NOT NULL,
    "hustle" INTEGER NOT NULL,
    "overallDurability" INTEGER NOT NULL,
    "passAccuracy" INTEGER NOT NULL,
    "ballHandle" INTEGER NOT NULL,
    "speedWithBall" INTEGER NOT NULL,
    "passIQ" INTEGER NOT NULL,
    "passVision" INTEGER NOT NULL,
    "offensiveRebound" INTEGER NOT NULL,
    "defensiveRebound" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
