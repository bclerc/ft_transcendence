import { Injectable } from '@nestjs/common';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { Game, GameState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';

@Injectable()
export class GameService {


  constructor( 
     private prisma: PrismaService
  ) {}


  async getAllGam(): Promise<Game[]> {
    return await this.prisma.game.findMany({
      include: {
        users: true,
        winner: true,
        loser: true,
      }
    });
  }

  async getAllRunningGames(): Promise<Game[]> {

    return await this.prisma.game.findMany({
      where: {
        state: GameState.STARTED
      },
      include: {
        users: true,
        winner: true,
        loser: true,
      }
    });
  }

  async createGame(users: BasicUserI[]): Promise<Game>{
    if (users.length < 2 || users.length > 2)
      throw new Error("Invalid number of users");
      return this.prisma.game.create({
        data: {
          users: {
            connect: users.map(user => {
              return {id: user.id}
            })
          },
        },
      })
  }

  async getGameById(id: number): Promise<Game> {
    return await this.prisma.game.findFirst({
      where: {
        id: id
      }
    });
  }
}

