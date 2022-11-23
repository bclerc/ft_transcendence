import { UserI } from "src/app/models/user.models";
import { ChatRoom } from "src/app/services/chat/chatRoom.interface";

export enum PenaltyType {
  MUTE = "MUTE",
  BAN = "BAN",
}

export interface newPenalty {
   target: UserI;
   room: ChatRoom;
   penalty: PenaltyType;
}