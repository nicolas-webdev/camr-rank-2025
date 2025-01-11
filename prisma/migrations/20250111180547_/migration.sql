/*
  Warnings:

  - A unique constraint covering the columns `[previousVersionId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the new nullable columns
ALTER TABLE "Game" ADD COLUMN "updatedAt" TIMESTAMP(3);
ALTER TABLE "Game" ADD COLUMN "createdAt" TIMESTAMP(3);
ALTER TABLE "Game" ADD COLUMN "createdById" TEXT;
ALTER TABLE "Game" ADD COLUMN "updatedById" TEXT;
ALTER TABLE "Game" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Game" ADD COLUMN "deletedById" TEXT;
ALTER TABLE "Game" ADD COLUMN "isDeleted" BOOLEAN;
ALTER TABLE "Game" ADD COLUMN "previousVersionId" TEXT;

-- Update existing records with default values
UPDATE "Game"
SET "updatedAt" = NOW(),
    "createdAt" = NOW(),
    "createdById" = (SELECT id FROM "User" WHERE "isAdmin" = true LIMIT 1),
    "isDeleted" = false;

-- Now make the columns required where needed
ALTER TABLE "Game" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "Game" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "Game" ALTER COLUMN "createdById" SET NOT NULL;
ALTER TABLE "Game" ALTER COLUMN "isDeleted" SET NOT NULL;

-- Add the relations
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Game" ADD CONSTRAINT "Game_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Game" ADD CONSTRAINT "Game_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Game" ADD CONSTRAINT "Game_previousVersionId_fkey" FOREIGN KEY ("previousVersionId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add unique constraint for version history
CREATE UNIQUE INDEX "Game_previousVersionId_key" ON "Game"("previousVersionId");
