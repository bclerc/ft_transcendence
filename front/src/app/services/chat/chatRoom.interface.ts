
import { type } from "os";
import { UserI } from "src/app/models/user.models";
import { Message } from "./message.interface";
export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  type?: ChatRoomType;
  messages?: Message[];
  ownerId?: number;
  admins?: UserI[];
  public?: boolean;
  seen?: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatRoomI {
  id: number;
  name: string;
  description: string;
  type: ChatRoomType;
  users: UserI[];
  admins: UserI[];
  public: boolean;
  seen?: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ChatRoomType {
  DM = "DM",
  GROUP = "GROUP",
}
