import { Inject, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatRoom, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { newChatRoomI } from './interfaces/chatRoom.interface';

@WebSocketGateway(81, { cors: {origin: '*'} } )
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    logger: Logger = new Logger('ChatGateway');
    onlineUsers: Map<String, User> = new Map(); 

   constructor (
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ChatService) private readonly chatService: ChatService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.query['token'] as string;
      const res = this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret: jwtConstants.secret,
      });
      const user = await this.userService.findOne(res.sub);
      if (!user)
        return socket.disconnect();
      this.onlineUsers.set(socket.id, user);
      socket.data.user = user;
      const rooms = await this.chatService.getRoomsFromUser(user.id);
      console.log("")
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch (error) {
      socket.disconnect(true);
   
    }
  }

  async handleDisconnect(socket: Socket) {
    this.onlineUsers.delete(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, payload: any, @MessageBody() message: string) {
    console.log('Message received: ' + message);
    const user = await this.onlineUsers.get(client.id);
    this.server.emit('message',  user.intra_name + ': ' + message);
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() newRoom: newChatRoomI) {
    const user = await this.onlineUsers.get(client.id);
    const room = await this.chatService.createRoom(user, newRoom);

    for (const user of this.onlineUsers) {
      if (newRoom.users.find((u: User) => (u.id === user[1].id) || (user[1].id === room.ownerId))) 
      {
    
        this.server.to(user[0].toString()).emit('rooms', room);
        console.log('emitted to ' + user[1].intra_name + ' ' + room);
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: ChatRoom) {
    const messages = await this.chatService.getMessagesFromRoom(room);
    this.server.to(client.id).emit('messages', messages);
  }
}
