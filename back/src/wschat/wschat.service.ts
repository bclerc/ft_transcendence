import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { ChatPenalty, ChatRoom, Message, PenaltyType, User } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { SubscribeRoomDto } from 'src/chat/dto/subscribe-room.dto';
import { ChatRoomI, MessageI, newChatRoomI, PardonI } from 'src/chat/interfaces/chatRoom.interface';
import { EjectRoomI } from 'src/chat/interfaces/eject-room-i.interface';
import { DemoteUserI, PromoteUserI } from 'src/chat/interfaces/promote-user-i.interface';
import { PasswordUtils } from 'src/chat/utils/chat-utils';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserService } from 'src/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PenaltiesService } from 'src/chat/services/penalties/penalties.service';
import { PusnishI } from 'src/chat/interfaces/punish.interface';
import { BlockedUser } from 'src/chat/interfaces/blocked.interface';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { UserInfoI } from 'src/user/interface/userInfo.interface';


function isRoomAdministrator(user: UserInfoI | BasicUserI, room: ChatRoomI) : boolean {
    
  if (!user || !room)
        return false;
  if (room.ownerId == user.id)
      return true;
  for (const admin of room.admins) {
      if (admin.id === user.id) {
          return true;
      }
  }
  return false; 
}

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
    let   message, success = true;
    
    if (user && room) {
      const penalty = await this.penaltiesService.getRoomPenaltiesForUser(user.id, room.id);   
      if (penalty && penalty.type === PenaltyType.BAN) {
          success = false,
          message = 'Vous avez été banni de ce salon' 
                  + (penalty.timetype === 'PERM' ? '.' 
                  : ' jusqu\'au ' + penalty.endTime.toLocaleString('fr-FR'))
        }

      if (!await this.chatService.canJoin(room.id, subRoom.password))
      {
         success = false;
         message =  'Mot de passe incorrect';
      }
     
      if (success)
        await this.chatService.addUsersToRoom(room.id, user.id);

     this.eventEmitter.emit('room.user.join', {
       room: room,
       user: user,
       success: success,
       message: message,
     });
    }
  }

  async punishUser(socketId: string, event: PusnishI) {
    const info = {
      user: await this.userService.findOne(event.targetId),
      room: await this.chatService.getRoomById(event.roomId),
      punisher: this.onlineUserService.getUser(socketId)
    };
    const now = new Date().getTime();
    let message, success = true, endTime: Date;

    if (info.user && info.punisher && info.room) 
    {
      if (isRoomAdministrator(info.punisher, info.room)) {
        if (info.room.ownerId != info.user.id) {
          endTime = new Date(now + event.time);
         await this.penaltiesService.punishUser(info.user.id, info.room.id, event.type, event.perm ? null : endTime);
        } else {
          success = false;
          message = 'Vous ne pouvez pas punir le propriétaire du salon';
        }
      } else {
        success = false;
        message = 'Vous n\'avez pas les droits pour punir un utilisateur';
      }
      this.eventEmitter.emit('room.user.punished', 
      { 
        type: event.type,
        success: success, 
        message: message,
        ...info,
    });
  }
}

  async pardonUser(socketId: string, event: PardonI) {
    const info = {
      user: await this.userService.findOne(event.userId),
      pardonner: await this.onlineUserService.getUser(socketId),
      penalty: await this.penaltiesService.getPenaltyById(event.penaltyId),
    }

    
    if (info.pardonner && info.user && info.penalty) {
          const room = info.penalty.room;
          if (isRoomAdministrator(info.pardonner, room)) {
            this.penaltiesService.deletePenalty(info.penalty.id);
            this.eventEmitter.emit('room.user.pardoned', { 
                room: room,
                success: true,
                ...info
             });
          }       
      }
  }

  async ejectUserFromRoom(socketId: string, room: EjectRoomI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(room.targetId);
    const roomToEject = await this.chatService.getRoomById(room.roomId);
    if (user && target && roomToEject && target.id != roomToEject.ownerId) {
      if (isRoomAdministrator(user, roomToEject)) {
        await this.chatService.removeUsersFromRoom(roomToEject.id, target.id);
        this.eventEmitter.emit('room.user.kicked', { room: roomToEject, user: target, kicker: user });
      }
    }
  }

  async promoteUser(socketId: string, event: PromoteUserI) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.targetId);
    const roomToPromote = await this.chatService.getRoomById(event.roomId);

    if (user && target && roomToPromote) {
      if (user.id == roomToPromote.ownerId) {
        this.chatService.addAdminsToRoom(roomToPromote.id, target.id);
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
    
    if (user && target && roomToDemote) {
      if (roomToDemote.ownerId == user.id && roomToDemote.ownerId != target.id) {
        this.chatService.removeAdminsFromRoom(roomToDemote.id, target.id);
        this.eventEmitter.emit('room.admin.update', {
          isPromote: false,
          user: target,
          promoter: user,
          room: roomToDemote
        })
      }
    }
  }

  async addUsersToRoom(socketId: string, event: {roomId: number, userId: number}) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.userId);
    const room = await this.chatService.getRoomById(event.roomId);

    if (user && target && room) {
      if (user.id == room.ownerId) {
        await this.chatService.addUsersToRoom(room.id, target.id);
        this.eventEmitter.emit('room.user.invited',
         { room: room, user: target, inviter: user });
      }
    }
  }

  async deleteRoom(socketId: string, roomId: number) {
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(roomId);

    if (user && room) {
      if (room.ownerId == user.id) {
        await this.chatService.deleteRoom(room.id);
        this.eventEmitter.emit('room.delete', { room: room, user: user, success: true});
      }
    }
  }

  async newMessage(socketId: string, message: MessageI) {
    let messages: Message[];
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(message.room.id);
    if (message.content.length < 2  && message.content.length > 500) 
      return ;
    if (user && room) {
      try {
        await this.chatService.newMessage(message);
        this.eventEmitter.emit('room.message.new', { room: room });
      } catch (error) {
        this.eventEmitter.emit('room.user.canchat', { room: room, user: user, message: error.response});
      }
    }
  }

  async newRoom(socketId: string, room: CreateChatDto) {
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
      const newRoom = await this.chatService.removeUsersFromRoom(room.id, user.id);
      if (room.ownerId == user.id) {
        if (newRoom.users.length > 0) {
         await this.chatService.updateRoomOwner(room.id, newRoom.users[0].id);
        } else {
          await this.chatService.deleteRoom(room.id);
          this.eventEmitter.emit('room.delete', { room: room });
        }
      }
      this.eventEmitter.emit('room.user.leave', { room: room, user: user });
    }
  }

  async editRoom(socketId: string, newRoom: newChatRoomI){
    const user = this.onlineUserService.getUser(socketId);
    const room = await this.chatService.getRoomById(newRoom.id);
    if (!newRoom.name
        || newRoom.name.length < 3
        || newRoom.name.length > 30
        || !newRoom.description
        || newRoom.description.length < 3
        || newRoom.description.length > 200)
      {
        this.eventEmitter.emit('room.update', {user: user, room: room, success: false, message: 'Les champs ne sont pas valides' });
        return ;
      }
    if (user && room) {
      if (room.ownerId == user.id) {
        await this.chatService.editRoom(newRoom);
        this.eventEmitter.emit('room.update', {user: user, room: newRoom, success: true });
      } else {
        this.eventEmitter.emit('room.update', {user: user, room: room, success: false, message: 'Seul le propriétaire du salon peut le modifier' });
      }
    }
  }

  async blockUser(socketId: string, event: BlockedUser) {
    const user = this.onlineUserService.getUser(socketId);
    const target = await this.userService.findOne(event.userId);

    if (user && target && user.id != target.id) {
      if (event.block) {
        await this.userService.blockUser(user.id, target.id);
        this.eventEmitter.emit("user.blocked", { user: target, blocker: user, block: true, success: true });
      } else {
        await this.userService.unblockUser(user.id, target.id);
        this.eventEmitter.emit("user.blocked", { user: target, blocker: user, block: false, success: true });
      }
    }
  }

  async updateRoomForUsersInRoom(roomId: number) {
    let room = await this.chatService.getRoomById(roomId);

    for (let user of room.users) {
      const rooms = await this.chatService.getRoomsFromUser(user.id);
      this.sendToUser(user, 'rooms', rooms);
    }
  }

  sendToUser(user: BasicUserI, prefix: string, data: any) {
    this.sendToUser(user, prefix, data);
  }


}
