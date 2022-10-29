import { Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';

@Injectable()
export class GameService {


  constructor( 
     private prisma: PrismaService
  ) {}


  async createGame(users: BasicUserI[]): Promise<Game>{
    if (users.length < 2 || users.length > 2)
      throw new Error("Invalid number of users");
      return this.prisma.game.create({
        data: {
          users: {
            connect: users.map(user => {
              return {id: user.id}
            }
           )
          },
        },
      })
  }

}
