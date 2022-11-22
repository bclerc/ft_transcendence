import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';
import { dbGame } from 'src/pong/interfaces/game.interface';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { GameService } from './game.service';

@Controller('game')

export class GameController {
  constructor(private readonly gameService: GameService) {


  }

  @UseGuards(Jwt2faAuthGuard)
  @Get(':id')
  async getGameById(@Param('id') id: number): Promise<dbGame> {
    return await this.gameService.getGameById(Number(id));
  }

  @UseGuards(Jwt2faAuthGuard)
  @Post('leaderboard')
  async getLeaderboard(): Promise<BasicUserI[]> {
    return await this.gameService.getLeaderboard();
  }

}
