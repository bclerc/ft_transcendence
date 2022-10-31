import { Message, User } from "@prisma/client";
import { BasicUserI } from "src/user/interface/basicUser.interface";

export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: BasicUserI[];
  messages?: Message[];
  created_date?: Date;
  updatedAt?: Date;
}


export interface newChatRoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: BasicUserI[];
  public?: boolean;
  password?: string;
}

export interface ChatRoomI {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  users: BasicUserI[];
  admins: BasicUserI[];
  public: Boolean;
  messages?: Message[];
}

export interface DmChatRoomI {
  id: number;
  name: string;
  ownerId: number;
  users: BasicUserI[];
  messages?: Message[];
}

export interface MessageI {
  id: number;
  content: string;
  user: User;
  room: ChatRoomI;
}