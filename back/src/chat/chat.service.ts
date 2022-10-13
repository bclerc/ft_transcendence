import { Injectable } from '@nestjs/common';
import { ChatRoom, Message, prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { newChatRoomI } from './interfaces/chatRoom.interface';



@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService) {}


  async getRoomsFromUser(userId: number): Promise<ChatRoom[]> {
    // get all info of room where user is in, including the other user
    // and all messages
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