import { User } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { SubscribeRoomDto } from 'src/chat/dto/subscribe-room.dto';
import { MessageI, newChatRoomI } from 'src/chat/interfaces/chatRoom.interface';
import { EjectRoomI } from 'src/eject-room-i.interface';
import { DemoteUserI, PromoteUserI } from 'src/promote-user-i.interface';
import { UserService } from 'src/user/user.service';
export declare class WschatService {
    private chatService;
    private userService;
    onlineUsers: Map<String, User>;
    server: any;
    constructor(chatService: ChatService, userService: UserService);
    initUser(socketId: string, user: User): Promise<void>;
    subscribeToRoom(socketId: string, subRoom: SubscribeRoomDto): Promise<void>;
    ejectUserFromRoom(socketId: string, room: EjectRoomI): Promise<void>;
    promoteUser(socketId: string, event: PromoteUserI): Promise<void>;
    demoteUser(socketId: string, event: DemoteUserI): Promise<void>;
    newMessage(socketId: string, message: MessageI): Promise<void>;
    newRoom(socketId: string, room: newChatRoomI): Promise<void>;
    leaveRoom(socketId: string, roomId: number): Promise<void>;
    updateUserRooms(user: User): Promise<void>;
    updateRoomForUsersInRoom(roomId: number): Promise<void>;
    sendToUser(user: User, prefix: string, data: any): void;
    sendToUsersInRoom(roomId: number, prefix: string, data: any): Promise<void>;
    getOnlineUsers(): Map<String, User>;
    addOnlineUser(socketId: string, user: User): void;
    removeOnlineUser(socketId: string): void;
}
