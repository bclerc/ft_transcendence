import { User } from "@prisma/client";
import { ChatRoomI } from "./chatRoom.interface";

export interface EjectRoomI {
  roomId: number;
  targetId: number;
}
