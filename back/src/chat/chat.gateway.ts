import { Inject, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { UserService } from 'src/user/user.service';

@WebSocketGateway(81, { cors: {origin: '*'} })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    logger: Logger = new Logger('ChatGateway');
    onlineUsers: Map<String, User> = new Map(); 

   constructor (
    @Inject(UserService) private readonly userService: UserService
  , @Inject(JwtService) private readonly jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.query['token'] as string;
      const res = this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret: jwtConstants.secret,
      });
      const user = await this.userService.findOne(res.sub);
      this.logger.log('User ' + user.intra_name + ' connected');
      this.server.emit('connected', 'User ' + user.intra_name + ' connected');
      this.onlineUsers.set(socket.id, user);
    } catch (error) {
       console.log(error);
        socket.emit('error_notif', 'Server: Error: ' + error);
        socket.disconnect(true);
      }
      
   }

    async handleDisconnect(socket: Socket) {
        const user = this.onlineUsers.get(socket.id);
        this.logger.log('User ' + user.intra_name + ' disconnected');
        this.server.emit('message', 'User ' + user.intra_name + ' disconnected');
        this.onlineUsers.delete(socket.id);
    }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, payload: any, @MessageBody() message: string) {
    console.log('Message received: ' + message);
    const user = await this.onlineUsers.get(client.id);
    this.server.emit('message',  user.intra_name + ': ' + message);
  }
}
