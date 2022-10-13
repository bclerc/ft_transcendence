import { User } from "src/app/models/user.models";
import { ChatRoom } from "./chatRoom.interface";

export interface Message {
  id?: number;
  content?: string;
  user: User;
  room: ChatRoom;
  created_at?: Date;
  updatedAt?: Date;
}