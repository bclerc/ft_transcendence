/*
  Warnings:

  - You are about to drop the column `time` on the `ChatPenalty` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `ChatPenalty` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatRoomType" AS ENUM ('GROUP', 'DM');

-- AlterTable
ALTER TABLE "ChatPenalty" DROP COLUMN "time",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "type" "ChatRoomType" NOT NULL DEFAULT 'DM';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";
