import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatRoom, User } from '@prisma/client';
import { Socket } from 'socket.io';

import { jwtConstants } from 'src/auth/constants';
import { EjectRoomI } from 'src/chat/interfaces/eject-room-i.interface';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { UserService } from 'src/user/user.service';
import { WschatService } from 'src/wschat/wschat.service';
import { ChatService } from './chat.service';
import { SubscribeRoomDto } from './dto/subscribe-room.dto';
import { ChatRoomI, MessageI, newChatRoomI } from './interfaces/chatRoom.interface';
import { DemoteUserI, PromoteUserI } from './interfaces/promote-user-i.interface';



@WebSocketGateway(81, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() server;
  onlineUsers: Map<String, User> = new Map();

  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(WschatService) private readonly wschatService: WschatService,
    private readonly onlineUserService: OnlineUserService,
  ) { }

  afterInit(server: any) {
    this.onlineUserService.server = server;
  }

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
      this.onlineUserService.initUser(socket.id, user);
      this.wschatService.initUser(user);
      socket.data.user = user;
    } catch (error) {
      socket.disconnect(true);

    }
  }

  async handleDisconnect(socket: Socket) {
    this.onlineUserService.deleteUser(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, payload: any, @MessageBody() message: MessageI) {
    try {
      this.wschatService.newMessage(client.id, message);
    } catch (error) {
    }
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() newRoom: newChatRoomI) {
    this.wschatService.newRoom(client.id, newRoom);
  }

  @SubscribeMessage('subscribeRoom')
  async onSubscribeRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: SubscribeRoomDto) {
    this.wschatService.subscribeToRoom(client.id, room);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: ChatRoom) {
    const user = await this.onlineUserService.getUser(client.id);
    const messages = await this.chatService.getMessagesFromRoom(user.id, room);
    this.server.to(client.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: ChatRoom) {
    this.wschatService.leaveRoom(client.id, room.id);
  } 

  @SubscribeMessage('ejectRoom')
  async onEjectRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() event: EjectRoomI) {
    this.wschatService.ejectUserFromRoom(client.id, event);
  }

  @SubscribeMessage('promoteUser')
  async onPromoteUser(@ConnectedSocket() client: Socket, payload: any, @MessageBody() event: PromoteUserI) {
    this.wschatService.promoteUser(client.id, event);
  }

  @SubscribeMessage('demoteUser')
  async onDemoteUser(@ConnectedSocket() client: Socket, payload: any, @MessageBody() event: DemoteUserI) {
    this.wschatService.demoteUser(client.id, event);
  }

  @SubscribeMessage('editRoom')
  async onEditRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: newChatRoomI) {
    this.wschatService.editRoom(client.id, room);
  }
}