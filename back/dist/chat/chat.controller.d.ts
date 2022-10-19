import { ChatRoom } from '@prisma/client';
import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getRooms(req: any): Promise<ChatRoom[]>;
    joinRoom(req: any, id: number): Promise<ChatRoom>;
    leaveRoom(req: any, id: number): Promise<ChatRoom>;
    getPublicRooms(): Promise<ChatRoom[]>;
}
