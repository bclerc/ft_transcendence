-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "intra_name" TEXT NOT NULL,
    "displayname" TEXT,
    "description" TEXT,
    "password" TEXT NOT NULL,
    "admin" BOOLEAN DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_intra_name_key" ON "User"("intra_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_displayname_key" ON "User"("displayname");
