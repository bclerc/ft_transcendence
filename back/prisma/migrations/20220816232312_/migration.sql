/*
  Warnings:

  - You are about to drop the column `blabla` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_avatar_url_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blabla",
ALTER COLUMN "avatar_url" SET DEFAULT 'https://static.cnews.fr/sites/default/files/styles/image_750_422/public/raw_62c3e2f1a9694_0.jpg';

-- DropTable
DROP TABLE "Todo";
