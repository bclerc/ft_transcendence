
import { UserI } from "src/app/models/user.models";
import { Message } from "./message.interface";
export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  type?: ChatRoomType;
  messages?: Message[];
  penalities?: any[];
  ownerId?: number;
  admins?: UserI[];
  public?: boolean;
  seen?: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface newRoom {
  name: string;
  description: string;
  users: UserI[];
  public: boolean;
  password?: string;
}

export interface ChatRoomI {
  id: number;
  name: string;
  description: string;
  type: ChatRoomType;
  users: UserI[];
  ownerId: number;
  admins: UserI[];
  penalities?: any[];
  public: boolean;
  seen?: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditRoomI {
  user: UserI;
  room: ChatRoomI;
}

export enum ChatRoomType {
  DM = "DM",
  GROUP = "GROUP",
}
