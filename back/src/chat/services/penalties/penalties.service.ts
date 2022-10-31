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
    this.prisma.chatPenalty.create({
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
        timetype: end_at ? PenaltyTimeType.PERM : PenaltyTimeType.TEMP,
        endTime: end_at,
      }
    });
  }

  async getRoomPenaltiesForUser(userId: number, roomId: number): Promise<ChatPenalty> {

    const penalties = await this.prisma.chatPenalty.findMany({
      where: {
        roomId: roomId,
        userId: userId,
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
    })
    return penalties[0];
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
