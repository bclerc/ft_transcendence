import { Injectable } from '@nestjs/common';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { Game, GameState, UserState } from '@prisma/client';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { dbGame } from 'src/pong/interfaces/game.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameService {


  constructor( 
     private prisma: PrismaService,
     private userService: UserService
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

  
  async getGameById(id: number): Promise<dbGame> {
    return await this.prisma.game.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        state: true,
        winner: true,
        loser: true,
        users: true,
      }
    });

  }

  async startGame(id: number): Promise<Game> {
    const game = await this.getGameById(id);

    if (game.state != GameState.STARTED && game.users.length == 2) {
        await this.userService.setStates(game.users, UserState.INGAME);
        return await this.prisma.game.update({
          where: {
            id: id
          },
          data: {
            state: GameState.STARTED
          }
        })
      }
      return null;
    }


  async stopGame(id: number, winnerId: number, loserId: number, loserScore: number, winnerScore: number): Promise<Game> {
    
    const game = await this.getGameById(id);

    if (game && game.users)
    {
      this.userService.setState(winnerId, UserState.ONLINE);
      this.userService.setState(loserId, UserState.ONLINE);
      
      return await this.prisma.game.update({
        where: {
          id: id
        },
        data: {
          state: GameState.ENDED,
          winnerId: winnerId,
          loserId: loserId,
          winnerScore: winnerScore,
          loserScore: loserScore,
        }
      })
    }
    return null;
  }
}

