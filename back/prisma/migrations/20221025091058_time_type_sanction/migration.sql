-- CreateEnum
CREATE TYPE "PenaltyTimeType" AS ENUM ('PERM', 'TEMP');

-- AlterTable
ALTER TABLE "ChatPenalty" ADD COLUMN     "timetype" "PenaltyTimeType" NOT NULL DEFAULT 'PERM';
