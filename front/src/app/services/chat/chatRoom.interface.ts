import { UserI } from "src/app/models/user.models";
import { Message } from "./message.interface";

export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  messages?: Message[];
  ownerId?: number;
  created_at?: Date;
  updatedAt?: Date;
}

export interface ChatRoomI {
  id: number;
  name: string;
  description: string;
  users: UserI[];
  created_date: Date;
  updatedAt: Date;
}