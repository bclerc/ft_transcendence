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
