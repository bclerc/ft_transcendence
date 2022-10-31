import { User, UserI } from "src/app/models/user.models";
import { ChatRoom } from "./chatRoom.interface";

export interface Message {
  id?: number;
  content?: string;
  user: UserI;
  room: ChatRoom;
  createdAt?: Date;
  updatedAt?: Date;
}
