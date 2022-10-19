/*
  Warnings:

  - Added the required column `ownerId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "ownerId" INTEGER NOT NULL;
