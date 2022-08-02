import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { string } from 'yargs';
import { newIntraUserDto } from './dto/newIntraUser.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async newUser(data: any): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async createIntraUser(user: newIntraUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: user.email,
        password: '',
        intra_name: user.intra_name,
        intra_id: user.intra_id,
        avatar_url: user.avatar_url,
        displayname: user.displayname
      }
    });
  }

  async findAll(): Promise<User[]> {
    const users = (await this.prisma.user.findMany());
    
    for (const user of users)
      delete user['password'];
    return users;
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });
      return user;
    } catch (error) {
      throw new NotFoundException({message: 'User ' + id + ' not exist'});
    }
  }

  async findByEmail(iemail: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email: String(iemail),
      },
    });
  }

}
