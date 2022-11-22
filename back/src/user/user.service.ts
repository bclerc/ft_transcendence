import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FriendRequest, Prisma, User, UserState } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { dataPlayerI } from 'src/pong/interfaces/player.interface';
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
    const user: UserInfoI = await this.prisma.user.findUnique({
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
        games: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            winnerId: {
              not: null,
            },
            loserId: {
              not: null,
            },
          },
          select: {
            id: true,
            users: {
              select: {
                id: true,
                displayname: true,
                avatar_url: true,
              },
            },
            winner: {
              select: {
                id: true,
                displayname: true,
                avatar_url: true,
              },
            },
            loser: {
              select: {
                id: true,
                displayname: true,
                avatar_url: true,
              },
            },
            winnerScore: true,
            loserScore: true,
          },
        },
        blockedUsers: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        score: true,
        _count: {
          select: {
            games_win: true,
            games_lose: true,
            games: true,
          }
        }
      }
    });
    user.position_in_leaderboard = await this.getLeaderboardPosition(user.id);
    return user;
  }

  async findByEmail(iemail: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email: String(iemail),
      },
    });
  }

  async getDataPlayer(id: number): Promise<dataPlayerI>
  {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        displayname: true,
        intra_name: true,
      },
    });
    return user;
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

  async getProfileUser(userId: number): Promise<any> {
    if (!userId)
      return null;
    const user:any = await this.prisma.user.findUnique({
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
        score: true,
        games: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            winnerId: {
              not: null,
            },
            loserId: {
              not: null,
            },
          },
          include: {
            winner: {
              select: {
                id: true,
                displayname: true,
                avatar_url: true,
              },
            },
            loser: {
              select: {
                id: true,
                displayname: true,
                avatar_url: true,
              },
            },
          },
        },
        _count: {
          select: {
            games_win: true,
            games_lose: true,
            games: true,
          }
        }
      },
     // position_in_leaderboard : true,

    });
    user.position_in_leaderboard = await this.getLeaderboardPosition(user.id);
   // console.log(user.position_in_leaderboard );

    if (user === undefined)
      return null;
    console.log(user);
    return user;
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
        score: true,
        _count: {
          select: {
            games_win: true,
            games_lose: true,
            games: true,
          }
        }
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
    try {
      await this.prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          displayname: update.displayname,
          avatar_url: update.avatar_url,
        }
      });
      return {
        message: "User was been updated",
      }
    } catch (unique: any) {
      if (unique.code === 'P2002') {
        throw new HttpException(unique.meta.target[0] + " already used", HttpStatus.CONFLICT);
      }
      throw new HttpException(unique, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async setState(userId: number, status: UserState) {
    if (userId && status) {
      await this.prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          state: status,
        },
      });
    }
  }

  async setStates(users: BasicUserI[], status: UserState) {
    if (users && status) {
      for (const user of users) {
        const loggedUser: boolean = this.onlineUserService.getUser(null, user.id) !== undefined;
        await this.prisma.user.update({
          where: {
            id: Number(user.id),
          },
          data: {
            state: loggedUser ? status : UserState.OFFLINE,
          },
        });
      }
    }
  }

  async getFriends(userId: number): Promise<BasicUserI[]> {
    const user: any = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        friends: {
          select: {
            id: true,
            state: true,
            displayname: true,
            intra_name: true,
            email: true,
            avatar_url: true,
            score: true,
            _count: {
              select: {
                games_win: true,
                games_lose: true,
                games: true,
              }
            }
          },
          orderBy: {
            state: 'desc',
          },
        },
      },
    });

    for (const friend of user.friends) {
      friend.position_in_leaderboard = await this.getLeaderboardPosition(friend.id);
    }
    return user.friends;
  }

  async getLeaderboardPosition(userId: number): Promise<number> {
    const leaderboard = await this.prisma.user.findMany({
      orderBy: {
        score: 'desc',
      },
      select: {
        id: true,
      },
    });
    return leaderboard.findIndex((user) => user.id === userId) + 1;
  }

  /**
   * Blocked user
   */

  async isBlocked(userId: number, targetId: number): Promise<boolean> {
    let blocked = await this.prisma.user.findFirst({
      where: {
        id: Number(targetId),
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


  async disconnectAll() {
    await this.prisma.user.updateMany({
      data: {
        state: UserState.OFFLINE,
      },
    });
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
