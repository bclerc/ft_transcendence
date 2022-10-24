import { Catch, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FriendRequest, FriendStatus, Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthController } from 'src/auth/auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { string } from 'yargs';
import { newIntraUserDto } from './dto/newIntraUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { BasicUserI } from './interface/basicUser.interface';
import { UserInfoI } from './interface/userInfo.interface';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

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
          password: '123456',
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
          password: '123456',
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
          password: '',
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

    for (const user of users)
      delete user['password'];
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
          intra_name: true,
          email: true,
          avatar_url: true,
          friends: true,
          friendOf: true,
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

  async getBasicUser(id: number): Promise<BasicUserI> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        state: true,
        intra_name: true,
        email: true,
        avatar_url: true,
      },
    });
    return user;
  }

  async getFriends(userID: number): Promise<any[]> {
    const friends = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            friends: {
              some: {
                id: userID,
              },
            },
          },
          {
            friendOf: {
              some: {
                id: userID,
              }
            },
          },
        ],
      },
      select: {
        id: true,
        intra_name: true,
        email: true,
        avatar_url: true,
        displayname: true,
      },
    });
    return friends;
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

  async addFriend(userId: number, friendId: number) {
    await this.prisma.friendRequest.create({
      data: {
        from: {
          connect: {
            id: userId,
          },
        },
        to: {
          connect: {
            id: friendId,
          },
        },
        status: FriendStatus.PENDING,
      },
    });
    return { message: 'Friend request sent' };
  }

  async acceptFriend(requestIs: number) {
     let request: FriendRequest = await this.prisma.friendRequest.update({
        where: {
          id: Number(requestIs),
        },
        data: {
          status: FriendStatus.ACCEPTED,
        },
      });
      await this.prisma.user.update({
        where: {
          id: request.fromId,
        },
        data: {
          friends: {
            connect: {
              id: request.toId,
            }
          }
        }
      });
      return { message: "Friend request accepted" };
  }

  async declineFriend(requestIs: number) {
    await this.prisma.friendRequest.update({
      where: {
        id: Number(requestIs),
      },
      data: {
        status: FriendStatus.DECLINED,
      },
    });
    return { message: "Friend request declined" };
  }

  async getFriendRequests(userId: number): Promise<FriendRequest[]> {
    const users: FriendRequest[] = await this.prisma.friendRequest.findMany({
      where: {
        toId: Number(userId),
        status: FriendStatus.PENDING,
      },
      include: {
        from: {
          select: {
            id: true,
            intra_name: true,
            avatar_url: true,
            displayname: true,
          },
        },
        to: {
          select: {
            id: true,
            intra_name: true,
            avatar_url: true,
            displayname: true,
          },
        },
      },
    });
    return users;
  }
  

  async removeFriend(userId: number, friendId: number) {
    await this.prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        friends: {
          disconnect: {
            id: Number(friendId),
          },
        },
        friendOf: {
          disconnect: {
            id: Number(friendId),
          },
        }
      },
    });
  }

  async haveFriend(userId: number, friendId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        friends: {
          where: {
            id: Number(friendId),
          },
        },
        friendOf: {
          where: {
            id: Number(friendId),
          }
        }
      },
    });
    return user.friends.length > 0 || user.friendOf.length > 0;
  }

}
