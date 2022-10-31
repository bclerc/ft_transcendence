import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatRoom, Message, PenaltyType, User } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { SubscribeRoomDto } from 'src/chat/dto/subscribe-room.dto';
import { ChatRoomI, MessageI, newChatRoomI } from 'src/chat/interfaces/chatRoom.interface';
import { EjectRoomI } from 'src/chat/interfaces/eject-room-i.interface';
import { DemoteUserI, PromoteUserI } from 'src/chat/interfaces/promote-user-i.interface';
import { PasswordUtils } from 'src/chat/utils/chat-utils';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserService } from 'src/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PenaltiesService } from 'src/chat/services/penalties/penalties.service';

@Injectable()
export class WschatService {

  passUtils: PasswordUtils = new PasswordUtils();

  @WebSocketServer() server;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private onlineUserService: OnlineUserService,
    private penaltiesService: PenaltiesService,
    private eventEmitter: EventEmitter2

  ) { }

  async initUser(user: BasicUserI) {
    let rooms: ChatRoomI[];
  
    rooms = await this.chatService.getRoomsFromUser(user.id);
    this.sendToUser(user, 'rooms', rooms);
  }

  async subscribeToRoom(socketId: string, subRoom: SubscribeRoomDto) {
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(subRoom.roomId);
    const penalty = await this.penaltiesService.getRoomPenaltiesForUser(user.id, room.id);
    
    
    if (penalty && penalty.type === PenaltyType.BAN) {
      this.eventEmitter.emit('room.user.join', {
        room: room,
        user: user,
        success: false,
        message: 'Vous avez été banni de ce salon' + (penalty.timetype === 'PERM' ? '.' : ' jusqu\'au ' + penalty.endTime)
      });
      return ;
    }

    if (user) {
      if (!await this.chatService.canJoin(room.id, subRoom.password)) {
        this.eventEmitter.emit('room.user.join', {
          room: room,
          user: user,
          success: false,
          message: 'Mot de passe incorrect',
         });
         return ;
      }

      await this.chatService.addUsersToRoom(room.id, user.id);
      this.eventEmitter.emit('room.user.join', {
        room: room,
        user: user,
        success: true,
      });
    }
  }

  async ejectUserFromRoom(socketId: string, room: EjectRoomI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(room.targetId);
    const roomToEject = await this.chatService.getRoomById(room.roomId);

    if (user) {
      if (roomToEject.admins.find(admin => admin.id == user.id)) {
        await this.chatService.removeUsersFromRoom(roomToEject.id, target.id);
        this.eventEmitter.emit('room.user.kicked', { room: roomToEject, user: target, kicker: user });
      }
    }
  }

  async promoteUser(socketId: string, event: PromoteUserI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.targetId);
    const roomToPromote = await this.chatService.getRoomById(event.roomId);

    if (user) {
      if (user.id == roomToPromote.ownerId) {
        this.chatService.addAdminsToRoom(roomToPromote.id, target.id);
        this.updateRoomForUsersInRoom(roomToPromote.id);
        this.eventEmitter.emit('room.admin.update', {
          isPromote: true,
          user: target,
          promoter: user,
          room: roomToPromote
        })
      }
    }
  }

  async demoteUser(socketId: string, event: DemoteUserI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.targetId);
    const roomToDemote = await this.chatService.getRoomById(event.roomId);

    if (user) {
      if (roomToDemote.ownerId == user.id) {
        this.chatService.removeAdminsFromRoom(roomToDemote.id, target.id);
        this.updateRoomForUsersInRoom(roomToDemote.id);
        this.eventEmitter.emit('room.admin.update', {
          isPromote: false,
          user: target,
          promoter: user,
          room: roomToDemote
        })
      }
    }
  }

  async newMessage(socketId: string, message: MessageI) {
    let messages: Message[];
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(message.room.id);

    if (user) {
      await this.chatService.newMessage(message);
      this.eventEmitter.emit('room.message.new', { room: room });
    }
  }

  async newRoom(socketId: string, room: newChatRoomI) {
    const user = this.onlineUserService.getUser(socketId);
    let newRoom: ChatRoom;
    
    if (user) {
      newRoom = await this.chatService.createRoom(user, room);
      this.eventEmitter.emit('room.new', { room: newRoom });
    }
  }
  
  async leaveRoom(socketId: string, roomId: number) {
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(roomId);
    
    if (user) {
      await this.chatService.removeUsersFromRoom(room.id, user.id);
      this.eventEmitter.emit('room.user.leave', { room: room, user: user });
    }
  }


  async editRoom(socketId: string, newRoom: newChatRoomI){
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(newRoom.id);
    if (user) {
      if (room.ownerId == user.id) {
        await this.chatService.editRoom(newRoom);
        this.eventEmitter.emit('room.update', { room: newRoom });
      }
    }
  }

  async updateUserRooms(user: BasicUserI) {

    const rooms = await this.chatService.getRoomsFromUser(user.id);
    this.sendToUser(user, 'rooms', rooms);
  }

  async updateUsersMessagesInRoom (room: ChatRoomI) {
      for (let user of room.users) {
        const messages = await this.chatService.getMessagesFromRoomId(user.id, room.id);
        this.sendToUser(user, 'messages', messages);
      }
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
