import { ChatRoom, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    createRoom(owner: User): Promise<ChatRoom>;
}
