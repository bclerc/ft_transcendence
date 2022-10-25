import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatRoom, Message, User } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { SubscribeRoomDto } from 'src/chat/dto/subscribe-room.dto';
import { ChatRoomI, MessageI, newChatRoomI } from 'src/chat/interfaces/chatRoom.interface';
import { EjectRoomI } from 'src/chat/interfaces/eject-room-i.interface';
import { DemoteUserI, PromoteUserI } from 'src/chat/interfaces/promote-user-i.interface';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WschatService {

  @WebSocketServer() server;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private onlineUserService: OnlineUserService
  ) { }

  async initUser(user: BasicUserI) {

    let rooms: ChatRoomI[];
    rooms = await this.chatService.getRoomsFromUser(user.id);
    this.sendToUser(user, 'rooms', rooms);
  }

  async subscribeToRoom(socketId: string, subRoom: SubscribeRoomDto) {

    const user = this.onlineUserService.getUser(socketId);
    let room = await this.chatService.getRoomById(subRoom.roomId);

    if (user) {

      if (!await this.chatService.canJoin(room.id, subRoom.password)) {
        return this.sendToUser(user, 'notification', "Le mot de passe est incorrect");
      }
      await this.chatService.addUsersToRoom(room.id, user.id);
      this.updateRoomForUsersInRoom(room.id);
      this.sendToUsersInRoom(room.id, 'notification', user.intra_name + " a rejoint le salon " + room.name);
    }
  }

  async ejectUserFromRoom(socketId: string, room: EjectRoomI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(room.targetId);
    const roomToEject = await this.chatService.getRoomById(room.roomId);
    if (user) {
      if (roomToEject.admins.find(admin => admin.id == user.id)) {
        await this.chatService.removeUsersFromRoom(roomToEject.id, target.id);
        await this.updateRoomForUsersInRoom(roomToEject.id);
        await this.updateUserRooms(target);
        this.sendToUsersInRoom(roomToEject.id, 'notification', target.intra_name + " a été ejecté du salon " + roomToEject.name);
        this.sendToUser(target, 'notification', "Vous avez été ejecté du salon " + roomToEject.name);
      }
    }
  }

  async promoteUser(socketId: string, event: PromoteUserI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.targetId);
    const roomToPromote = await this.chatService.getRoomById(event.roomId);

    if (user) {
      if (roomToPromote.admins.find(admin => admin.id == user.id)) {
        this.chatService.addAdminsToRoom(roomToPromote.id, target.id);
        this.updateRoomForUsersInRoom(roomToPromote.id);
        this.sendToUsersInRoom(roomToPromote.id, 'notification', target.intra_name + " a été promu admin du salon " + roomToPromote.name);
        this.sendToUser(target, 'notification', "Vous avez été promu admin du salon " + roomToPromote.name);
      }
    }
  }

  async demoteUser(socketId: string, event: DemoteUserI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.targetId);
    const roomToDemote = await this.chatService.getRoomById(event.roomId);

    if (user) {
      if (roomToDemote.admins.find(admin => admin.id == user.id)) {
        this.chatService.removeAdminsFromRoom(roomToDemote.id, target.id);
        this.updateRoomForUsersInRoom(roomToDemote.id);
        this.sendToUsersInRoom(roomToDemote.id, 'notification', target.intra_name + " a été dégradé du salon " + roomToDemote.name);
        this.sendToUser(target, 'notification', "Vous avez été dégradé du salon " + roomToDemote.name);
      }
    }
  }

  // A faire: Verifier sur le mec est mute dans le chat
  async newMessage(socketId: string, message: MessageI) {
    let messages: Message[];
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(message.room.id);

    if (user) {
      await this.chatService.newMessage(message);
      messages = await this.chatService.getMessagesFromRoomId(room.id);
      this.sendToUsersInRoom(room.id, 'messages', messages);
    }
  }

  async newRoom(socketId: string, room: newChatRoomI) {
    const user = this.onlineUserService.getUser(socketId);
    let newRoom: ChatRoom;

    if (user) {
      newRoom = await this.chatService.createRoom(user, room);
      this.updateRoomForUsersInRoom(newRoom.id);
      this.sendToUsersInRoom(newRoom.id, 'notification', "Vous avez rejoint le salon " + newRoom.name);
    }
  }

  async leaveRoom(socketId: string, roomId: number) {
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(roomId);

    if (user) {
      await this.chatService.removeUsersFromRoom(room.id, user.id);
      this.updateRoomForUsersInRoom(room.id);
      this.updateUserRooms(user);
      this.sendToUser(user, 'notification', "Vous avez quitté le salon " + room.name);
    } else {
      this.sendToUser(user, 'notification', "Une erreur s'est produite");
    }
  }

  async updateUserRooms(user: BasicUserI) {

    const rooms = await this.chatService.getRoomsFromUser(user.id);
    this.sendToUser(user, 'rooms', rooms);
  }

  async updateRoomForUsersInRoom(roomId: number) {
    let room = await this.chatService.getRoomById(roomId);

    for (let user of room.users) {
      let rooms = await this.chatService.getRoomsFromUser(user.id);
      this.sendToUser(user, 'rooms', rooms);
    }
  }

  sendToUser(user: BasicUserI, prefix: string, data: any) {
    this.onlineUserService.sendToUser(user, prefix, data);
  }

  async sendToUsersInRoom(roomId: number, prefix: string, data: any) {
    let room = await this.chatService.getRoomById(roomId);

    room.users.forEach(user => {
      this.sendToUser(user, prefix, data);
    });
  }


}
