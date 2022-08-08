import { Controller, Request, Get, Body, Post, UseGuards, Res, Req, HttpException, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { Jwt2faAuthGuard } from './auth/guards/jwt2fa.guard';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) {}

  /**
   * Pour tester en developement
   * rediriger vers la page d'accueil du site en prod. 
   */

  @Get('/')
  @UseGuards(Jwt2faAuthGuard)
  async lol (@Request() req: any) {
      return (req.user);
  } 

}
