-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "password" TEXT,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;
