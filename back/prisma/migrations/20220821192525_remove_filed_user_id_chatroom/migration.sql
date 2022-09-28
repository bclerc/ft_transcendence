/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatRoom` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ChatRoom_userId_key";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "userId";
