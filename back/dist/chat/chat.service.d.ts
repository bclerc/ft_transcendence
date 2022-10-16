import { ChatRoom, Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageI, newChatRoomI } from './interfaces/chatRoom.interface';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    newMessage(message: MessageI): Promise<void>;
    getRoomsFromUser(userId: number): Promise<ChatRoom[]>;
    getMessagesFromRoom(room: ChatRoom): Promise<Message[]>;
    getMessagesFromRoomId(roomId: number): Promise<Message[]>;
    createRoom(owner: User, newRoom: newChatRoomI): Promise<ChatRoom>;
    getRoomById(roomId: number): Promise<ChatRoom>;
    addUsersToRoom(roomId: number, userId: number): Promise<ChatRoom>;
    removeUsersFromRoom(roomId: number, userId: number): Promise<ChatRoom>;
}
