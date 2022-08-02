import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async newUser(data: any): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async newUserIntra(email: string, usernames: string): Promise<User> {
    return await this.prisma.user.create({ 
		data: {
			email: email,
			password: '',
	}});
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
