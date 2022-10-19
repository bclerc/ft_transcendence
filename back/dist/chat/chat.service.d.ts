import { ChatRoom, Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomI, MessageI, newChatRoomI } from './interfaces/chatRoom.interface';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    newMessage(message: MessageI): Promise<void>;
    getRoomsFromUser(userId: number): Promise<ChatRoom[]>;
    getPublicRooms(): Promise<ChatRoom[]>;
    getMessagesFromRoom(room: ChatRoom): Promise<Message[]>;
    getMessagesFromRoomId(roomId: number): Promise<Message[]>;
    createRoom(owner: User, newRoom: newChatRoomI): Promise<ChatRoom>;
    getRoomById(roomId: number): Promise<ChatRoomI>;
    canJoin(roomId: number, password: string): Promise<boolean>;
    addUsersToRoom(roomId: number, userId: number): Promise<ChatRoom>;
    addAdminsToRoom(roomId: number, userId: number): Promise<ChatRoom>;
    removeAdminsFromRoom(roomId: number, userId: number): Promise<ChatRoom>;
    removeUsersFromRoom(roomId: number, userId: number): Promise<any>;
    editRoom(roomId: number, newRoom: newChatRoomI): Promise<ChatRoom>;
}
