-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('WAITING', 'STARTED', 'ENDED');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "state" "GameState" NOT NULL DEFAULT 'WAITING',
    "winnerId" INTEGER,
    "loserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_gameUserRelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_gameUserRelation_AB_unique" ON "_gameUserRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_gameUserRelation_B_index" ON "_gameUserRelation"("B");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gameUserRelation" ADD CONSTRAINT "_gameUserRelation_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gameUserRelation" ADD CONSTRAINT "_gameUserRelation_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
