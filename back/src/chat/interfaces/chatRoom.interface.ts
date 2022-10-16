import { Message, User } from "@prisma/client";

export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: User[];
  messages?: Message[];
  created_date?: Date;
  updatedAt?: Date;
}

export interface newChatRoomI {
  name?: string;
  description?: string;
  users?: User[];
}

export interface ChatRoomI {
  id: number;
  name: string;
  description: string;
  users: User[];
  messages: Message[];
}

export interface ChatRoomUserI {
  UserI: User;
  room: ChatRoom;
  isAdmin: boolean;
  isMuted: boolean;
}

export interface MessageI {
  id: number;
  content: string;
  user: User;
  room: ChatRoomI;
}