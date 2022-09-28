-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnChatRoom" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,

    CONSTRAINT "UserOnChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_name_key" ON "ChatRoom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_userId_key" ON "ChatRoom"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOnChatRoom_userId_key" ON "UserOnChatRoom"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOnChatRoom_chatRoomId_key" ON "UserOnChatRoom"("chatRoomId");

-- AddForeignKey
ALTER TABLE "UserOnChatRoom" ADD CONSTRAINT "UserOnChatRoom_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnChatRoom" ADD CONSTRAINT "UserOnChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
