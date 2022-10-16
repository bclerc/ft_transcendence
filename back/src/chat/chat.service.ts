import { Injectable } from '@nestjs/common';
import { ChatRoom, Message, prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
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

  async getRoomsFromUser(userId: number): Promise<ChatRoom[]> {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
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

  async createRoom(owner: User, newRoom: newChatRoomI ): Promise<ChatRoom>
  {
    const ret = this.prisma.chatRoom.create({
      data: {
        name: newRoom.name || owner.intra_name + '\'s room',
        description: newRoom.description || 'Another room created by ' + owner.intra_name,
        ownerId: owner.id,
        users: {
          connect: newRoom.users.map((user: User) => {
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

  async getRoomById(roomId: number): Promise<ChatRoom> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        users: true,
        messages: true,
      },
    });
    return room;
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
 
  async removeUsersFromRoom(roomId: number, userId: number): Promise<ChatRoom> {
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

  
}