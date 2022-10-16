import { ConsoleLogger, Inject, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatRoom, Message, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { MessageI, newChatRoomI } from './interfaces/chatRoom.interface';



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
  async handleMessage(@ConnectedSocket() client: Socket, payload: any, @MessageBody() message: MessageI) {
     const user = await this.onlineUsers.get(client.id);
     const room = message.room;
     let  messages: Message[];
    
     await this.chatService.newMessage(message);
     messages = await this.chatService.getMessagesFromRoomId(room.id);
     for (const user of room.users)

      {
        for (const [key, value] of this.onlineUsers.entries()) {
          if (value.id == user.id)
          {
            this.server.to(key).emit('messages', messages);
          }
        }
      }
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() newRoom: newChatRoomI) {
    const user = await this.onlineUsers.get(client.id);
    const room = await this.chatService.createRoom(user, newRoom);

    for (const user of this.onlineUsers) {
      if (newRoom.users.find((u: User) => (u.id === user[1].id) || (user[1].id === room.ownerId))) 
      {
        this.server.to(user[0]).emit('rooms', await this.chatService.getRoomsFromUser(user[1].id));
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: ChatRoom) {
    const messages = await this.chatService.getMessagesFromRoom(room);
    this.server.to(client.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: ChatRoom) {
    const user = await this.onlineUsers.get(client.id);
    await this.chatService.removeUsersFromRoom(room.id, user.id);
    this.server.to(client.id).emit('rooms', await this.chatService.getRoomsFromUser(user.id));
  }

}
