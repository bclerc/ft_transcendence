import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    private readonly jwtService;
    server: any;
    logger: Logger;
    onlineUsers: Map<String, User>;
    constructor(userService: UserService, jwtService: JwtService);
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    handleMessage(client: Socket, payload: any, message: string): Promise<void>;
}
