/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "isHanchan" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rank" TEXT NOT NULL DEFAULT '新人',
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
