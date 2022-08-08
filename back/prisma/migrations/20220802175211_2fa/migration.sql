/*
  Warnings:

  - A unique constraint covering the columns `[twoFactorAuthenticationSecret]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorAuthenticationSecret" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_twoFactorAuthenticationSecret_key" ON "User"("twoFactorAuthenticationSecret");
