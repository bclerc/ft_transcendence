import { Injectable } from '@nestjs/common';
import { ChatRoom, ChatRoomType, Message, User } from '@prisma/client';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserInfoI } from 'src/user/interface/userInfo.interface';
import { RoomPunishException } from './chat.exception';
import { ChatRoomI, DmChatRoomI, MessageI, newChatRoomI } from './interfaces/chatRoom.interface';
import { PenaltiesService } from './services/penalties/penalties.service';
import { PasswordUtils } from './utils/chat-utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateChatDto } from './dto/create-chat.dto';




@Injectable()
export class ChatService {

  passUtils: PasswordUtils = new PasswordUtils();

  constructor(private prisma: PrismaService,
    private onlineUserService: OnlineUserService,
    private penaltiesService: PenaltiesService,
    private eventEmitter: EventEmitter2
  ) { }

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
        seenBy: { connect: { id: message.user.id } }
      },
      include: {
        user: true,
      },
    });
    await this.prisma.chatRoom.update({
      where: {
        id: message.room.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

  }

  async getRoomsFromUser(userId: number): Promise<any> {

    let rooms: ChatRoomI[] = await this.prisma.chatRoom.findMany({
      where: {
        penalities: {
          none:
          {
            type: 'BAN',
            user: {
              id: userId,
            },
            OR: [
              {
                endTime: {
                  gte: new Date(),
                },
              },
              {
                timetype: 'PERM',
              } 
            ]
          }
        },
        users: {
          some: {
            id: userId,
          },
        },
        type: ChatRoomType.GROUP,
      },
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
            state: true,
            intra_name: true,
            displayname: true,
            email: true,
            avatar_url: true,
            blockedBy: {
              where: {
                id: userId,
              },
              select: {
                id: true,
              }
            },
            friendOf: {
              where: {
                id: userId,
              },
              select: {
                id: true,
              },
           },
          },
          orderBy: {
            state: 'asc',
          }
        },
        admins: {
          select: {
            id: true,
            state: true,
            intra_name: true,
            displayname: true,
            email: true,
            avatar_url: true,
          },
        },
        penalities: {
          where: {     
            OR: [
              {
                endTime: {
                  gte: new Date(),
                },
              },
              {
                timetype: 'PERM',
              } 
            ]
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
              }
            },
          type: true,
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            seenBy: {
              where: {
                id: userId,
              }
            }
          }
        },
        ownerId: true,
        type: true,
        public: true,
        description: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    
    rooms.forEach(room => {
      if (room.messages[0]) {
        if (room.messages[0].seenBy.length > 0)
          room.seen = true;
        else
          room.seen = false;
      } else {
        room.seen = true;
      }
    });

    return rooms;
  }

  async getDmGroupForUser(userId: number): Promise<DmChatRoomI[]> {
    const rooms: any[] = await this.prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        type: ChatRoomType.DM,
      },
      select: {
        id: true,
        name: true,
        description: false,
        type: true,
        users: {
          select: {
            id: true,
            state: true,
            intra_name: true,
            displayname: true,
            email: true,
            avatar_url: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            seenBy: {
              where: {
                id: userId,
              }
            }
          }
        },
        ownerId: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    rooms.forEach(room => {
      if (room.messages[0]) {
        if (room.messages[0].seenBy.length > 0)
          room.seen = true;
        else
          room.seen = false;
      } else {
        room.seen = true;
      }
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
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return rooms;
  }


  async getMessagesFromRoom(userId: number, room: ChatRoomI): Promise<Message[]> {
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
      orderBy: {
       createdAt: 'asc',
    },

    });
    return messages;
  }

  async seenRoomMessages(userId: number, roomId: number) {
    let lastMessage = await this.prisma.message.findFirst({
      where: {
        room: {
          id: roomId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
      },
    });

    if (lastMessage) {
      await this.prisma.message.update({
        where: {
          id: lastMessage.id,
        },
        data: {
          seenBy: {
            connect: {
              id: userId,
            }
          }
        }
      });
    }
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
        seenBy: true,
      },
      orderBy: {
        createdAt: 'asc',
     },
    });
    return messages;
  }

  async haveMessageNotSeen(userId: number): Promise<number> {
    const messages = await this.prisma.message.findMany({
      where: {
        room: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      select : {
        room: true,
        seenBy: true,
      },
    });

    let count = 0;
    messages.forEach(message => {
      if (message.seenBy.filter(user => user.id === userId).length === 0)
        count++;
      }
    );
    return count;
  }



  async createRoom(owner: BasicUserI, newRoom: CreateChatDto): Promise<ChatRoom> {
    let hashedPassword = null;

    if (newRoom.password != null)
      hashedPassword = await this.passUtils.hashPass(newRoom.password);

    if (newRoom.users.length < 1 || newRoom.users.length > 10)
        return ;
     const ret = this.prisma.chatRoom.create({
      data: {
        name: newRoom.name || owner.intra_name + '\'s room',
        description: newRoom.description || 'Another room created by ' + owner.intra_name,
        ownerId: owner.id,
        type: ChatRoomType.GROUP,
        public: newRoom.public,
        password: hashedPassword,
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


  async creatDm(friendId1: number, friendId2: number): Promise<void> {
    await this.prisma.chatRoom.create({
      data: {
        name: 'Message privé with ' + friendId1 + ' ' + friendId2,
        ownerId: friendId1,
        type: ChatRoomType.DM,
        public: false,
        users: {
          connect: [
            {
              id: friendId1,
            },
            {
              id: friendId2,
            }
          ],
        },
      }
    });
  }

  async deleteDm(user1Id: number, user2Id: number) {
    
    await this.prisma.message.deleteMany({
      where: {
        room: {
            type: ChatRoomType.DM,
            AND: [
              {
                users: {
                  some: {
                    id: user1Id,
                  }
                }
              },
              {
                users: {
                  some: {
                    id: Number(user2Id),
                  }
                }
              }
            ]
          },
        },
    });


    await this.prisma.chatRoom.deleteMany({
      where: {
        type: ChatRoomType.DM,
        AND: [
          {
            users: {
              some: {
                id: user1Id,
              }
            }
          },
          {
            users: {
              some: {
                id: Number(user2Id),
              }
            }
          }
        ]
      },
    });

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
        type: true,
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
    return await this.passUtils.verifyPass(password, room.password);
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
    const newRoom = await this.prisma.chatRoom.update({
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
    return await this.getRoomById(roomId);
  }

  async updateRoomOwner(roomId: number, userId: number): Promise<ChatRoom> {
    const newRoom = this.prisma.chatRoom.update({
      where: {
        id: Number(roomId)
      },
      data: {
        ownerId: userId,
      }
    });
    return newRoom;
  }

  async editRoom(newRoom: newChatRoomI): Promise<ChatRoom> {

    let hashedPassword = null;

    if (newRoom.password)
      hashedPassword = await this.passUtils.hashPass(newRoom.password);
    const ret = this.prisma.chatRoom.update({
      where: {
        id: newRoom.id,
      },
      data: {
        name: newRoom.name,
        description: newRoom.description,
        public: newRoom.public,
        password: hashedPassword,
      },
    });
    return ret;
  }


  async deleteRoom(roomId: number): Promise<void> {

    await this.prisma.chatPenalty.deleteMany({
      where: {
        room: {
          id: roomId,
        }
      }
    });
        

    await this.prisma.message.deleteMany({
      where: {
        room: {
          id: roomId,
        },  
      },
    });
  
    await this.prisma.chatRoom.delete({
      where: {
        id: roomId,
      },
    });
  }

}