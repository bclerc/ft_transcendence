import { Controller, Request, Get, Body, Post, UseGuards, Res, Req, HttpException, HttpCode, UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { FortyTwoGuard } from './auth/guards/FortyTwo.guard';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserService } from './user/user.service';
import { Jwt2faAuthGuard } from './auth/guards/jwt2fa.guard';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService) {}


  @Get('/')
  @UseGuards(Jwt2faAuthGuard)
  async lol (@Request() req: any) {
      return (req.user);
  } 
  

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user.id, false);
  }

  @Get('auth/42')
  @UseGuards(FortyTwoGuard)
  async login42() {}

  @Get('auth/42/callback')
  @UseGuards(FortyTwoGuard)
  async callback(@Req() req: any) {
    return this.authService.login(req.user.id, false);
  }

  @Post('auth/2fa')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body: any) {
    const isCodeValid = this.authService.verify2FACode(request.user, body.twoFactorAuthenticationCode);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.authService.login(request.user, true);
  } 

  @Get('auth/test')
  @UseGuards(JwtAuthGuard)
  async generate2FACode(@Request() req: any) {
    const user: User = req.user;
    this.authService.generate2FASecret(user);
    this.userService.set2FAEnable(user.id)
    }
  @Post('auth/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@Request() req: any, @Body() data: any) {
    if (this.authService.verify2FACode(req.user, data.code)) {
      const user: User = req.user;
      this.userService.set2FAEnable(user.id);
      return ;
    }
    throw new HttpException('Invalid 2FA code', 401);
  } 
}
