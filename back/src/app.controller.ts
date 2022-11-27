import { Controller, Request, Get, Body, Post, UseGuards, Res, Req, HttpException, HttpCode, UnauthorizedException, ConsoleLogger } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { FortyTwoGuard } from './auth/guards/FortyTwo.guard';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserService } from './user/user.service';
import { JwtNewToken } from './auth/interfaces/jwttoken.interface';
import { AuthGuard } from '@nestjs/passport';
import { env } from 'process';
import { getSystemErrorMap } from 'util';
import { ConfigService } from '@nestjs/config';

@Controller('app')
export class AppController {
  constructor( private readonly configService: ConfigService) {}

  @Get("")
  redirect_front(@Res() res) {
    res.redirect(this.configService.get('FRONT_URL'));
  }

}
