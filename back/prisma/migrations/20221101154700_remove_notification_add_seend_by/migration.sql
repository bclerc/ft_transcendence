/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropTable
DROP TABLE "Notification";

-- CreateTable
CREATE TABLE "_messageSeenBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_messageSeenBy_AB_unique" ON "_messageSeenBy"("A", "B");

-- CreateIndex
CREATE INDEX "_messageSeenBy_B_index" ON "_messageSeenBy"("B");

-- AddForeignKey
ALTER TABLE "_messageSeenBy" ADD CONSTRAINT "_messageSeenBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_messageSeenBy" ADD CONSTRAINT "_messageSeenBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
