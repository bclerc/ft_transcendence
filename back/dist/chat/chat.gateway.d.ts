import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatRoom, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { newChatRoomI } from './interfaces/chatRoom.interface';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    private readonly jwtService;
    private readonly chatService;
    server: any;
    logger: Logger;
    onlineUsers: Map<String, User>;
    constructor(userService: UserService, jwtService: JwtService, chatService: ChatService);
    handleConnection(socket: Socket): Promise<any>;
    handleDisconnect(socket: Socket): Promise<void>;
    handleMessage(client: Socket, payload: any, message: string): Promise<void>;
    onCreateRoom(client: Socket, payload: any, newRoom: newChatRoomI): Promise<void>;
    onJoinRoom(client: Socket, payload: any, room: ChatRoom): Promise<void>;
}
