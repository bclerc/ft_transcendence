import { Injectable } from '@nestjs/common';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { ChatRoom, Message, prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserInfoI } from 'src/user/interface/userInfo.interface';
import { ChatRoomI, MessageI, newChatRoomI } from './interfaces/chatRoom.interface';



@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService) {}

  async newMessage(message: MessageI) { 
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
        messages: true,
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


  async getMessagesFromRoom(room: ChatRoom): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        room: {
          id: room.id,
        },
      },
      include: {
        user: true,
      },
    
    });
    return messages;
  }
  
  async getMessagesFromRoomId(roomId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        room: {

          id: roomId,
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
        public: true,
      },
    });
    if (!room)
      return false;
    if (!room.password && room.public)
      return true;
    console.log(room.password, password);
    return room.password === password;
  }

  async addUsersToRoom(roomId: number, userId: number): Promise<ChatRoom> {
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
        }
      }
    });
    return newRoom;
  }

  async editRoom(roomId: number, newRoom: newChatRoomI): Promise<ChatRoom> {
    const ret = this.prisma.chatRoom.update({
      where: {
        id: roomId,
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