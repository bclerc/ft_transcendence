import { AdminUpdateEvent, MessageUpdateEvent, NewRoomEvent, RoomUpdateEvent, UserCanChatEvent, UserJoinEvent, UserKickEvent, UserLeaveEvent, UserPunishEvent } from './interfaces/chatEvent.interface';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatRoomI, MessageI, newChatRoomI } from './interfaces/chatRoom.interface';
import { DemoteUserI, PromoteUserI } from './interfaces/promote-user-i.interface';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { SubscribeRoomDto } from './dto/subscribe-room.dto';
import { ChatRoom, User } from '@prisma/client';
import { WschatService } from 'src/wschat/wschat.service';
import { jwtConstants } from 'src/auth/constants';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { EjectRoomI } from 'src/chat/interfaces/eject-room-i.interface';
import { JwtService } from '@nestjs/jwt';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { eventNames } from 'process';
import { Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { PusnishI } from './interfaces/punish.interface';

@WebSocketGateway(8181, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() server;

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
    this.onlineUserService.newConnect(socket);
  }

  async handleDisconnect(socket: Socket) {
    this.onlineUserService.deleteUser(socket.id);
    socket.disconnect();
  }

  /** 
   *  Emitters
   */

  @OnEvent('room.new')
  handleNewRoomEvent(event: NewRoomEvent) {
      this.updateRoomForUsersInRoom(event.room.id);
      this.sendToUsersInRoom(event.room.id, 'notification', "Une nouvelle room a été créée : " + event.room.name);
      if (event.room.public)
        this.updatePublicRooms();
    
  }

  @OnEvent('room.update')
  handleRoomUpdateEvent(event: RoomUpdateEvent) {
    if (event.success) {
      this.updateRoomForUsersInRoom(event.room.id);
      this.sendToUsersInRoom(event.room.id, 'notification', "La room " + event.room.name + " a été mise à jour");
      if (event.room.public)
        this.updatePublicRooms();
     } else {
      this.sendToUser(event.user, 'notification', "Vous n'avez pas pu éditer la room " + event.room.name + ". Raison : " + event.message);
    }
  }

  @OnEvent('room.admin.update')
  handleAdminsChangeEvent(event: AdminUpdateEvent) {
    if (event.isPromote) {
      this.sendToUser(event.user, 'notification', "Vous avez été promu admin de la room " + event.room.name);
      this.sendToUser(event.promoter, 'notification', "Vous avez promu " + event.user.intra_name + " admin de la room " + event.room.name);
    } else {
      this.sendToUser(event.user, 'notification', "Vous avez été dégradé de la room " + event.room.name);
      this.sendToUser(event.promoter, 'notification', "Vous avez dégradé " + event.user.intra_name + " de la room " + event.room.name);
    }
    this.updateRoomForUsersInRoom(event.room.id);
  }

  @OnEvent('room.user.punished')
  handleUserPunished(event: UserPunishEvent)
  {
    console.log("punish event", event);
    if (event.success)
    {
      this.updateRoomForUsersInRoom(event.room.id);
      this.sendToUser(event.user, 'notification', "Vous avez été puni de la room " + event.room.name + " par " + event.punisher.intra_name);
      this.sendToUser(event.punisher, 'notification', "Vous avez puni " + event.user.intra_name + " de la room " + event.room.name);
    }
    else {
      this.sendToUser(event.punisher, 'notification', "Vous n'avez pas pu punir " + event.user.intra_name + " de la room " + event.room.name + ". Raison : " + event.message);
    }
  }

  @OnEvent('room.user.canchat')
  handleUserCanChat(event: UserCanChatEvent)
  {
    this.sendToUser(event.user, 'notification', event.message); 
  }

  @OnEvent('room.message.new')
  handleNewMessageEvent(event: MessageUpdateEvent) {
    this.updateUsersMessagesInRoom(event.room);
    this.updateRoomForUsersInRoom(event.room.id);
  }

  @OnEvent('room.user.join')
  handleUserJoinEvent(event: UserJoinEvent) {
    if (event.success) {
      this.sendToUser(event.user, 'notification', "Vous avez rejoint la room " + event.room.name);
      this.sendToUsersInRoom(event.room.id, 'notification', event.user.intra_name + " a rejoint la room");
      this.updateRoomForUsersInRoom(event.room.id);
    } else {
      this.sendToUser(event.user, 'notification', "Vous n'avez pas pu rejoindre la room " + event.room.name + ". Raison : " + event.message);
    }
  }

  @OnEvent('room.user.leave')
  handleUserLeaveEvent(event: UserLeaveEvent) {
    this.updateRoomForUsersInRoom(event.room.id);
    this.updateUserRooms(event.user);
    this.sendToUser(event.user, 'notification', "Vous avez quitté la room " + event.room.name);
  }

  @OnEvent('room.user.kicked')
  handleUserKickedEvent(event: UserKickEvent) {
    this.updateRoomForUsersInRoom(event.room.id);
    this.updateUserRooms(event.user);
    this.sendToUser(event.user, 'notification', "Vous avez été kické de la room " + event.room.name + " par " + event.kicker.intra_name);
    this.sendToUser(event.kicker, 'notification', "Vous avez kické " + event.user.intra_name + " de la room " + event.room.name);
  }

  /**
   *  Listeners
   */

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, payload: any, @MessageBody() message: MessageI) {
    try {
      this.wschatService.newMessage(client.id, message);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('needRooms')
  async handleNeedRooms(@ConnectedSocket() client: Socket) {
    let user = this.onlineUserService.getUser(client.id);
    if (user) {
      await this.updateUserRooms(user);
    }
  }

  @SubscribeMessage('needPublicRooms')
  async handleNeedPublicRooms(@ConnectedSocket() client: Socket) {
    this.server.to(client.id).emit('publicRooms', await this.chatService.getPublicRooms());
  }

  @SubscribeMessage('needDmRooms')
  async handleNeedDmRooms(@ConnectedSocket() client: Socket) {
    let user = this.onlineUserService.getUser(client.id);
    if (user) {
      this.sendToUser(user, 'dmRooms', await this.chatService.getDmGroupForUser(user.id));
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
  async onJoinRoom(@ConnectedSocket() client: Socket, payload: any, @MessageBody() room: ChatRoomI) {
    const user = await this.onlineUserService.getUser(client.id);
    const messages = await this.chatService.getMessagesFromRoom(user.id, room);
    user.inRoomId = room.id;
    this.onlineUserService.onlineUsers.set(client.id, user);
    this.server.to(client.id).emit('messages', messages);
    if (!room.seen)
    {
      await this.chatService.seenRoomMessages(user.id, room.id);
      await this.updateUserRooms(user);
    }
  }

  @SubscribeMessage('needMessagesNotSeen')
  async handleEvent(client: Socket) {
    let user = this.onlineUserService.getUser(client.id);
    if (user) {
      this.sendToUser(user, 'newMessage', await this.chatService.haveMessageNotSeen(user.id));
    }
  }

  @SubscribeMessage('punishUser')
  async onBanUser(@ConnectedSocket() client: Socket, payload: any, @MessageBody() penalty: PusnishI) {
    this.wschatService.punishUser(client.id, penalty);
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

  @SubscribeMessage('logout')
  async onLogout(@ConnectedSocket() client: Socket, payload: any) {
    this.onlineUserService.deleteUser(client.id);
    client.disconnect();
  }


  /** 
   * Emitters utils
   */


  async updateUserRooms(user: BasicUserI) {

    const rooms = await this.chatService.getRoomsFromUser(user.id);
    const dmrooms = await this.chatService.getDmGroupForUser(user.id);
    this.sendToUser(user, 'rooms', rooms);
    this.sendToUser(user, 'dmRooms', dmrooms);
    this.sendToUser(user, 'newMessage', await this.chatService.haveMessageNotSeen(user.id));
  }

  async updatePublicRooms() {
    this.server.emit('publicRooms', await this.chatService.getPublicRooms());
  }

  async updateUsersMessagesInRoom(room: ChatRoomI) {
    for (let user of room.users) {
      let onlineUser = this.onlineUserService.getUser(null, user.id);
      if (onlineUser && onlineUser.inRoomId == room.id) {
        const messages = await this.chatService.getMessagesFromRoomId(user.id, room.id);
        this.sendToUser(user, 'messages', messages);
      }
    }
  }

  async updateRoomForUsersInRoom(roomId: number) {
    let room = await this.chatService.getRoomById(roomId);
    for (let user of room.users) {
        this.updateUserRooms(user);
    }
  }

  sendToUser(user: BasicUserI, prefix: string, data: any) {  
      if (user) {
        for (let [key, value] of this.onlineUserService.onlineUsers) {
          if (value.id == user.id) 
          {
            this.server.to(key).emit(prefix, data);
          }
        }
      }
  }

  async sendToUsersInRoom(roomId: number, prefix: string, data: any) {
    let room = await this.chatService.getRoomById(roomId);

    room.users.forEach(user => {
      this.sendToUser(user, prefix, data);
    });
  }
}