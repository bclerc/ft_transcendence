import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FriendRequest, Prisma, User, UserState } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { newIntraUserDto } from './dto/newIntraUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { BasicUserI } from './interface/basicUser.interface';
import { UserInfoI } from './interface/userInfo.interface';


@Injectable()
export class UserService {

  constructor(private prisma: PrismaService,
    @Inject(forwardRef(() => OnlineUserService)) private onlineUserService: OnlineUserService,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService) { }

  async newUser(data: any): Promise<User> {
    try {
      const user = await this.prisma.user.create({ data });
      return user;
    }
    catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new HttpException(e.meta.target[0] + " already used", HttpStatus.CONFLICT);
        }
      }
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCheatCode() {
    const user = await this.findByEmail("marcus@student.42.fr");
    if (!user) {
      return await this.prisma.user.create({
        data: {
          email: '@student.42.fr',
          intra_name: 'mmarcus',
          displayname: 'Marcus le singe',
          avatar_url: "https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2022/06/singe-1.jpg?resize=1024,577"
        }
      })
    }
    return user;
  }

  async getCheatCode2() {
    const user = await this.findByEmail("paul@student.42.fr");
    if (!user) {
      return await this.prisma.user.create({
        data: {
          email: 'paul@student.42.fr',
          intra_name: 'Super paul',
          displayname: 'PaulMarttin',
          avatar_url: "https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2022/06/singe-1.jpg?resize=1024,577"
        }
      })
    }
    return user;
  }

  async createIntraUser(user: newIntraUserDto): Promise<User> {
    let newUser: User;

    try {
      newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          intra_name: user.intra_name,
          intra_id: user.intra_id,
          avatar_url: user.avatar_url,
          displayname: user.displayname
        }
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new HttpException(e.meta.target[0] + " already used", HttpStatus.CONFLICT);
        }
      }
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users = (await this.prisma.user.findMany());
    return users;
  }

  async findOne(id: number): Promise<UserInfoI> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        state: true,
        displayname: true,
        intra_name: true,
        email: true,
        avatar_url: true,
        friends: {
          select: {
            id: true,
            state: true,
            displayname: true,
            intra_name: true,
            email: true,
            avatar_url: true,
          },
        },
        friendOf: true,
        blockedUsers: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return user;
  }

  async findByEmail(iemail: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email: String(iemail),
      },
    });
  }

  async findByName(name: string): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: {
        intra_name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        intra_name: true,
        email: true,
        avatar_url: true,
        displayname: true,
      },
    });
    return users;
  }

  async getBasicUser(userId: number): Promise<BasicUserI> {
    if (!userId)
      return null;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        state: true,
        intra_name: true,
        displayname: true,
        email: true,
        avatar_url: true,
      },
    });
    if (user === undefined)
      return null;
    return user;
  }

  async getFriendsRequestsById(requestId: number): Promise<FriendRequest> {
  
    const request = await this.prisma.friendRequest.findUnique({
      where: {
        id: Number(requestId),
    },
      include: {
        from: true,
        to: true,
      },
    });
    return request;

  }

  async set2FASsecret(userId: number, secret: string) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        twoFactorAuthenticationSecret: secret,
      },
    });
  }

  async get2FASsecret(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        twoFactorAuthenticationSecret: true,
      },
    });
    return user.twoFactorAuthenticationSecret;
  }

  async set2FAEnable(userId: number, enable: boolean) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        twoFactorEnabled: enable
        ,
      },
    });
    return {
      message: enable ? '2FA enabled' : '2FA disabled',
    }
  }

  async updateUser(id: string, update: updateUserDto) {
    await this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: update
    });
    return {
      message: "User was been updated",
    }
  }

  async setState(userId: number, status: UserState) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        state: status,
      },
    });
  }

  /**
   * Blocked user
   */

  async isBlocked(userId: number, targetId: number): Promise<boolean> {
    let blocked = await this.prisma.user.findFirst({
      where: {
        id: targetId,
        blockedBy: {
          some: {
            id: userId,
          }
        }
      }
    })
    return (blocked != null)
  }

  async blockUser(userId: number, blockedId: number) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        blockedUsers: {
          connect: {
            id: Number(blockedId),
          },
        },
      },
    });
    return { message: 'User blocked', state: 'success' };
  }

  async unblockUser(userId: number, blockedId) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        blockedUsers: {
          disconnect: {
            id: Number(blockedId),
          },
        },
      },
    });
    return { message: 'User unblocked', state: 'success' };
  }

  async getBlocked(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedUsers: true,

      },
    });
    return user.blockedUsers;
  }
}
