import { ChatRoom, Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { newChatRoomI } from './interfaces/chatRoom.interface';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getRoomsFromUser(userId: number): Promise<ChatRoom[]>;
    getMessagesFromRoom(room: ChatRoom): Promise<Message[]>;
    createRoom(owner: User, newRoom: newChatRoomI): Promise<ChatRoom>;
    addUsersToRoom(roomId: number, userId: number): Promise<ChatRoom>;
    removeUsersFromRoom(roomId: number, userId: number): Promise<ChatRoom>;
}
