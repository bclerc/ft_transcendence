import { Injectable } from '@nestjs/common';
import { ChatPenalty, PenaltyTimeType, PenaltyType } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PenaltiesService {

  constructor(private prisma: PrismaService) {
  }

  async punishUser(userId: number, roomId: number, type: PenaltyType, end_at?: Date) {
    let ret = await this.prisma.chatPenalty.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        room: {
          connect: {
            id: roomId
          }
        },
        type: type,
        timetype: end_at ? PenaltyTimeType.TEMP :  PenaltyTimeType.PERM ,
        endTime: end_at ? end_at : new Date(),
      }
    });
    console.log(ret);
  }

  async getRoomPenaltiesForUser(userId: number, roomId: number): Promise<ChatPenalty> {
    console.log(userId, roomId);
    const penalties = await this.prisma.chatPenalty.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
        OR: [
          {
            timetype: PenaltyTimeType.PERM
          },
          {
            endTime: {
              gt: new Date()
            }
          }
        ]
      }
    });
    return penalties;
  }

  async getActivePenalties(userId: number): Promise<ChatPenalty[]> {
    return await this.prisma.chatPenalty.findMany({
      where: {
        id: userId,
        OR: [
          {
            endTime: null
          },
          {
            endTime: {
              gte: new Date()
            }
          }
        ]
      }
    })
  }
}
