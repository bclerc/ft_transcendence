/*
  Warnings:

  - You are about to drop the column `elo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `staff` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('ONLINE', 'OFFLINE', 'UNAVAILABLE', 'QUEUED', 'INGAME');

-- CreateEnum
CREATE TYPE "PenaltyType" AS ENUM ('MUTE', 'BAN');

-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "elo",
DROP COLUMN "staff",
ADD COLUMN     "state" "UserState" NOT NULL DEFAULT 'OFFLINE';

-- CreateTable
CREATE TABLE "ChatPenalty" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "type" "PenaltyType" NOT NULL DEFAULT 'MUTE',
    "time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatPenalty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatPenalty" ADD CONSTRAINT "ChatPenalty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatPenalty" ADD CONSTRAINT "ChatPenalty_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
