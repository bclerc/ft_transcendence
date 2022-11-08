/*
  Warnings:

  - You are about to drop the column `GameID` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "GameID",
ADD COLUMN     "gameID" INTEGER NOT NULL DEFAULT 0;
