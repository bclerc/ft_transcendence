import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class MessageService {
    private prisa;
    constructor(prisa: PrismaService);
    newMessage(message: Message): Promise<Message>;
    getMessagesFromRoom(roomId: number): Promise<Message[]>;
}
