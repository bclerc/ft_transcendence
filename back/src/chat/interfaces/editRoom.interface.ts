import { ChatRoom } from "@prisma/client";


export interface EditChatRoomI {
  userId: number;
  room: ChatRoom
}