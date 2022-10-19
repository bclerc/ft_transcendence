import { User } from "@prisma/client";
import { ChatRoomI } from "./chat/interfaces/chatRoom.interface";

export interface EjectRoomI {
  roomId: number;
  targetId: number;
}
