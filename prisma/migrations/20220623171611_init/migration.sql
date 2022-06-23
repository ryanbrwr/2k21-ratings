/*
  Warnings:

  - Added the required column `team` to the `Prisma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prisma" ADD COLUMN     "team" TEXT NOT NULL;
