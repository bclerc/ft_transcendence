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

  async createGame(user: BasicUserI): Promise<Game>{
    if (user) {
      return this.prisma.game.create({
        data: {
          users: {
            connect: {
              id: user.id
            },
          },
        },
      })
    }
  }

  async addPlayerToGame(gameId: number, userId: number): Promise<Game> {
    const game = await this.getGameById(gameId);
    if (game && game.users) {
      if (game.users.length < 2) {
        return this.prisma.game.update({
          where: {
            id: gameId
          },
          data: {
            users: {
              connect: {
                id: userId
              }
            }
          }
        });
    }
  }
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
    // console.log("game", game);
    if (game.state != GameState.STARTED) {
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

      // get leaderboard position


      await this.prisma.user.update({
        where: {
          id: winnerId
        },
        data: {
          score: {
            increment: winnerScore
          }
        }
      });

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

