import { UserI } from "src/app/models/user.models";
import { Message } from "./message.interface";

export interface ChatRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  messages?: Message[];
  ownerId?: number;
  admins?: UserI[];
  public?: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatRoomI {
  id: number;
  name: string;
  description: string;
  users: UserI[];
  admins: UserI[];
  public: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}