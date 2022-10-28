import { Injectable } from '@nestjs/common';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { ChatRoom, Message, PenaltyTimeType, PenaltyType, prisma, User } from '@prisma/client';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserInfoI } from 'src/user/interface/userInfo.interface';
import { RoomPunishException } from './chat.exception';
import { ChatRoomI, MessageI, newChatRoomI } from './interfaces/chatRoom.interface';
import { PenaltiesService } from './services/penalties/penalties.service';



@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService,
              private onlineUserService: OnlineUserService,
              private penaltiesService: PenaltiesService) {}

  async newMessage(message: MessageI) { 
    let penalty = await this.penaltiesService.getRoomPenaltiesForUser(message.user.id, message.room.id);

    if (penalty)
      throw new RoomPunishException(penalty, this.onlineUserService);

    const newMessage = await this.prisma.message.create({
      data: {
        content: message.content,
        user: {
          connect: {
            id: message.user.id,
          },
        },
        room: {
          connect: {
            id: message.room.id,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getRoomsFromUser(userId: number): Promise<ChatRoomI[]> {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
            state: true,
            intra_name: true,
            email: true,
            avatar_url: true,
          },
        },
        admins: {
          select: {
            id: true,
            state: true,
            intra_name: true,
            email: true,
            avatar_url: true,
          },
        },
        ownerId: true,
        public: true,
        description: true,
      },
    });

    return rooms;
  }

  async getPublicRooms(): Promise<ChatRoom[]> {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        public: true,
      },
      include: {
        users: true,
      }
    });
    return rooms;
  }


  async getMessagesFromRoom(userId: number, room: ChatRoom): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        room: {
          id: room.id,
        },
        user: {
          NOT: {
            blockedBy: {
              some: {
                id: userId,
              }
            }
          }
        },
      },
      include: {
        user: true,
      },
    
    });
    return messages;
  }
  
  async getMessagesFromRoomId(userId: number, roomId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        room: {
          id: roomId,
        },
        user: {
          NOT: {
            blockedBy: {
              some: {
                id: userId,
              }
            }
          }
        },
      },
      include: {
        user: true,
      },
    });
    return messages;
  }

  async createRoom(owner: BasicUserI, newRoom: newChatRoomI ): Promise<ChatRoom>
  {
    const ret = this.prisma.chatRoom.create({
      data: {
        name: newRoom.name || owner.intra_name + '\'s room',
        description: newRoom.description || 'Another room created by ' + owner.intra_name,
        ownerId: owner.id,
        public: newRoom.public,
        password: newRoom.password || null,
        admins: {
          connect: {
            id: owner.id,
          },
        },
        users: {
          connect: newRoom.users.map((user: UserInfoI) => {
            return {
              id: user.id
            };
          })
          .concat({
            id: owner.id
          })
        }
      }
    });
    return ret;
  }

  async getRoomById(roomId: number): Promise<ChatRoomI> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      select: {
        id: true,
        name: true,
        admins: true,
        ownerId: true,
        public: true,
        description: true,
        users: true,
        messages: true,
      },
    });
    return room;
  }

  async canJoin(roomId: number, password: string): Promise<boolean> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      select: {
        password: true,
        public: true
      },
    });
    if (!room)
      return false;
    if (!room.password && room.public)
      return true;
    return room.password === password;
  }

  async addUsersToRoom(roomId: number, userId: number): Promise<ChatRoom> {
   const penalty = await this.penaltiesService.getRoomPenaltiesForUser(userId, roomId);
  
    if (penalty && penalty.type === PenaltyType.BAN) {
      this.onlineUserService.sendToUser(userId, 'notification', 
      'Vous avez été banni de ce salon' + (penalty.timetype === PenaltyTimeType.TEMP ? ' jusqu\'au ' + penalty.endTime : ' définitivement'));
      return null;
    }

   const newRoom = this.prisma.chatRoom.update({
      where: {
        id: Number(roomId)
      },
      data: {
        users: {
          connect: {
            id: userId,
          }
        }
      }
    });
    return newRoom;
  }
 

  async addAdminsToRoom(roomId: number, userId: number): Promise<ChatRoom> {
    const newRoom = this.prisma.chatRoom.update({
      where: {
        id: Number(roomId)
      },
      data: {
        admins: {
          connect: {
            id: userId,
          }
        }
      }
    });
    return newRoom;
  }

  async removeAdminsFromRoom(roomId: number, userId: number): Promise<ChatRoom> {
    const newRoom = this.prisma.chatRoom.update({
      where: {
        id: Number(roomId)
      },
      data: {
        admins: {
          disconnect: {
            id: userId,
          }
        }
      }
    });
    return newRoom;
  }

  async removeUsersFromRoom(roomId: number, userId: number): Promise<any> {
    const newRoom = this.prisma.chatRoom.update({
      where: {
        id: Number(roomId)
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          }
        },
       admins: 
       {
          disconnect: {
            id: userId,
          },
      },
    }
    });
    return newRoom;
  }

  async editRoom(newRoom: newChatRoomI): Promise<ChatRoom> {
    
    const ret = this.prisma.chatRoom.update({
      where: {
        id: newRoom.id,
      },
      data: {
        name: newRoom.name,
        description: newRoom.description,
        public: newRoom.public,
        password: newRoom.password,
        users: {
          connect: newRoom.users.map((user: User) => {
            return {
              id: user.id
            };
          })
        }
      },
    });
    return ret;
  }
  
}